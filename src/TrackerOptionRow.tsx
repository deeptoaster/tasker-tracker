import * as React from 'react';
import { ChangeEvent, useEffect, useRef } from 'react';

import { StageError } from './TrackerUtils';

export default function TrackerOptionRow(props: {
  onFocus: () => void;
  option: string;
  removeOption: (() => void) | null;
  setOption: (option: string) => void;
  stageError: StageError | null;
}): JSX.Element {
  const { onFocus, option, removeOption, setOption, stageError } = props;
  const input = useRef<HTMLInputElement>(null);

  useEffect((): void => {
    if (stageError != null) {
      input.current?.focus();
      onFocus();
    }
  }, [onFocus, stageError]);

  return (
    <li>
      <input
        onChange={(event: ChangeEvent<HTMLInputElement>): void =>
          setOption(event.currentTarget.value)
        }
        ref={input}
        type="text"
        value={option}
      />
      {removeOption != null ? (
        <button className="button-close button-stub" onClick={removeOption} />
      ) : null}
    </li>
  );
}
