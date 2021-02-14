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

  const addTrackerOption = useCallback(
    (trackerIndexToChange): void => {
      setTrackers(
        trackers.map(
          (tracker: Tracker, trackerIndex: number): Tracker =>
            trackerIndex === trackerIndexToChange
              ? { ...tracker, options: [...tracker.options, ''] }
              : tracker
        )
      );
    },
    [setTrackers, trackers]
  );

  const removeTracker = useCallback(
    (trackerIndexToRemove: number): void =>
      setTrackers(
        trackers.filter(
          (_tracker: Tracker, trackerIndex: number): boolean =>
            trackerIndex !== trackerIndexToRemove
        )
      ),
    [setTrackers, trackers]
  );

  const removeTrackerOption = useCallback(
    (trackerIndexToChange: number, optionIndexToRemove: number): void => {
      setTrackers(
        trackers.map(
          (tracker: Tracker, trackerIndex: number): Tracker =>
            trackerIndex === trackerIndexToChange
              ? {
                  ...tracker,
                  options: tracker.options.filter(
                    (_option: string, optionIndex: number): boolean =>
                      optionIndex !== optionIndexToRemove
                  )
                }
              : tracker
        )
      );
    },
    [setTrackers, trackers]
  );

  const setTrackerOption = useCallback(
    (
      trackerIndexToChange: number,
      optionIndexToSet: number,
      optionToSet: string
    ): void => {
      setTrackers(
        trackers.map(
          (tracker: Tracker, trackerIndex: number): Tracker =>
            trackerIndex === trackerIndexToChange
              ? {
                  ...tracker,
                  options: tracker.options.map(
                    (option: string, optionIndex: number): string =>
                      optionIndex === optionIndexToSet ? optionToSet : option
                  )
                }
              : tracker
        )
      );
    },
    [setTrackers, trackers]
  );

  const setTrackerTitle = useCallback(
    (trackerIndexToChange: number, title: string): void => {
      setTrackers(
        trackers.map(
          (tracker: Tracker, trackerIndex: number): Tracker =>
            trackerIndex === trackerIndexToChange
              ? { ...tracker, title }
              : tracker
        )
      );
    },
    [setTrackers, trackers]
  );

  return (
    <div>
      <h2>What would you like to track?</h2>
      <TransitionGroup className="tracker-cards">
        {trackers.map(
          (tracker: Tracker, trackerIndex: number): JSX.Element => (
            <CSSTransition
              classNames="card"
              key={trackerIndex}
              timeout={{ enter: 1200, exit: 300 }}
            >
              <TrackerCard
                {...tracker}
                addTrackerOption={(): void => addTrackerOption(trackerIndex)}
                removeTracker={
                  trackerIndex !== 0
                    ? (): void => removeTracker(trackerIndex)
                    : null
                }
                removeTrackerOption={(optionIndex: number): void => {
                  removeTrackerOption(trackerIndex, optionIndex);
                }}
                setTrackerOption={(
                  optionIndex: number,
                  option: string
                ): void => {
                  setTrackerOption(trackerIndex, optionIndex, option);
                }}
                setTrackerTitle={(title: string): void =>
                  setTrackerTitle(trackerIndex, title)
                }
              />
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
