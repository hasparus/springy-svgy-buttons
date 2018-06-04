import * as React from 'react';
// tslint:disable-next-line:no-implicit-dependencies
import { render } from 'react-dom';

import './styles.css';

import {
  ButtonWithHoverCircle,
  RippleButton,
} from '../../src/springy-svgy-buttons';

const App = () => (
  <main>
    <RippleButton>Just click it</RippleButton>
    <ButtonWithHoverCircle>Hover here</ButtonWithHoverCircle>
  </main>
);

render(<App />, document.getElementById('root'));
