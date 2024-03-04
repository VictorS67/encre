import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import '@atlaskit/css-reset';
import { EncreStudio } from './components/EncreStudio';
import logo from './logo.svg';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <EncreStudio />
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;
