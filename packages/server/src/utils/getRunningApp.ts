import * as App from '../app.js';

export const getRunningApp = function () {
  const runningInstance = App.getInstance();
  if (typeof runningInstance === 'undefined') {
    throw new Error('Server is not running!');
  }
  return runningInstance;
};
