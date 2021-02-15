import * as React from 'react';
import {
  CSSTransition,
  SwitchTransition,
  TransitionGroup
} from 'react-transition-group';
import { useCallback, useRef, useState } from 'react';

import { Config, ErrorContext, Tracker } from './TrackerUtils';
import ApiSettingsStage from './stages/ApiSettingsStage';
import CreateTrackersStage from './stages/CreateTrackersStage';
import EditTrackersStage from './stages/EditTrackersStage';

import './App.css';

const ERROR_DURATION = 5000;

enum Stage {
  EDIT_TRACKERS,
  API_SETTINGS,
  length
}

export default function App(): JSX.Element {
  const [config, setConfig] = useState<Config | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const errorTimeout = useRef<number>();
  const [stage, setStage] = useState<Stage>(Stage.EDIT_TRACKERS);

  const back = useCallback(() => {
    if (stage !== 0) {
      setStage(stage - 1);
    }
  }, [stage]);

  const next = useCallback(() => {
    if (stage !== Stage.length - 1) {
      setStage(stage + 1);
    }
  }, [stage]);

  const setPartialConfig = useCallback(
    (partialConfig: Partial<Config>): void => {
      if (config != null) {
        setConfig({ ...config, ...partialConfig });
      }
    },
    [config]
  );

  const setClientId = useCallback(
    (clientId: string) => {
      setPartialConfig({ clientId });
    },
    [setPartialConfig]
  );

  const setClientSecret = useCallback(
    (clientSecret: string) => {
      setPartialConfig({ clientSecret });
    },
    [setPartialConfig]
  );

  const setTrackers = useCallback(
    (trackers: ReadonlyArray<Tracker>): void => setPartialConfig({ trackers }),
    [setPartialConfig]
  );

  const showError = useCallback((error: Error): void => {
    setError(error);
    window.clearTimeout(errorTimeout.current);

    errorTimeout.current = window.setTimeout(
      () => setError(null),
      ERROR_DURATION
    );
  }, []);

  return (
    <ErrorContext.Provider value={showError}>
      <SwitchTransition>
        <CSSTransition
          appear={true}
          classNames="stage"
          key={config == null ? null : stage}
          timeout={{
            enter: 1200,
            exit: 300
          }}
        >
          {config == null ? (
            <CreateTrackersStage setConfig={setConfig} />
          ) : stage === Stage.EDIT_TRACKERS ? (
            <EditTrackersStage
              setTrackers={setTrackers}
              trackers={config.trackers}
            />
          ) : stage === Stage.API_SETTINGS ? (
            <ApiSettingsStage
              clientId={config.clientId}
              clientSecret={config.clientSecret}
              setClientId={setClientId}
              setClientSecret={setClientSecret}
            />
          ) : null}
        </CSSTransition>
      </SwitchTransition>
      <TransitionGroup component={null}>
        {error != null ? (
          <CSSTransition classNames="error" key="error" timeout={300}>
            <p className="error">{error.message}</p>
          </CSSTransition>
        ) : null}
        {config != null ? (
          <CSSTransition classNames="stage" key="pager" timeout={300}>
            <footer>
              <div className="pull-right">
                <button
                  className={stage === 0 ? 'disabled' : ''}
                  onClick={back}
                >
                  Back
                </button>
                <button className="button-primary" onClick={next}>
                  {stage === Stage.length - 1 ? 'Download' : 'Next'}
                </button>
              </div>
            </footer>
          </CSSTransition>
        ) : null}
      </TransitionGroup>
    </ErrorContext.Provider>
  );
}
