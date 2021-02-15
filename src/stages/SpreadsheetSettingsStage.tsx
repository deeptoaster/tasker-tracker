import * as React from 'react';
import { ChangeEvent, useCallback } from 'react';

import { Tracker } from '../TrackerUtils';

import './SpreadsheetSettingsStage.css';

export default function SpreadsheetSettingsStage(props: {
  setTrackers: (trackers: ReadonlyArray<Tracker>) => void;
  trackers: ReadonlyArray<Tracker>;
}): JSX.Element {
  const { setTrackers, trackers } = props;

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

  const setSheetId = useCallback(
    (trackerIndex: number, sheetId: string): void =>
      setPartialTracker(trackerIndex, { sheetId }),
    [setPartialTracker]
  );

  const setSheetName = useCallback(
    (trackerIndex: number, sheetName: string): void =>
      setPartialTracker(trackerIndex, { sheetName }),
    [setPartialTracker]
  );

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
              <div className="form-control" key={trackerIndex}>
                <label htmlFor={`spreadsheet-sheet-${trackerIndex}-id`}>
                  {tracker.title}
                </label>
                <div className="input-group spreadsheet-id-input-group">
                  <input
                    id={`spreadsheet-sheet-${trackerIndex}-id`}
                    onChange={(event: ChangeEvent<HTMLInputElement>): void =>
                      setSheetId(trackerIndex, event.currentTarget.value)
                    }
                    type="text"
                    value={tracker.sheetId}
                  />
                </div>
                <div className="input-group">
                  <input
                    onChange={(event: ChangeEvent<HTMLInputElement>): void =>
                      setSheetName(trackerIndex, event.currentTarget.value)
                    }
                    type="text"
                    value={tracker.sheetName}
                  />
                </div>
              </div>
            )
          )}
        </form>
      </article>
    </div>
  );
}
