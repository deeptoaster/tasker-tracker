import * as React from 'react';
import {
  CSSTransition,
  SwitchTransition,
  TransitionGroup
} from 'react-transition-group';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import * as TrackerUtils from './TrackerUtils';
import { Config, ErrorContext, StageError, Tracker } from './TrackerUtils';
import ApiSettingsStage from './stages/ApiSettingsStage';
import CreateTrackersStage from './stages/CreateTrackersStage';
import DownloadStage from './stages/DownloadStage';
import EditTrackersStage from './stages/EditTrackersStage';
import SpreadsheetSettingsStage from './stages/SpreadsheetSettingsStage';

import './App.css';

const ERROR_DURATION = 5000;

enum Stage {
  EDIT_TRACKERS,
  API_SETTINGS,
  SPREADSHEET_SETTINGS,
  DOWNLOAD,
  length
}

export default function App(): JSX.Element {
  const [config, setConfig] = useState<Config | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const errorTimeout = useRef<number>();
  const [stage, setStage] = useState<Stage>(Stage.EDIT_TRACKERS);
  const [stageError, setStageError] = useState<StageError | null>(null);

  const back = useCallback((): void => {
    if (stage === 0) {
      setConfig(null);
    } else {
      setStage(stage - 1);
    }
  }, [stage]);

  const downloadUrl = useMemo(
    (): string | null =>
      config != null && stage === Stage.DOWNLOAD
        ? window.URL.createObjectURL(TrackerUtils.exportToBlob(config))
        : null,
    [config, stage]
  );

  const next = useCallback((): void => {
    if (stage === Stage.length - 1) {
      throw new Error();
    } else if (stageError == null) {
      setStage(stage + 1);
    } else {
      setError(stageError);
      stageError.focus();
    }
  }, [stage, stageError]);

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
    <ErrorContext.Provider value={setError}>
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
      <TransitionGroup component={null}>
        {error != null ? (
          <CSSTransition classNames="error" key="error" timeout={300}>
            <p className="error">{error.message}</p>
          </CSSTransition>
        ) : null}
        {config != null ? (
          <CSSTransition classNames="stage" key="pager" timeout={300}>
            <footer>
              <div className="pull-right">
                <button onClick={back}>
                  {stage === 0 ? 'Start Over' : 'Back'}
                </button>
                {downloadUrl != null ? (
                  <a
                    className="button button-primary"
                    download="tracker.xml"
                    href={downloadUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Download
                  </a>
                ) : (
                  <button className="button-primary" onClick={next}>
                    Next
                  </button>
                )}
              </div>
            </footer>
          </CSSTransition>
        ) : null}
      </TransitionGroup>
    </ErrorContext.Provider>
  );
}
