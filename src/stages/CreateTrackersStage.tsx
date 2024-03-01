import * as React from 'react';
import { Button, Card, Link } from 'squiffles-components';
import type { ChangeEvent } from 'react';
import { useCallback } from 'react';

import * as TrackerUtils from '../utils';
import { CONFIG_DEFAULT, FILE_TYPES } from '../defs';
import type { Config } from '../defs';

import './CreateTrackersStage.css';

export default function CreateTrackersStage(props: {
  setConfig: (trackers: Config) => void;
  setError: (error: Error | null) => void;
  showHelp: () => void;
}): JSX.Element {
  const { setConfig, setError, showHelp } = props;

  const createNewConfig = useCallback((): void => {
    setConfig(CONFIG_DEFAULT);
    setError(null);
  }, [setConfig, setError]);

  const uploadConfig = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      if (
        event.currentTarget.files != null &&
        event.currentTarget.files.length !== 0
      ) {
        TrackerUtils.parseFromBlobs(event.currentTarget.files)
          .then(setConfig)
          .catch(setError);
      }
    },
    [setConfig, setError]
  );

  return (
    <div className="create-stage">
      <h2>Where would you like to start?</h2>
      <Card padded={false}>
        <div className="create-stage-option">
          <h3>Start From Scratch</h3>
          <p>
            Tell us about the things you want to track and we'll generate a
            config for you.
          </p>
          <figure>
            <Button onClick={createNewConfig} variant="primary">
              Create New Config
            </Button>
          </figure>
        </div>
        <div className="create-stage-option">
          <h3>Start From Existing Config</h3>
          <p>
            If you've made a config with us already, you can make adjustments to
            it here.
          </p>
          <figure>
            <Button variant="primary">
              <input
                accept={FILE_TYPES.join()}
                multiple={true}
                onChange={uploadConfig}
                type="file"
              />
              Upload Config
            </Button>
          </figure>
        </div>
      </Card>
      <ul className="create-stage-links">
        <li>
          <Link onClick={showHelp}>About</Link>
        </li>
        <li>
          <Link
            external={true}
            href="https://www.paypal.com/donate?business=T3NJS3T45WMFC&item_name=Tasker+Tracker&currency_code=USD"
          >
            Donate
          </Link>
        </li>
        <li>
          <Link
            external={true}
            href="https://github.com/deeptoaster/tasker-tracker"
          >
            GitHub
          </Link>
        </li>
        <li>
          <Link external={true} href="https://fishbotwilleatyou.com/">
            fishbotwilleatyou
          </Link>
        </li>
      </ul>
    </div>
  );
}
