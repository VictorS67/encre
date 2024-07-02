import express from 'express';
import registryController from '../../controllers/registry/index.js';

const router = express.Router();

router.get('/nodes', registryController.getRegisteredNodes);
router.get('/nodes/types', registryController.getRegisteredNodeTypes);
router.get('/nodes/type-pairs/', registryController.getRegisteredNodeTypePairs);

export default router;