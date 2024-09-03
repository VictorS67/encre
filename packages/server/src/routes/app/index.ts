import express from 'express';
import nodesController from '../../controllers/app/index.js';

const router = express.Router();

router.post('/run', nodesController.run);

export default router;
