import * as React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { MouseEvent, useCallback, useMemo } from 'react';

import * as TrackerUtils from './TrackerUtils';
import { Config, Stage, StageError } from './TrackerDefs';

const DOWNLOAD_NAME = 'tracker.xml';

export default function Footer(props: {
  config: Config | null;
  error: Error | null;
  setConfig: (config: Config | null) => void;
  setError: (error: Error) => void;
  setStage: (stage: Stage) => void;
  showHelp: () => void;
  stage: Stage;
  stageError: StageError | null;
}): JSX.Element {
  const {
    config,
    error,
    setConfig,
    setError,
    setStage,
    showHelp,
    stage,
    stageError
  } = props;

  const back = useCallback((): void => {
    if (stage === 0) {
      setConfig(null);
    } else {
      setStage(stage - 1);
    }
  }, [setConfig, setStage, stage]);

  const downloadBlob = useMemo(
    (): Blob | null =>
      config != null && stage === Stage.DOWNLOAD
        ? TrackerUtils.exportToBlob(config)
        : null,
    [config, stage]
  );

  const downloadUrl = useMemo(
    (): string | null =>
      downloadBlob != null ? window.URL.createObjectURL(downloadBlob) : null,
    [downloadBlob]
  );

  const handleDownloadClick = useCallback(
    (event: MouseEvent): void => {
      if ('msSaveBlob' in window.navigator) {
        window.navigator.msSaveBlob(downloadBlob, DOWNLOAD_NAME);
        event.preventDefault();
      }
    },
    [downloadBlob]
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
  }, [setError, setStage, stage, stageError]);

  return (
    <TransitionGroup component={null}>
      {error != null ? (
        <CSSTransition classNames="error" key="error" timeout={300}>
          <p className="error">{error.message}</p>
        </CSSTransition>
      ) : null}
      {config != null ? (
        <CSSTransition classNames="stage" key="pager" timeout={300}>
          <footer>
            <div className="pull-left">
              <button onClick={showHelp}>Show Help</button>
              {/*<a
                className="button"
                href="https://www.paypal.com/donate?business=T3NJS3T45WMFC&item_name=Tasker+Tracker&currency_code=USD"
                rel="noreferrer"
                target="_blank"
              >
                Buy Me a Beer
              </a>*/}
            </div>
            <div className="pull-right">
              <button onClick={back}>
                {stage === 0 ? 'Start Over' : 'Back'}
              </button>
              {downloadUrl != null ? (
                <a
                  className="button button-primary"
                  download={DOWNLOAD_NAME}
                  href={downloadUrl}
                  onClick={handleDownloadClick}
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
  );
}
