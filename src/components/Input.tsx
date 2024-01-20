import * as React from 'react';
import { ChangeEvent, RefObject, useMemo } from 'react';

import './Input.css';

export default function Input(props: {
  id: string;
  inputRef: RefObject<HTMLInputElement>;
  label: string;
  onUpdate: (value: string) => void;
  value: string;
}): JSX.Element {
  const { id, inputRef, label, onUpdate, value } = props;

  const handleChange = useMemo(
    () =>
      (event: ChangeEvent<HTMLInputElement>): void =>
        onUpdate(event.currentTarget.value),
    [onUpdate],
  );

  return (
    <div className="form-control">
      <label htmlFor={id}>{label}</label>
      <div className="input-group">
        <input
          id={id}
          onChange={handleChange}
          ref={inputRef}
          type="text"
          value={value}
        />
      </div>
    </div>
  );
}
