import { createContext } from 'react';

export const CONFIG_DEFAULT: Config = {
  clientId: '',
  clientSecret: '',
  sheetName: 'Sheet1',
  trackers: [
    {
      options: ['Spam', 'Eggs', 'Ham'],
      sheetId: '',
      title: 'Breakfast'
    }
  ]
};

export const FILE_TYPES = ['application/xml', 'text/xml'];
export const TAG_TASK = 'Task';
export const TAG_VARIABLE = 'Variable';
export const TASK_APPEND_PREFIX = 'Append ';

export const TRACKER_DEFAULT: Tracker = {
  options: [''],
  sheetId: '',
  title: ''
};

export const VARIABLE_PREFIX = 'Tracker';
export const VARIABLE_SHEET_ID_PREFIX = 'SheetId';

export enum VariableName {
  CLIENT_ID = 'ClientId',
  CLIENT_SECRET = 'ClientSecret',
  SHEET_NAME = 'SheetName'
}

export type Config = {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly sheetName: string;
  readonly trackers: ReadonlyArray<Tracker>;
};

export class StageError extends Error {
  public constructor(message: string, focus: () => void, source: keyof Config);
  public constructor(
    message: string,
    focus: () => void,
    source: Exclude<keyof Tracker, 'options'>,
    trackerIndex: number
  );
  public constructor(
    message: string,
    focus: () => void,
    source: 'options',
    trackerIndex: number,
    optionIndex: number
  );
  public constructor(
    message: string,
    public readonly focus: () => void,
    public readonly source: keyof Config | keyof Tracker,
    public readonly trackerIndex?: number,
    public readonly optionIndex?: number
  ) {
    super(message);
    this.name = 'StageError';
  }
}

export type Tracker = {
  readonly options: ReadonlyArray<string>;
  readonly sheetId: string;
  readonly title: string;
};

export const ErrorContext = createContext<(error: Error) => void>(() => {});
