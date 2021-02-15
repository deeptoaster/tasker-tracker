import { createContext } from 'react';

export const CONFIG_DEFAULT: Config = {
  clientId: '',
  clientSecret: '',
  trackers: [
    {
      options: ['Spam', 'Eggs', 'Ham'],
      sheetId: '',
      sheetName: 'Sheet1',
      title: 'Breakfast'
    }
  ]
};

export const TRACKER_DEFAULT: Tracker = {
  options: [],
  sheetId: '',
  sheetName: 'Sheet1',
  title: ''
};

export const FILE_TYPES = ['application/xml', 'text/xml'];

export type Config = {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly trackers: ReadonlyArray<Tracker>;
};

export type Tracker = {
  readonly options: ReadonlyArray<string>;
  readonly sheetId: string;
  readonly sheetName: string;
  readonly title: string;
};

export const ErrorContext = createContext<(error: Error) => void>(() => {});

export async function parseFromFile(file: File): Promise<Config> {
  if (!FILE_TYPES.includes(file.type)) {
    throw new Error('Config files must be in Tasker XML format.');
  }

  const value = await file.text();
  const parser = new DOMParser();

  const document = parser.parseFromString(
    value,
    file.type as DOMParserSupportedType
  );

  throw new Error('File upload is not yet supported.');
}
