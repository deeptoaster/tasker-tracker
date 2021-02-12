import * as React from 'react';

export default function CreateTrackersStage(props: {
  setTrackers: (trackers: ReadonlyMap<string, ReadonlyArray<string>>) => void;
}): JSX.Element {
  const { setTrackers } = props;

  return (
    <>
      <h2>Where would you like to start?</h2>
      <div className="card trackers-create-card">
        <div className="trackers-create-card-option">
          <h3>Start from Scratch</h3>
          <p>
            Tell us about the things you want to track and we'll generate a
            config for you.
          </p>
        </div>
        <div className="trackers-create-card-option">
          <h3>Start from Existing Config</h3>
          <p>
            If you made a config with us already, you can make adjustments to it
            here.
          </p>
        </div>
      </div>
    </>
  );
}
