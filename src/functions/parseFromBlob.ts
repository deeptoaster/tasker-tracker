import {
  Config,
  FILE_TYPES,
  TAG_TASK,
  TAG_VARIABLE,
  TASK_APPEND_PREFIX,
  Tracker,
  VARIABLE_PREFIX,
  VariableName
} from '../TrackerDefs';

const TASK_APPEND_REGEX = new RegExp(
  `^${TASK_APPEND_PREFIX}([A-Z]\\w+[\\da-z])$`
);

const VARIABLE_REGEX = new RegExp(`^%${VARIABLE_PREFIX}([A-Z]\\w+[\\da-z])$`);

type ConfigBuilder = Partial<
  {
    -readonly [key in keyof Config]: Config[key];
  }
>;

type Option = {
  option: string;
  trackerTitle: string;
};

type Variable = {
  name: string;
  value: string;
};

function parseTask(optionNode: Element): Option | null {
  const option: Partial<Option> = {};

  optionNode.childNodes.forEach((childNode: Node) => {
    switch (childNode.nodeName) {
      case 'Action':
        childNode.childNodes.forEach((grandchildNode: Node) => {
          if (
            grandchildNode.nodeName === 'Str' &&
            (grandchildNode as Element).getAttribute('sr') === 'arg0' &&
            grandchildNode.firstChild?.nodeValue != null
          ) {
            const matches = TASK_APPEND_REGEX.exec(
              grandchildNode.firstChild.nodeValue
            );

            if (matches != null) {
              option.trackerTitle = matches[1];
            }
          }
        });

        break;
      case 'nme':
        if (childNode.firstChild?.nodeValue != null) {
          option.option = childNode.firstChild.nodeValue;
        }

        break;
    }
  });

  return option.option != null && option.trackerTitle != null
    ? (option as Option)
    : null;
}

function parseVariable(variableNode: Element): Variable | null {
  const variable: Partial<Variable> = {};

  variableNode.childNodes.forEach((childNode: Node) => {
    switch (childNode.nodeName) {
      case 'n':
        if (childNode.firstChild?.nodeValue != null) {
          const matches = VARIABLE_REGEX.exec(childNode.firstChild.nodeValue);

          if (matches != null) {
            variable.name = matches[1] as VariableName;
          }
        }

        break;
      case 'v':
        if (childNode.firstChild?.nodeValue != null) {
          variable.value = childNode.firstChild.nodeValue;
        }

        break;
    }
  });

  return variable.name != null && variable.value != null
    ? (variable as Variable)
    : null;
}

export default async function parseFromBlob(blob: Blob): Promise<Config> {
  if (!FILE_TYPES.includes(blob.type)) {
    throw new Error('Config files must be in Tasker XML format.');
  }

  const options: Array<Option> = [];
  const text = await blob.text();
  const variables: { [name: string]: string } = {};

  const taskerData = new DOMParser().parseFromString(
    text,
    blob.type as DOMParserSupportedType
  ).firstChild;

  if (taskerData != null) {
    taskerData.childNodes.forEach((node: Node) => {
      let option: Option | null;
      let variable: Variable | null;

      switch (node.nodeName) {
        case TAG_TASK:
          option = parseTask(node as Element);

          if (option != null) {
            options.push(option);
          }

          break;
        case TAG_VARIABLE:
          variable = parseVariable(node as Element);

          if (variable != null) {
            variables[variable.name] = variable.value;
          }

          break;
      }
    });
  }

  const config: ConfigBuilder = {};

  const trackers: ReadonlyArray<Tracker> = Object.values(
    options.reduce(
      (
        trackers: { readonly [title: string]: Partial<Tracker> },
        option: Option
      ): { readonly [title: string]: Partial<Tracker> } => ({
        ...trackers,
        [option.trackerTitle]: {
          ...trackers[option.trackerTitle],
          options: [
            ...(option.trackerTitle in trackers
              ? trackers[option.trackerTitle].options ?? []
              : []),
            option.option
          ]
        }
      }),
      Object.entries(variables).reduce(
        (
          trackers: { readonly [title: string]: Partial<Tracker> },
          [name, value]: [string, string]
        ): { readonly [title: string]: Partial<Tracker> } =>
          name.startsWith(VariableName.SHEET_ID)
            ? {
                ...trackers,
                [name.slice(VariableName.SHEET_ID.length)]: {
                  sheetId: value,
                  title: name.slice(VariableName.SHEET_ID.length)
                }
              }
            : name.startsWith(VariableName.SHEET_NAME)
            ? {
                ...trackers,
                [name.slice(VariableName.SHEET_NAME.length)]: {
                  sheetName: value,
                  title: name.slice(VariableName.SHEET_NAME.length)
                }
              }
            : trackers,
        {}
      )
    )
  ).filter(
    (tracker: Partial<Tracker>): boolean =>
      tracker.options != null &&
      tracker.sheetId != null &&
      tracker.sheetName != null &&
      tracker.title != null
  ) as ReadonlyArray<Tracker>;

  if (trackers.length !== 0) {
    config.trackers = trackers;
  }

  if (VariableName.CLIENT_ID in variables) {
    config.clientId = variables[VariableName.CLIENT_ID];
  }

  if (VariableName.CLIENT_SECRET in variables) {
    config.clientSecret = variables[VariableName.CLIENT_SECRET];
  }

  if (
    config.clientId != null &&
    config.clientSecret != null &&
    config.trackers != null
  ) {
    return config as Config;
  } else {
    throw new Error('Invalid Tasker Tracker config file uploaded.');
  }
}
