import * as React from 'react';
import { useState } from 'react';

import CreateTrackersStage from './stages/CreateTrackersStage';
import EditTrackersStage from './stages/EditTrackersStage';

import './App.css';

export default function App(): JSX.Element {
  const [trackers, setTrackers] = useState<ReadonlyMap<
    string,
    ReadonlyArray<string>
  > | null>(null);

  return trackers == null ? (
    <CreateTrackersStage setTrackers={setTrackers} />
  ) : (
    <EditTrackersStage setTrackers={setTrackers} trackers={trackers} />
  );
}
