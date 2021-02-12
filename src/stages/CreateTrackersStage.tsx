import * as React from 'react';

export default function CreateTrackersStage(props: {
  setTrackers: (trackers: ReadonlyMap<string, ReadonlyArray<string>>) => void;
}): JSX.Element {
  const { setTrackers } = props;

  return (
    <div className="trackers-app-page">
      <div className="trackers-app-page-option">Left</div>
      <div className="trackers-app-page-option">Right</div>
    </div>
  );
}
