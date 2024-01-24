import * as React from 'react';
import { Card, Input, Link } from 'squiffles-components';
import { useCallback, useEffect, useRef } from 'react';

import { StageError } from '../defs';

import './ApiSettingsStage.css';

export default function ApiSettingsStage(props: {
  clientId: string;
  clientSecret: string;
  setClientId: (clientId: string) => void;
  setClientSecret: (clientSecret: string) => void;
  setStageError: (stageError: StageError | null) => void;
  showHelp: () => void;
}): JSX.Element {
  const {
    clientId,
    clientSecret,
    setClientId,
    setClientSecret,
    setStageError,
    showHelp
  } = props;

  const clientIdInput = useRef<HTMLInputElement>(null);
  const clientSecretInput = useRef<HTMLInputElement>(null);

  const focusClientId = useCallback(
    (): void => clientIdInput.current?.focus(),
    []
  );

  const focusClientSecret = useCallback(
    (): void => clientSecretInput.current?.focus(),
    []
  );

  useEffect((): void => {
    try {
      if (clientId === '') {
        throw new StageError(
          'Client ID cannot be empty.',
          focusClientId,
          'clientId'
        );
      }

      if (!/^\d+-\w+.apps.googleusercontent.com$/.test(clientId)) {
        throw new StageError(
          'Client ID does not appear to be valid.',
          focusClientId,
          'clientId'
        );
      }

      if (clientSecret === '') {
        throw new StageError(
          'Client Secret cannot be empty.',
          focusClientSecret,
          'clientSecret'
        );
      }

      if (!/^[\w-]+=*$/.test(clientSecret)) {
        throw new StageError(
          'Client Secret does not appear to be valid.',
          focusClientSecret,
          'clientSecret'
        );
      }

      setStageError(null);
    } catch (error) {
      if ((error as Error).name === 'StageError') {
        setStageError(error as StageError);
      } else {
        throw error;
      }
    }
  }, [clientId, clientSecret, focusClientId, focusClientSecret, setStageError]);

  return (
    <div>
      <h2>Let's get you authenticated.</h2>
      <Card width={30}>
        <h3>API Settings</h3>
        <p>
          Click <Link onClick={showHelp}>Show Help</Link> below to learn how to
          set up a spreadsheet.
        </p>
        <p>
          Follow the first three steps of{' '}
          <Link
            external={true}
            href="https://forum.joaoapps.com/index.php?resources/add-a-row-of-data-to-a-google-spreadsheet-no-plugins.383/"
          >
            this Tasker guide
          </Link>{' '}
          and enter the <label htmlFor="api-client-id">Client ID</label> and{' '}
          <label htmlFor="api-client-secret">Client Secret</label> below. (Don't
          worry! This tool runs in your browser, so we can't read any of your
          data.)
        </p>
        <form>
          <Input
            id="api-client-id"
            inputRef={clientIdInput}
            label="Client ID"
            onUpdate={setClientId}
            value={clientId}
          />
          <Input
            id="api-client-secret"
            inputRef={clientSecretInput}
            label="Client Secret"
            onUpdate={setClientSecret}
            value={clientSecret}
          />
        </form>
      </Card>
    </div>
  );
}
