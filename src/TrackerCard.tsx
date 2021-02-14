import * as React from 'react';
import { ChangeEvent, useCallback } from 'react';

import { Tracker } from './TrackerUtils';

import './TrackerCard.css';
import { useEffect, useRef } from 'react';

export default function TrackerCard(
  props: Tracker & {
    addTrackerOption: () => void;
    removeTracker: (() => void) | null;
    removeTrackerOption: (optionIndex: number) => void;
    setTrackerOption: (optionIndex: number, option: string) => void;
    setTrackerTitle: (title: string) => void;
  }
): JSX.Element {
  const {
    addTrackerOption,
    options,
    removeTracker,
    removeTrackerOption,
    setTrackerOption,
    setTrackerTitle,
    title
  } = props;

  const titleInput = useRef<HTMLInputElement>(null);

  const handleTitleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setTrackerTitle(event.currentTarget.value);
    },
    [setTrackerTitle]
  );

  useEffect((): void => {
    if (title === '') {
      titleInput.current?.focus();
    }
  });

  return (
    <div className="tracker-card-container">
      <article className="tracker-card">
        <h3>
          <input
            onChange={handleTitleChange}
            ref={titleInput}
            type="text"
            value={title}
          />
        </h3>
        <ul>
          {options.map(
            (option: string, optionIndex: number): JSX.Element => (
              <li key={optionIndex}>
                <input
                  onChange={(event: ChangeEvent<HTMLInputElement>): void =>
                    setTrackerOption(optionIndex, event.currentTarget.value)
                  }
                  type="text"
                  value={option}
                />
                <button
                  className="close"
                  onClick={(): void => removeTrackerOption(optionIndex)}
                />
              </li>
            )
          )}
          <li className="preview" key={null}>
            <button className="add" onClick={addTrackerOption} />
          </li>
        </ul>
      </article>
      <button
        className={`close ${removeTracker == null ? 'hidden' : ''}`}
        onClick={removeTracker ?? undefined}
      />
    </div>
  );
}
