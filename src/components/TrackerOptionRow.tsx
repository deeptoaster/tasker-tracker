import * as React from 'react';
import { ChangeEvent, useCallback, useEffect, useRef } from 'react';

import Button from './Button';
import { StageError } from '../defs';

export default function TrackerOptionRow(props: {
  onFocus: () => void;
  option: string;
  removeOption: (() => void) | null;
  setOption: (option: string) => void;
  stageError: StageError | null;
}): JSX.Element {
  const { onFocus, option, removeOption, setOption, stageError } = props;
  const input = useRef<HTMLInputElement>(null);

  const updateOption = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void =>
      setOption(event.currentTarget.value),
    [setOption]
  );

  useEffect((): void => {
    if (stageError != null || option === '') {
      input.current?.focus();
      onFocus();
    }
  }, [onFocus, option, stageError]);

  return (
    <li>
      <input onChange={updateOption} ref={input} type="text" value={option} />
      {removeOption != null ? (
        <Button onClick={removeOption} variant="close" />
      ) : null}
    </li>
  );
}
