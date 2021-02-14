import * as React from 'react';
import { Trackers } from '../TrackerUtils';

import './EditTrackersStage.css';

export default function EditTrackersStage(props: {
  setTrackers: (trackers: Trackers) => void;
  trackers: Trackers;
}): JSX.Element {
  const { setTrackers, trackers } = props;

  return (
    <div>
      <h2>What would you like to track?</h2>
      <div className="edit-cards">
        {Array.from(trackers).map(
          ([trackerId, tracker]: [
            string,
            ReadonlyArray<string>
          ]): JSX.Element => (
            <article className="edit-card" key={trackerId}>
              <h3>
                <input type="text" value={trackerId} />
              </h3>
              <ul>
                {tracker.map(
                  (option: string): JSX.Element => (
                    <li key={option}>
                      <input type="text" value={option} />
                      <button className="close" />
                    </li>
                  )
                )}
                <li className="preview" key={null}>
                  <button className="add" />
                </li>
              </ul>
            </article>
          )
        )}
        <article className="edit-card preview" key={null}>
          <button className="add" />
        </article>
      </div>
    </div>
  );
}
