import React from 'react';

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import '@atlaskit/css-reset';
import { AppGuesser } from './components/AppGuesser';
import { EncreStudio } from './components/EncreStudio';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <RecoilRoot>
      <EncreStudio />
    </RecoilRoot>
  );
}

export default App;
