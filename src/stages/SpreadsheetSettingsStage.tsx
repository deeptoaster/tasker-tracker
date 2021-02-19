import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { StageError, Tracker } from '../TrackerUtils';
import SpreadsheetRow from '../SpreadsheetRow';

import './SpreadsheetSettingsStage.css';

export default function SpreadsheetSettingsStage(props: {
  setSheetName: (sheetName: string) => void;
  setStageError: (stageError: StageError | null) => void;
  setTrackers: (trackers: ReadonlyArray<Tracker>) => void;
  sheetName: string;
  stageError: StageError | null;
  trackers: ReadonlyArray<Tracker>;
}): JSX.Element {
  const {
    setSheetName,
    setStageError,
    setTrackers,
    sheetName,
    stageError,
    trackers
  } = props;
  const [focused, setFocused] = useState<boolean>(false);

  const blur = useCallback((): void => setFocused(false), []);

  const focus = useCallback((): void => setFocused(true), []);

  const setPartialTracker = useCallback(
    (trackerIndexToChange: number, partialTracker: Partial<Tracker>): void =>
      setTrackers(
        trackers.map(
          (tracker: Tracker, trackerIndex: number): Tracker =>
            trackerIndex === trackerIndexToChange
              ? { ...tracker, ...partialTracker }
              : tracker
        )
      ),
    [setTrackers, trackers]
  );

  const setTrackerSheetId = useCallback(
    (trackerIndex: number, sheetId: string): void =>
      setPartialTracker(trackerIndex, { sheetId }),
    [setPartialTracker]
  );

  useEffect((): void => {
    try {
      const sheetIdEmptyIndex = trackers.findIndex(
        (tracker: Tracker): boolean => tracker.sheetId === ''
      );

      if (sheetIdEmptyIndex !== -1) {
        throw new StageError(
          'Spreadsheet URL or ID cannot be empty.',
          focus,
          'sheetId',
          sheetIdEmptyIndex
        );
      }

      if (sheetName === '') {
        throw new StageError('Sheet Name cannot be empty.', focus, 'sheetName');
      }

      setStageError(null);
    } catch (error) {
      if (error instanceof StageError) {
        setStageError(error);
      } else {
        throw error;
      }
    }
  }, [focus, setStageError, sheetName, trackers]);

  return (
    <div>
      <h2>One last thing&mdash;the spreadsheets.</h2>
      <article className="api-card">
        <h3>Spreadsheet Settings</h3>
        <p>
          Each tracker records its data in a separate sheet on Google Sheets.
        </p>
        <p>
          After creating the spreadsheets in which you'd like to record your
          tracked events, enter their details below.
        </p>
        <form>
          <div className="form-control" key={null}>
            <label />
            <label className="input-group spreadsheet-id-input-group">
              Spreadsheet URL or ID
            </label>
            <label className="input-group">Sheet Name</label>
          </div>
          {trackers.map(
            (tracker: Tracker, trackerIndex: number): JSX.Element => (
              <SpreadsheetRow
                key={trackerIndex}
                onFocus={blur}
                setSheetId={(sheetId: string): void =>
                  setTrackerSheetId(trackerIndex, sheetId)
                }
                setSheetName={setSheetName}
                sheetId={tracker.sheetId}
                sheetName={sheetName}
                stageError={
                  focused &&
                  ((stageError?.source === 'sheetId' &&
                    stageError.trackerIndex === trackerIndex) ||
                    (stageError?.source === 'sheetName' && trackerIndex === 0))
                    ? stageError
                    : null
                }
                title={tracker.title}
                trackerIndex={trackerIndex}
              />
            )
          )}
        </form>
      </article>
    </div>
  );
}
