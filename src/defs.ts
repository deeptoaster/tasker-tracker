import { MouseEvent, ReactNode } from 'react';

export const TRACKER_DEFAULT: Tracker = {
  options: [''],
  sheetId: '',
  sheetName: 'Sheet1',
  title: ''
};

export const CONFIG_DEFAULT: Config = {
  clientId: '',
  clientSecret: '',
  trackers: [
    {
      ...TRACKER_DEFAULT,
      options: ['Spam', 'Eggs', 'Ham'],
      title: 'Breakfast'
    }
  ]
};

export const FILE_TYPE_DEFAULT: DOMParserSupportedType = 'application/xml';
export const FILE_TYPES = [FILE_TYPE_DEFAULT, 'application/zip', 'text/xml'];
export const PROJECT_BASE = 'Base';
export const SERVICE_PREFIX = 'TT';
export const TASK_APPEND_PREFIX = 'Append ';
export const TRANSITION_DURATION = { enter: 1200, exit: 300 };

export enum Tag {
  TASK = 'Task',
  VARIABLE = 'Variable'
}

export enum VariableName {
  CLIENT_ID = 'ClientId',
  CLIENT_SECRET = 'ClientSecret',
  SHEET_ID = 'SheetId',
  SHEET_NAME = 'SheetName',
  TIMEZONE = 'Timezone'
}

export const TAG_PREFIXES: { [tag in Tag]: string } = {
  [Tag.TASK]: 'task',
  [Tag.VARIABLE]: 'vars'
};

type ButtonClickableProps = {
  readonly onClick: (event: MouseEvent) => void;
};

export type ClickableProps = CommonClickableProps &
  (ButtonClickableProps | LinkClickableProps);

type CommonClickableProps = {
  readonly children?: ReactNode;
};

export type Config = {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly trackers: ReadonlyArray<Tracker>;
};

type LinkClickableProps = {
  readonly download?: string;
  readonly external?: boolean;
  readonly href: string;
  readonly onClick?: (event: MouseEvent) => void;
};

export type SpreadableClickableProps = CommonClickableProps &
  Partial<ButtonClickableProps & LinkClickableProps>;

export enum Stage {
  EDIT_TRACKERS,
  API_SETTINGS,
  SPREADSHEET_SETTINGS,
  DOWNLOAD,
  length
}

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
  readonly sheetName: string;
  readonly title: string;
};
