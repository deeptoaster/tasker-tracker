import 'core-js/es/map';
import 'core-js/es/set';
import * as React from 'react';
import { render } from 'react-dom';

import App from './App';

render(<App />, document.getElementById('root'));

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
if ((module as any).hot != null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  (module as any).hot.accept();
}
