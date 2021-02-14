import * as React from 'react';
import { ChangeEvent, useCallback, useContext } from 'react';

import * as TrackerUtils from '../TrackerUtils';
import { Config, ErrorContext, FILE_TYPES } from '../TrackerUtils';

import './CreateTrackersStage.css';

export default function CreateTrackersStage(props: {
  setConfig: (trackers: Config) => void;
}): JSX.Element {
  const { setConfig } = props;
  const error = useContext(ErrorContext);

  const createNewConfig = useCallback((): void => {
    setConfig({
      trackers: new Map([['Breakfast', ['Spam', 'Eggs', 'Ham']]])
    });
  }, [setConfig]);

  const uploadConfig = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      if (
        event.currentTarget.files != null &&
        event.currentTarget.files.length !== 0
      ) {
        TrackerUtils.parseFromFile(event.currentTarget.files[0])
          .then(setConfig)
          .catch(error);
      }
    },
    [error, setConfig]
  );

  return (
    <div>
      <h2>Where would you like to start?</h2>
      <article className="create-card">
        <div className="create-card-option">
          <h3>Start from Scratch</h3>
          <p>
            Tell us about the things you want to track and we'll generate a
            config for you.
          </p>
          <figure>
            <button onClick={createNewConfig}>Create New Config</button>
          </figure>
        </div>
        <div className="create-card-option">
          <h3>Start from Existing Config</h3>
          <p>
            If you've made a config with us already, you can make adjustments to
            it here.
          </p>
          <figure>
            <button>
              <input
                accept={FILE_TYPES.join()}
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
