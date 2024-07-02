import express from 'express';
import nodesController from '../../controllers/nodes/index.js';

const router = express.Router();

router.get('/', nodesController.getAllNodes);
router.get(['/', '/:id'], nodesController.getNodeById);
router.post(['/', '/:type/:subtype'], nodesController.getNode);
router.post('/node-io/', nodesController.getNodeIODefs);
router.post('/node-body/', nodesController.getNodeBody);

export default router;
