import * as React from 'react';
import {
  CSSTransition,
  SwitchTransition,
  TransitionGroup
} from 'react-transition-group';
import { useCallback, useRef, useState } from 'react';

import { Config, ErrorContext, Tracker } from './TrackerUtils';
import CreateTrackersStage from './stages/CreateTrackersStage';
import EditTrackersStage from './stages/EditTrackersStage';

import './App.css';

const ERROR_DURATION = 5000;

export default function App(): JSX.Element {
  const [config, setConfig] = useState<Config | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const errorTimeout = useRef<number>();

  const setTrackers = useCallback(
    (trackers: ReadonlyArray<Tracker>): void => {
      setConfig({ ...config, trackers });
    },
    [config]
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
          key={config == null ? 'create' : 'edit'}
          timeout={{
            enter: 1200,
            exit: 300
          }}
        >
          {config == null ? (
            <CreateTrackersStage setConfig={setConfig} />
          ) : (
            <EditTrackersStage
              setTrackers={setTrackers}
              trackers={config.trackers}
            />
          )}
        </CSSTransition>
      </SwitchTransition>
      <TransitionGroup component={null}>
        {error != null ? (
          <CSSTransition classNames="error" key="error" timeout={300}>
            <p className="error">{error.message}</p>
          </CSSTransition>
        ) : null}
      </TransitionGroup>
    </ErrorContext.Provider>
  );
}
