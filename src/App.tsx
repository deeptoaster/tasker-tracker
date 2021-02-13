import * as React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useState } from 'react';

import CreateTrackersStage from './stages/CreateTrackersStage';
import EditTrackersStage from './stages/EditTrackersStage';

import './App.css';

export default function App(): JSX.Element {
  const [trackers, setTrackers] = useState<ReadonlyMap<
    string,
    ReadonlyArray<string>
  > | null>(null);

  return (
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
    </TransitionGroup>
  );
}
