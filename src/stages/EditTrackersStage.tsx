import * as React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useCallback, useEffect, useState } from 'react';

import {
  StageError,
  TRACKER_DEFAULT,
  TRANSITION_DURATION,
  Tracker
} from '../defs';
import Button from '../components/Button';
import TrackerCard from '../components/TrackerCard';

import './EditTrackersStage.css';

export default function EditTrackersStage(props: {
  setStageError: (stageError: StageError | null) => void;
  setTrackers: (trackers: ReadonlyArray<Tracker>) => void;
  stageError: StageError | null;
  trackers: ReadonlyArray<Tracker>;
}): JSX.Element {
  const { setStageError, setTrackers, stageError, trackers } = props;
  const [focused, setFocused] = useState<boolean>(false);

  const addTracker = useCallback(
    (): void => setTrackers([...trackers, TRACKER_DEFAULT]),
    [setTrackers, trackers]
  );

  const addTrackerOption = useCallback(
    (trackerIndexToChange): void =>
      setTrackers(
        trackers.map(
          (tracker: Tracker, trackerIndex: number): Tracker =>
            trackerIndex === trackerIndexToChange
              ? { ...tracker, options: [...tracker.options, ''] }
              : tracker
        )
      ),
    [setTrackers, trackers]
  );

  const blur = useCallback((): void => setFocused(false), []);
  const focus = useCallback((): void => setFocused(true), []);

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
    (trackerIndexToChange: number, optionIndexToRemove: number): void =>
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
      ),
    [setTrackers, trackers]
  );

  const setTrackerOption = useCallback(
    (
      trackerIndexToChange: number,
      optionIndexToSet: number,
      optionToSet: string
    ): void =>
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
      ),
    [setTrackers, trackers]
  );

  const setTrackerTitle = useCallback(
    (trackerIndexToChange: number, title: string): void =>
      setTrackers(
        trackers.map(
          (tracker: Tracker, trackerIndex: number): Tracker =>
            trackerIndex === trackerIndexToChange
              ? { ...tracker, title }
              : tracker
        )
      ),
    [setTrackers, trackers]
  );

  useEffect(() => {
    try {
      const titleEmptyIndex = trackers.findIndex(
        (tracker: Tracker): boolean => tracker.title.length < 3
      );

      if (titleEmptyIndex !== -1) {
        throw new StageError(
          'Category title must be at least three characters long.',
          focus,
          'title',
          titleEmptyIndex
        );
      }

      const titleInvalidIndex = trackers.findIndex(
        (tracker: Tracker): boolean => !/^[A-Z]\w+[\da-z]$/.test(tracker.title)
      );

      if (titleInvalidIndex !== -1) {
        throw new StageError(
          'Category title must start with a capital letter, end in a lowercase letter or number, and contain only letters, numbers, or underscores.',
          focus,
          'title',
          titleEmptyIndex
        );
      }

      for (
        let trackerIndex = 0;
        trackerIndex < trackers.length;
        trackerIndex++
      ) {
        const { options } = trackers[trackerIndex];

        const optionEmptyIndex = options.findIndex(
          (option: string): boolean => option === ''
        );

        if (optionEmptyIndex !== -1) {
          throw new StageError(
            'Option cannot be empty.',
            focus,
            'options',
            trackerIndex,
            optionEmptyIndex
          );
        }

        const optionInvalidIndex = options.findIndex(
          (option: string): boolean => !/^[ \w]+$/.test(option)
        );

        if (optionInvalidIndex !== -1) {
          throw new StageError(
            'Option must contain only letters, numbers, and underscores.',
            focus,
            'options',
            trackerIndex,
            optionInvalidIndex
          );
        }

        const optionDuplicateIndex = options.findIndex(
          (option: string, optionIndex: number): boolean => {
            for (
              let otherOptionIndex = 0;
              otherOptionIndex < optionIndex;
              otherOptionIndex++
            ) {
              if (options[otherOptionIndex] === option) {
                return true;
              }
            }

            return false;
          }
        );

        if (optionDuplicateIndex !== -1) {
          throw new StageError(
            'Options within a category must be unique.',
            focus,
            'options',
            trackerIndex,
            optionDuplicateIndex
          );
        }
      }

      setStageError(null);
    } catch (error) {
      if ((error as Error).name === 'StageError') {
        setStageError(error);
      } else {
        throw error;
      }
    }
  }, [focus, setStageError, trackers]);

  return (
    <div>
      <h2>What would you like to track?</h2>
      <TransitionGroup className="tracker-cards">
        {trackers.map(
          (tracker: Tracker, trackerIndex: number): JSX.Element => (
            <CSSTransition
              classNames="card"
              key={trackerIndex}
              timeout={TRANSITION_DURATION}
            >
              <TrackerCard
                {...tracker}
                addTrackerOption={(): void => addTrackerOption(trackerIndex)}
                onFocus={blur}
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
                stageError={
                  focused &&
                  (stageError?.source === 'title' ||
                    stageError?.source === 'options') &&
                  stageError.trackerIndex === trackerIndex
                    ? stageError
                    : null
                }
              />
            </CSSTransition>
          )
        )}
        <div className="tracker-card-container" key={null}>
          <article className="tracker-card preview">
            <Button onClick={addTracker} variant="add" />
          </article>
        </div>
      </TransitionGroup>
    </div>
  );
}
