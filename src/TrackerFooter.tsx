import * as React from 'react';
import { Button, Footer } from 'squiffles-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MouseEvent } from 'react';

import * as TrackerUtils from './utils';
import type { Config, StageError } from './defs';
import { DONATION_URL, Stage } from './defs';

const DOWNLOAD_NAME = 'tracker.zip';

export default function TrackerFooter(props: {
  config: Config | null;
  error: Error | null;
  navigationDisabled: boolean;
  setConfig: (config: Config | null) => void;
  setError: (error: Error | null) => void;
  setStage: (stage: Stage) => void;
  showHelp: () => void;
  stage: Stage;
  stageError: StageError | null;
}): JSX.Element {
  const {
    config,
    navigationDisabled,
    error,
    setConfig,
    setError,
    setStage,
    showHelp,
    stage,
    stageError
  } = props;

  const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null);

  const back = useCallback((): void => {
    if (stage === 0) {
      setConfig(null);
    } else {
      setStage(stage - 1);
    }
  }, [setConfig, setStage, stage]);

  const downloadUrl = useMemo(
    (): string | null =>
      downloadBlob != null ? window.URL.createObjectURL(downloadBlob) : null,
    [downloadBlob]
  );

  const handleDownloadClick = useCallback(
    (event: MouseEvent): void => {
      if ('msSaveBlob' in window.navigator) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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

  useEffect((): void => {
    if (config != null && stage === Stage.DOWNLOAD) {
      TrackerUtils.exportToBlob(config).then((blob: Blob): void =>
        setDownloadBlob(blob)
      );
    } else {
      setDownloadBlob(null);
    }
  }, [config, stage]);

  return (
    <Footer error={error} setError={setError} visible={config != null}>
      <div>
        <Button onClick={showHelp}>Show Help</Button>
        <Button external={true} href={DONATION_URL}>
          Buy Me a Beer
        </Button>
      </div>
      <div>
        <Button onClick={back}>{stage === 0 ? 'Start Over' : 'Back'}</Button>
        {downloadUrl != null ? (
          <Button
            download={DOWNLOAD_NAME}
            external={true}
            href={downloadUrl}
            onClick={handleDownloadClick}
            variant="primary"
          >
            Download
          </Button>
        ) : (
          <Button
            onClick={!navigationDisabled ? next : undefined}
            variant="primary"
          >
            Next
          </Button>
        )}
      </div>
    </Footer>
  );
}
