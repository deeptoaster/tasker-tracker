import * as React from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useCallback, useEffect, useState } from 'react';
import { TRANSITION_DURATION } from 'squiffles-components';

import type { Config, StageError, Tracker } from './defs';
import ApiSettingsStage from './stages/ApiSettingsStage';
import CreateTrackersStage from './stages/CreateTrackersStage';
import DownloadStage from './stages/DownloadStage';
import EditTrackersStage from './stages/EditTrackersStage';
import Help from './modals/Help';
import SpreadsheetSettingsStage from './stages/SpreadsheetSettingsStage';
import { Stage } from './defs';
import TrackerFooter from './TrackerFooter';

import './App.css';

export default function App(): JSX.Element {
  const [config, setConfig] = useState<Config | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [helpVisible, setHelpVisible] = useState<boolean>(false);
  const [navigationDisabled, setNavigationDisabled] = useState<boolean>(false);
  const [stage, setStage] = useState<Stage>(Stage.EDIT_TRACKERS);
  const [stageError, setStageError] = useState<StageError | null>(null);

  const disableNavigation = useCallback(
    (): void => setNavigationDisabled(true),
    []
  );

  const enableNavigation = useCallback(
    (): void => setNavigationDisabled(false),
    []
  );

  const hideHelp = useCallback((): void => setHelpVisible(false), []);

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

  const setTrackers = useCallback(
    (trackers: ReadonlyArray<Tracker>): void => setPartialConfig({ trackers }),
    [setPartialConfig]
  );

  const showHelp = useCallback((): void => setHelpVisible(true), []);

  useEffect((): void => {
    if (config == null) {
      setError(null);
    }
  }, [config]);

  useEffect((): void => setError(null), [stage]);

  return (
    <>
      <Help hideHelp={hideHelp} visible={helpVisible} />
      <section>
        <SwitchTransition>
          <CSSTransition
            appear={true}
            classNames="stage"
            key={config == null ? null : stage}
            onEntered={enableNavigation}
            onExiting={disableNavigation}
            timeout={TRANSITION_DURATION}
          >
            {config == null ? (
              <CreateTrackersStage
                setConfig={setConfig}
                setError={setError}
                showHelp={showHelp}
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
                showHelp={showHelp}
              />
            ) : stage === Stage.SPREADSHEET_SETTINGS ? (
              <SpreadsheetSettingsStage
                setStageError={setStageError}
                setTrackers={setTrackers}
                stageError={stageError}
                trackers={config.trackers}
              />
            ) : stage === Stage.DOWNLOAD ? (
              <DownloadStage />
            ) : null}
          </CSSTransition>
        </SwitchTransition>
        <TrackerFooter
          config={config}
          error={error}
          navigationDisabled={navigationDisabled}
          setConfig={setConfig}
          setError={setError}
          setStage={setStage}
          showHelp={showHelp}
          stage={stage}
          stageError={stageError}
        />
      </section>
    </>
  );
}
