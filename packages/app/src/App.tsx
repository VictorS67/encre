import React from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { AppGuesser } from './components/AppGuesser';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <RecoilRoot>
      <AppGuesser />
    </RecoilRoot>
  );
}

export default App;
