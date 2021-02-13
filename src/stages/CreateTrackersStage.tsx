import * as React from 'react';
import { useCallback } from 'react';

import './CreateTrackersStage.css';

export default function CreateTrackersStage(props: {
  setTrackers: (trackers: ReadonlyMap<string, ReadonlyArray<string>>) => void;
}): JSX.Element {
  const { setTrackers } = props;

  const createNewConfig = useCallback((): void => {
    setTrackers(new Map());
  }, [setTrackers]);

  const uploadConfig = useCallback((): void => {}, []);

  return (
    <div>
      <h2>Where would you like to start?</h2>
      <article className="trackers-create-card">
        <div className="trackers-create-card-option">
          <h3>Start from Scratch</h3>
          <p>
            Tell us about the things you want to track and we'll generate a
            config for you.
          </p>
          <figure>
            <button onClick={createNewConfig}>Create New Config</button>
          </figure>
        </div>
        <div className="trackers-create-card-option">
          <h3>Start from Existing Config</h3>
          <p>
            If you made a config with us already, you can make adjustments to it
            here.
          </p>
          <figure>
            <button>
              <input
                accept="application/xml,text/xml"
                onChange={uploadConfig}
                type="file"
              />
              Upload Config
            </button>
          </figure>
        </div>
      </article>
    </div>
  );
}
