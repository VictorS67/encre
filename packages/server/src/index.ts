import run from './app.js';

run().catch((err) => {
  console.log('Error starting app:', err);
  process.exit(1);
});
