import JSZip from 'jszip';
import type { JSZipObject } from 'jszip';

import type { Config, Tracker } from '../defs';
import {
  FILE_TYPES,
  FILE_TYPE_DEFAULT,
  SERVICE_PREFIX,
  TASK_APPEND_PREFIX,
  Tag,
  VariableName
} from '../defs';

const TASK_APPEND_REGEX = new RegExp(
  `^${TASK_APPEND_PREFIX}([A-Z]\\w+[\\da-z])$`
);

const VARIABLE_REGEX = new RegExp(`^%${SERVICE_PREFIX}([A-Z]\\w+[\\da-z])$`);

type ConfigBuilder = Partial<{ -readonly [key in keyof Config]: Config[key] }>;

type Option = {
  option: string;
  trackerTitle: string;
};

type ParsedObjects = {
  options: Array<Option>;
  variables: Record<string, string>;
};

type Trackers = Readonly<Record<string, Partial<Tracker>>>;

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
              [, option.trackerTitle] = matches;
            }
          }
        });

        break;
      case 'nme':
        if (childNode.firstChild?.nodeValue != null) {
          option.option = childNode.firstChild.nodeValue;
        }

        break;
      // no default
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
      // no default
    }
  });

  return variable.name != null && variable.value != null
    ? (variable as Variable)
    : null;
}

function getOptionsAndVariables(text: string): ParsedObjects {
  const options: Array<Option> = [];
  const variables: Record<string, string> = {};
  const taskerData = new DOMParser().parseFromString(
    text,
    FILE_TYPE_DEFAULT
  ).firstChild;

  if (taskerData != null) {
    taskerData.childNodes.forEach((node: Node) => {
      let option: Option | null = null;
      let variable: Variable | null = null;

      switch (node.nodeName as Tag) {
        case Tag.TASK:
          option = parseTask(node as Element);

          if (option != null) {
            options.push(option);
          }

          break;
        case Tag.VARIABLE:
          variable = parseVariable(node as Element);

          if (variable != null) {
            variables[variable.name] = variable.value;
          }

          break;
        // no default
      }
    });
  }

  return { options, variables };
}

export default async function parseFromBlobs(files: FileList): Promise<Config> {
  return Promise.all(
    Array.from(files).map(async (file: File): Promise<Array<ParsedObjects>> => {
      if (!FILE_TYPES.includes(file.type)) {
        throw new Error(
          'Config must be in Tasker XML format or compressed as a ZIP.'
        );
      }

      return JSZip.loadAsync(file)
        .then(
          async (zip: JSZip): Promise<Array<ParsedObjects>> =>
            Promise.all(
              Object.values(zip.files).map(
                async (subfile: JSZipObject): Promise<ParsedObjects> =>
                  subfile.async('string').then(getOptionsAndVariables)
              )
            )
        )
        .catch(
          async (): Promise<Array<ParsedObjects>> =>
            file.text().then(getOptionsAndVariables).then(Array.of)
        );
    })
  ).then((allParsedObjects: Array<Array<ParsedObjects>>): Config => {
    const { options, variables } = ([] as Array<ParsedObjects>)
      .concat(...allParsedObjects)
      .reduce(
        (
          { options, variables }: ParsedObjects,
          parsedObjects: ParsedObjects
        ): ParsedObjects => ({
          options: options.concat(parsedObjects.options),
          variables: Object.assign(variables, parsedObjects.variables)
        }),
        { options: [], variables: {} }
      );

    const config: ConfigBuilder = {};

    const trackers: ReadonlyArray<Tracker> = Object.values(
      options.reduce(
        (trackers: Trackers, option: Option): Trackers => ({
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
          (trackers: Trackers, [name, value]: [string, string]): Trackers =>
            name.startsWith(VariableName.SHEET_ID)
              ? {
                  ...trackers,
                  [name.slice(VariableName.SHEET_ID.length)]: {
                    ...trackers[name.slice(VariableName.SHEET_ID.length)],
                    sheetId: value,
                    title: name.slice(VariableName.SHEET_ID.length)
                  }
                }
              : name.startsWith(VariableName.SHEET_NAME)
                ? {
                    ...trackers,
                    [name.slice(VariableName.SHEET_NAME.length)]: {
                      ...trackers[name.slice(VariableName.SHEET_NAME.length)],
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
      throw new Error('Invalid or incomplete Tasker Tracker config uploaded.');
    }
  });
}
