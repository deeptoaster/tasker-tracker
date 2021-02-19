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
  options: [''],
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

type GlobalField =
  | 'append'
  | 'auth'
  | 'first'
  | 'get'
  | 'timestamp'
  | 'widgetBusy'
  | 'widgetFree';

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
  }
}

export type Tracker = {
  readonly options: ReadonlyArray<string>;
  readonly sheetId: string;
  readonly sheetName: string;
  readonly title: string;
};

type TrackerField = 'append' | 'display' | 'open' | 'profile' | 'project';

export const ErrorContext = createContext<(error: Error) => void>(() => {});

function* makeIdGenerator(): Generator<
  number,
  never,
  [GlobalField] | [number, TrackerField | number]
> {
  const keys: { [key: string]: number } = {};
  let id = 0;
  let key = '';

  while (true) {
    key = (yield keys[key]).join();

    if (!(key in keys)) {
      keys[key] = id++;
    }
  }
}

export function exportToBlob(config: Config): Blob {
  const idGenerator = makeIdGenerator();
  const now = Date.now();
  const text = ['<TaskerData sr="" dvi="1" tv="5.11.14">\n'];

  idGenerator.next();

  config.trackers.forEach((tracker: Tracker, trackerIndex: number): void => {
    const openId = idGenerator.next([trackerIndex, 'open']).value;
    const profileId = idGenerator.next([trackerIndex, 'profile']).value;

    text.push(
      `  <Profile sr="prof${profileId}" ve="2">\n`,
      `    <cdate>${now}</cdate>\n`,
      '    <flags>10</flags>\n',
      `    <id>${profileId}</id>\n`,
      `    <mid0>${openId}</mid0>\n`,
      '    <Event sr="con0" ve="2">\n',
      '       <code>2000</code>\n',
      '      <pri>0</pri>\n',
      '      <App sr="arg0">\n',
      '        <appClass>net.dinglisch.android.taskerm.Tasker</appClass>\n',
      '        <appPkg>net.dinglisch.android.taskerm</appPkg>\n',
      '        <label>Tasker</label>\n',
      '      </App>\n',
      `      <Str sr="arg1" ve="3">Current ${tracker.title}</Str>\n`,
      '    </Event>\n',
      '  </Profile>\n'
    );
  });

  const appendId = idGenerator.next(['append']).value;
  const authId = idGenerator.next(['auth']).value;
  const firstId = idGenerator.next(['first']).value;
  const getId = idGenerator.next(['get']).value;
  const timestampId = idGenerator.next(['timestamp']).value;
  const widgetBusyId = idGenerator.next(['widgetBusy']).value;
  const widgetFreeId = idGenerator.next(['widgetFree']).value;

  text.push(
    '  <Project sr="proj0" ve="2">\n',
    `    <cdate>${now}</cdate>\n`,
    '    <name>Base</name>\n',
    `    <tids>${appendId},${authId},${firstId},${getId},${timestampId},${widgetBusyId},${widgetFreeId}</tids>\n`,
    '    <Img sr="icon" ve="2">\n',
    '      <nme>mw_action_home</nme>\n',
    '    </Img>\n',
    '  </Project>\n'
  );

  config.trackers.forEach((tracker: Tracker, trackerIndex: number): void => {
    const appendId = idGenerator.next([trackerIndex, 'append']).value;
    const displayId = idGenerator.next([trackerIndex, 'display']).value;
    const openId = idGenerator.next([trackerIndex, 'open']).value;
    const profileId = idGenerator.next([trackerIndex, 'profile']).value;

    text.push(
      '  <Project sr="proj0" ve="2">\n',
      `    <cdate>${now}</cdate>\n`,
      '    <name>Base</name>\n',
      `    <pids>${profileId}</pids>\n`,
      `    <tids>${appendId},${displayId},${openId},${tracker.options
        .map(
          (_option: string, optionIndex: number): number =>
            idGenerator.next([trackerIndex, optionIndex]).value
        )
        .join()}</tids>\n`,
      '  </Project>\n'
    );
  });

  return new Blob(text, { type: FILE_TYPES[0] });
}

export async function parseFromBlob(blob: Blob): Promise<Config> {
  if (!FILE_TYPES.includes(blob.type)) {
    throw new Error('Config files must be in Tasker XML format.');
  }

  const value = await blob.text();
  const parser = new DOMParser();

  const document = parser.parseFromString(
    value,
    blob.type as DOMParserSupportedType
  );

  throw new Error('File upload is not yet supported.');
}
