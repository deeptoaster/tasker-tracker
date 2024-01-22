import * as React from 'react';

import Button from './Button';

import './Modal.css';

type ModalAction = {
  label: string;
  onClick: () => void;
};

export default function Modal(props: {
  actions: ReadonlyArray<ModalAction>;
  children: React.ReactNode;
}): JSX.Element {
  const { actions, children } = props;

  return (
    <aside>
      {children}
      <div className="modal-actions">
        {actions.map(
          ({ label, onClick }: ModalAction): JSX.Element => (
            <Button key={label} onClick={onClick} variant="stub">
              {label}
            </Button>
          )
        )}
      </div>
    </aside>
  );
}
