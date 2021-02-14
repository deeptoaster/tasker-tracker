import * as React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useCallback } from 'react';

import { Tracker } from '../TrackerUtils';
import TrackerCard from '../TrackerCard';

import './EditTrackersStage.css';

export default function EditTrackersStage(props: {
  setTrackers: (trackers: ReadonlyArray<Tracker>) => void;
  trackers: ReadonlyArray<Tracker>;
}): JSX.Element {
  const { setTrackers, trackers } = props;

  const addTracker = useCallback((): void => {
    setTrackers([...trackers, { options: [], title: '' }]);
  }, [setTrackers, trackers]);

  return (
    <div>
      <h2>What would you like to track?</h2>
      <TransitionGroup className="tracker-cards">
        {trackers.map(
          (tracker: Tracker, index: number): JSX.Element => (
            <CSSTransition
              classNames="card"
              key={index}
              timeout={{ enter: 1200, exit: 300 }}
            >
              <TrackerCard {...tracker} />
            </CSSTransition>
          )
        )}
        <div className="tracker-card-container">
          <article className="tracker-card preview" key={null}>
            <button className="add" onClick={addTracker} />
          </article>
        </div>
      </TransitionGroup>
    </div>
  );
}
