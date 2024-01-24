import * as React from 'react';
import { Button, Card } from 'squiffles-components';
import { useCallback, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';

import type { StageError, Tracker } from '../defs';
import TrackerOptionRow from './TrackerOptionRow';

import './TrackerCard.css';

export default function TrackerCard(
  props: Tracker & {
    addTrackerOption: () => void;
    onFocus: () => void;
    removeTracker: (() => void) | null;
    removeTrackerOption: (optionIndex: number) => void;
    setTrackerOption: (optionIndex: number, option: string) => void;
    setTrackerTitle: (title: string) => void;
    stageError: StageError | null;
  }
): JSX.Element {
  const {
    addTrackerOption,
    onFocus,
    options,
    removeTracker,
    removeTrackerOption,
    setTrackerOption,
    setTrackerTitle,
    stageError,
    title
  } = props;

  const titleInput = useRef<HTMLInputElement>(null);

  const updateTitle = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void =>
      setTrackerTitle(event.currentTarget.value),
    [setTrackerTitle]
  );

  useEffect((): void => {
    if (title === '' && options.join() === '') {
      titleInput.current?.focus();
    }
  }, [title, options]);

  useEffect((): void => {
    if (stageError?.source === 'title') {
      titleInput.current?.focus();
      onFocus();
    }
  }, [onFocus, stageError]);

  return (
    <div className="tracker-card-container">
      <Card padded={false}>
        <h3>
          <input
            onChange={updateTitle}
            ref={titleInput}
            type="text"
            value={title}
          />
        </h3>
        <ul>
          {options.map(
            (option: string, optionIndex: number): JSX.Element => (
              <TrackerOptionRow
                key={optionIndex}
                onFocus={onFocus}
                option={option}
                removeOption={
                  optionIndex !== 0
                    ? (): void => removeTrackerOption(optionIndex)
                    : null
                }
                setOption={(newOption: string): void =>
                  setTrackerOption(optionIndex, newOption)
                }
                stageError={
                  stageError?.source === 'options' &&
                  stageError.optionIndex === optionIndex
                    ? stageError
                    : null
                }
              />
            )
          )}
          <li className="preview" key={null}>
            <Button onClick={addTrackerOption} variant="add" />
          </li>
        </ul>
      </Card>
      <Button
        hidden={removeTracker == null}
        onClick={removeTracker ?? undefined}
        variant="close"
      />
    </div>
  );
}
