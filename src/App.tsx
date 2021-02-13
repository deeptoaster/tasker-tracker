import * as React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useCallback, useRef, useState } from 'react';

import CreateTrackersStage from './stages/CreateTrackersStage';
import EditTrackersStage from './stages/EditTrackersStage';
import { ErrorContext } from './TrackerUtils';

import './App.css';

const ERROR_DURATION = 5000;

export default function App(): JSX.Element {
  const [error, setError] = useState<Error | null>(null);
  const errorTimeout = useRef<number>();

  const [trackers, setTrackers] = useState<ReadonlyMap<
    string,
    ReadonlyArray<string>
  > | null>(null);

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
      <TransitionGroup component={null}>
        {trackers == null ? (
          <CSSTransition
            appear={true}
            classNames="card"
            key="create"
            timeout={{
              enter: 1200,
              exit: 300
            }}
          >
            <CreateTrackersStage setTrackers={setTrackers} />
          </CSSTransition>
        ) : (
          <CSSTransition
            classNames="card"
            key="edit"
            timeout={{
              enter: 1200,
              exit: 300
            }}
          >
            <EditTrackersStage setTrackers={setTrackers} trackers={trackers} />
          </CSSTransition>
        )}
        {error != null ? (
          <CSSTransition classNames="error" key="error" timeout={300}>
            <p className="error">{error.message}</p>
          </CSSTransition>
        ) : null}
      </TransitionGroup>
    </ErrorContext.Provider>
  );
}
