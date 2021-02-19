import * as React from 'react';
import { ChangeEvent, useEffect, useRef } from 'react';

import { StageError } from './TrackerUtils';

export default function SpreadsheetRow(props: {
  onFocus: () => void;
  setSheetId: (sheetId: string) => void;
  setSheetName: (sheetName: string) => void;
  sheetId: string;
  sheetName: string;
  stageError: StageError | null;
  title: string;
  trackerIndex: number;
}): JSX.Element {
  const {
    onFocus,
    setSheetId,
    setSheetName,
    sheetId,
    sheetName,
    stageError,
    title,
    trackerIndex
  } = props;

  const sheetIdInput = useRef<HTMLInputElement>(null);
  const sheetNameInput = useRef<HTMLInputElement>(null);

  useEffect((): void => {
    if (stageError?.source === 'sheetId') {
      sheetIdInput.current?.focus();
      onFocus();
    } else if (stageError?.source === 'sheetName') {
      sheetNameInput.current?.focus();
      onFocus();
    }
  }, [onFocus, stageError]);

  return (
    <div className="form-control">
      <label htmlFor={`spreadsheet-sheet-${trackerIndex}-id`}>{title}</label>
      <div className="input-group spreadsheet-id-input-group">
        <input
          id={`spreadsheet-sheet-${trackerIndex}-id`}
          onChange={(event: ChangeEvent<HTMLInputElement>): void =>
            setSheetId(
              /(?<=\/d\/)\w+/.exec(event.currentTarget.value)?.join() ??
                event.currentTarget.value
            )
          }
          ref={sheetIdInput}
          type="text"
          value={sheetId}
        />
      </div>
      <div className="input-group">
        <input
          onChange={(event: ChangeEvent<HTMLInputElement>): void =>
            setSheetName(event.currentTarget.value)
          }
          ref={sheetNameInput}
          type="text"
          value={sheetName}
        />
      </div>
    </div>
  );
}
