import * as React from 'react';
import { render } from 'react-dom';

import App from './App';

document.body.innerHTML = '<div id="root" />';
render(<App />, document.getElementById('root'));

if ((module as any).hot) {
  (module as any).hot.accept();
}
