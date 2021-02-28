import * as React from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Config, Stage, StageError, Tracker } from './TrackerDefs';
import ApiSettingsStage from './stages/ApiSettingsStage';
import CreateTrackersStage from './stages/CreateTrackersStage';
import DownloadStage from './stages/DownloadStage';
import EditTrackersStage from './stages/EditTrackersStage';
import Footer from './Footer';
import SpreadsheetSettingsStage from './stages/SpreadsheetSettingsStage';

import './App.css';

const ERROR_DURATION = 5000;

export default function App(): JSX.Element {
  const [config, setConfig] = useState<Config | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const errorTimeout = useRef<number>();
  const [stage, setStage] = useState<Stage>(Stage.EDIT_TRACKERS);
  const [stageError, setStageError] = useState<StageError | null>(null);

  const setPartialConfig = useCallback(
    (partialConfig: Partial<Config>): void => {
      if (config != null) {
        setConfig({ ...config, ...partialConfig });
      }
    },
    [config]
  );

  const setClientId = useCallback(
    (clientId: string): void => setPartialConfig({ clientId }),
    [setPartialConfig]
  );

  const setClientSecret = useCallback(
    (clientSecret: string): void => setPartialConfig({ clientSecret }),
    [setPartialConfig]
  );

  const setSheetName = useCallback(
    (sheetName: string): void => setPartialConfig({ sheetName }),
    [setPartialConfig]
  );

  const setTrackers = useCallback(
    (trackers: ReadonlyArray<Tracker>): void => setPartialConfig({ trackers }),
    [setPartialConfig]
  );

  useEffect((): void => {
    if (config == null) {
      setError(null);
    }
  }, [config]);

  useEffect((): void => {
    if (error != null) {
      window.clearTimeout(errorTimeout.current);

      errorTimeout.current = window.setTimeout(
        () => setError(null),
        ERROR_DURATION
      );
    }
  }, [error]);

  useEffect((): void => setError(null), [stage]);

  return (
    <>
      <SwitchTransition>
        <CSSTransition
          appear={true}
          classNames="stage"
          key={config == null ? null : stage}
          timeout={{
            enter: 1200,
            exit: 300
          }}
        >
          {config == null ? (
            <CreateTrackersStage
              setConfig={setConfig}
              setError={setError}
              setStageError={setStageError}
            />
          ) : stage === Stage.EDIT_TRACKERS ? (
            <EditTrackersStage
              setStageError={setStageError}
              setTrackers={setTrackers}
              stageError={stageError}
              trackers={config.trackers}
            />
          ) : stage === Stage.API_SETTINGS ? (
            <ApiSettingsStage
              clientId={config.clientId}
              clientSecret={config.clientSecret}
              setClientId={setClientId}
              setClientSecret={setClientSecret}
              setStageError={setStageError}
            />
          ) : stage === Stage.SPREADSHEET_SETTINGS ? (
            <SpreadsheetSettingsStage
              setSheetName={setSheetName}
              setStageError={setStageError}
              setTrackers={setTrackers}
              sheetName={config.sheetName}
              stageError={stageError}
              trackers={config.trackers}
            />
          ) : stage === Stage.DOWNLOAD ? (
            <DownloadStage />
          ) : null}
        </CSSTransition>
      </SwitchTransition>
      <Footer
        config={config}
        error={error}
        setConfig={setConfig}
        setError={setError}
        setStage={setStage}
        stage={stage}
        stageError={stageError}
      />
    </>
  );
}
