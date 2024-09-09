import express from 'express';
import appRouter from './app/index.js';
import nodesRouter from './nodes/index.js';
import registryRouter from './registry/index.js';

const router = express.Router();

router.use('/app', appRouter);
router.use('/nodes', nodesRouter);
router.use('/registry', registryRouter);

export default router;
