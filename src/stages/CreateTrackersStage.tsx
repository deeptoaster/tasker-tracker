import * as React from 'react';
import { ChangeEvent, useCallback, useEffect } from 'react';

import * as TrackerUtils from '../TrackerUtils';
import { CONFIG_DEFAULT, Config, FILE_TYPES } from '../TrackerDefs';

import './CreateTrackersStage.css';

export default function CreateTrackersStage(props: {
  setConfig: (trackers: Config) => void;
  setError: (error: Error) => void;
  setStageError: (stageError: null) => void;
  showHelp: () => void;
}): JSX.Element {
  const { setConfig, setError, setStageError, showHelp } = props;

  const createNewConfig = useCallback((): void => setConfig(CONFIG_DEFAULT), [
    setConfig
  ]);

  const uploadConfig = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      if (
        event.currentTarget.files != null &&
        event.currentTarget.files.length !== 0
      ) {
        TrackerUtils.parseFromBlob(event.currentTarget.files[0])
          .then(setConfig)
          .catch(setError);
      }
    },
    [setConfig, setError]
  );

  useEffect((): void => {
    setStageError(null);
  }, [setStageError]);

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
            <button className="button-primary" onClick={createNewConfig}>
              Create New Config
            </button>
          </figure>
        </div>
        <div className="create-card-option">
          <h3>Start from Existing Config</h3>
          <p>
            If you've made a config with us already, you can make adjustments to
            it here.
          </p>
          <figure>
            <button className="button-primary">
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
      <ul className="create-card-links">
        <li>
          <button className="button-link" onClick={showHelp}>
            About
          </button>
        </li>
        <li>
          <a
            href="https://www.paypal.com/donate?business=T3NJS3T45WMFC&item_name=Tasker+Tracker&currency_code=USD"
            rel="noreferrer"
            target="_blank"
          >
            Donate
          </a>
        </li>
        <li>
          <a
            href="https://github.com/deeptoaster/tasker-tracker"
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        </li>
        <li>
          <a href="https://fishbotwilleatyou.com/">fishbotwilleatyou</a>
        </li>
      </ul>
    </div>
  );
}
