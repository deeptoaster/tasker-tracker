import * as React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';

import type { StageError } from '../defs';

import './SpreadsheetRow.css';

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

  const updateSheetId = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const matches = /\/d\/(\w+)/.exec(event.currentTarget.value);

      setSheetId(matches != null ? matches[1] : event.currentTarget.value);
    },
    [setSheetId]
  );

  const updateSheetName = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void =>
      setSheetName(event.currentTarget.value),
    [setSheetName]
  );

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
          onChange={updateSheetId}
          ref={sheetIdInput}
          type="text"
          value={sheetId}
        />
      </div>
      <div className="input-group">
        <input
          onChange={updateSheetName}
          ref={sheetNameInput}
          type="text"
          value={sheetName}
        />
      </div>
    </div>
  );
}
