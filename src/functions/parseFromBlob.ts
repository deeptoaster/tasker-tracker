import { Config, FILE_TYPES, TAG_TASK } from '../TrackerUtils';

type Option = {
  option: string;
  trackerTitle: string;
};

// type WritableConfig = {
//   -readonly [key in keyof Config]: Config[key];
// };

function parseTask(profileNode: Element): Option | null {
  const option: Partial<Option> = {};

  profileNode.childNodes.forEach((childNode: Node) => {
    switch (childNode.nodeName) {
      case 'Action':
        childNode.childNodes.forEach((grandchildNode: Node) => {
          if (
            grandchildNode.nodeName === 'Str' &&
            (grandchildNode as Element).getAttribute('sr') === 'arg0' &&
            grandchildNode.firstChild?.nodeValue != null
          ) {
            const matches = /^Append ([A-Z]\w+[\da-z])$/.exec(
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

  console.log(option);

  return option.option != null && option.trackerTitle != null
    ? (option as Option)
    : null;
}

export default async function parseFromBlob(blob: Blob): Promise<Config> {
  if (!FILE_TYPES.includes(blob.type)) {
    throw new Error('Config files must be in Tasker XML format.');
  }

  const options: Array<Option> = [];
  const value = await blob.text();

  const taskerData = new DOMParser().parseFromString(
    value,
    blob.type as DOMParserSupportedType
  ).firstChild;

  if (taskerData != null) {
    taskerData.childNodes.forEach((node: Node) => {
      let option: Option | null;

      switch (node.nodeName) {
        case TAG_TASK:
          option = parseTask(node as Element);

          if (option != null) {
            options.push(option);
          }

          break;
      }
    });
  }

  throw new Error('File upload is not yet supported.');
}
