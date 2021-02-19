import * as React from 'react';
import { ChangeEvent, useCallback, useEffect, useRef } from 'react';

import { StageError } from '../TrackerUtils';

import './ApiSettingsStage.css';

export default function ApiSettingsStage(props: {
  clientId: string;
  clientSecret: string;
  setClientId: (clientId: string) => void;
  setClientSecret: (clientSecret: string) => void;
  setStageError: (stageError: StageError | null) => void;
}): JSX.Element {
  const {
    clientId,
    clientSecret,
    setClientId,
    setClientSecret,
    setStageError
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

  const updateClientSecret = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void =>
      setClientSecret(event.currentTarget.value),
    [setClientSecret]
  );

  const updateClientId = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void =>
      setClientId(event.currentTarget.value),
    [setClientId]
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
      if (error instanceof StageError) {
        setStageError(error);
      } else {
        throw error;
      }
    }
  }, [clientId, clientSecret, focusClientId, focusClientSecret, setStageError]);

  return (
    <div>
      <h2>Let's get you authenticated.</h2>
      <article className="api-card">
        <h3>API Settings</h3>
        <p>
          Follow the first three steps of{' '}
          <a href="https://forum.joaoapps.com/index.php?resources/add-a-row-of-data-to-a-google-spreadsheet-no-plugins.383/">
            this Tasker guide
          </a>{' '}
          and enter the <label htmlFor="api-client-id">Client ID</label> and{' '}
          <label htmlFor="api-client-secret">Client Secret</label> below.
        </p>
        <p>
          Don't worry&mdash;this whole service runs within your browser, so we
          can't read any of your data.
        </p>
        <form>
          <div className="form-control">
            <label htmlFor="api-client-id">Client ID</label>
            <div className="input-group">
              <input
                id="api-client-id"
                onChange={updateClientId}
                ref={clientIdInput}
                type="text"
                value={clientId}
              />
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="api-client-secret">Client Secret</label>
            <div className="input-group">
              <input
                id="api-client-secret"
                onChange={updateClientSecret}
                ref={clientSecretInput}
                type="text"
                value={clientSecret}
              />
            </div>
          </div>
        </form>
      </article>
    </div>
  );
}
