import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Card } from 'squiffles-components';

import SpreadsheetRow from '../components/SpreadsheetRow';
import { StageError } from '../defs';
import type { Tracker } from '../defs';

export default function SpreadsheetSettingsStage(props: {
  setStageError: (stageError: StageError | null) => void;
  setTrackers: (trackers: ReadonlyArray<Tracker>) => void;
  stageError: StageError | null;
  trackers: ReadonlyArray<Tracker>;
}): JSX.Element {
  const { setStageError, setTrackers, stageError, trackers } = props;
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

  const setTrackerSheetName = useCallback(
    (trackerIndex: number, sheetName: string): void =>
      setPartialTracker(trackerIndex, { sheetName }),
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

      const sheetIdInvalidIndex = trackers.findIndex(
        (tracker: Tracker): boolean => !/^\w+$/.test(tracker.sheetId)
      );

      if (sheetIdInvalidIndex !== -1) {
        throw new StageError(
          'Spreadsheet URL or ID does not appear to be valid. It must contain only letters, numbers, and underscores.',
          focus,
          'sheetId',
          sheetIdInvalidIndex
        );
      }

      const sheetNameEmptyIndex = trackers.findIndex(
        (tracker: Tracker): boolean => tracker.sheetName === ''
      );

      if (sheetNameEmptyIndex !== -1) {
        throw new StageError(
          'Sheet Name cannot be empty.',
          focus,
          'sheetName',
          sheetNameEmptyIndex
        );
      }

      const sheetNameInvalidIndex = trackers.findIndex(
        (tracker: Tracker): boolean => !/^[\w ]+$/.test(tracker.sheetName)
      );

      if (sheetNameInvalidIndex !== -1) {
        throw new StageError(
          'Sheet Name must contain only letters, numbers, underscores, and spaces.',
          focus,
          'sheetName',
          sheetNameInvalidIndex
        );
      }

      setStageError(null);
    } catch (error) {
      if ((error as Error).name === 'StageError') {
        setStageError(error as StageError);
      } else {
        throw error;
      }
    }
  }, [focus, setStageError, trackers]);

  return (
    <div>
      <h2>One last thing&mdash;the spreadsheets.</h2>
      <Card width={30}>
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
                setSheetName={(sheetName: string): void =>
                  setTrackerSheetName(trackerIndex, sheetName)
                }
                sheetId={tracker.sheetId}
                sheetName={tracker.sheetName}
                stageError={
                  focused &&
                  (stageError?.source === 'sheetId' ||
                    stageError?.source === 'sheetName') &&
                  stageError.trackerIndex === trackerIndex
                    ? stageError
                    : null
                }
                title={tracker.title}
                trackerIndex={trackerIndex}
              />
            )
          )}
        </form>
      </Card>
    </div>
  );
}
