import * as React from 'react';
import { ChangeEvent, useCallback } from 'react';

import './ApiSettingsStage.css';

export default function ApiSettingsStage(props: {
  clientId: string;
  clientSecret: string;
  setClientId: (clientId: string) => void;
  setClientSecret: (clientSecret: string) => void;
}): JSX.Element {
  const { clientId, clientSecret, setClientId, setClientSecret } = props;

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
