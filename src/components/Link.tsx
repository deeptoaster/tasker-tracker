import * as React from 'react';

import { ClickableProps, SpreadableClickableProps } from '../defs';

import './Link.css';

export default function Link(props: ClickableProps): JSX.Element {
  const {
    children,
    download,
    external = false,
    href,
    onClick
  } = props as SpreadableClickableProps;

  return onClick != null ? (
    <button className="button-link" onClick={onClick}>
      {children}
    </button>
  ) : (
    <a
      download={download}
      href={href}
      onClick={onClick}
      rel={external ? 'noreferrer' : undefined}
      target={external ? '_blank' : undefined}
    >
      {children}
    </a>
  );
}
