import React, { useEffect, useState } from 'react';
import {
  ErrorBoundary,
  useErrorBoundary,
  type FallbackProps,
} from 'react-error-boundary';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';

import { init as initConnection } from 'internal/src/fetch';
import '@atlaskit/css-reset';

import './App.css';
import { EncreStudio } from './components/EncreStudio';

const queryClient = new QueryClient();

function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AppInner />
        </ErrorBoundary>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

function AppInner() {
  const [initializing, setInitializing] = useState(true);
  const { showBoundary: showErrorBoundary } = useErrorBoundary();

  async function init() {
    const socketName = await global.Encre.getServerSocket();

    await initConnection(socketName);
  }

  useEffect(() => {
    async function initAll() {
      await Promise.all([init()]);
      setInitializing(false);
    }

    initAll().catch(showErrorBoundary);
  }, []);

  return (
    <>
      {initializing && <div>Initializing...</div>}
      {!initializing && <EncreStudio />}
    </>
  );
}

function ErrorFallback({ error }: FallbackProps) {
  return (
    <>
      <div>{error}</div>
    </>
  );
}

export default App;
