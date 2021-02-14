import * as React from 'react';

import { Tracker } from './TrackerUtils';

import './TrackerCard.css';

export default function TrackerCard(props: Tracker): JSX.Element {
  const { options, title } = props;

  return (
    <div className="tracker-card-container">
      <article className="tracker-card">
        <h3>
          <input type="text" value={title} />
        </h3>
        <ul>
          {options.map(
            (option: string): JSX.Element => (
              <li key={option}>
                <input type="text" value={option} />
                <button className="close" />
              </li>
            )
          )}
          <li className="preview" key={null}>
            <button className="add" />
          </li>
        </ul>
      </article>
      <button className="close" />
    </div>
  );
}
