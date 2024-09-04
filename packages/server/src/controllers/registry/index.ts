import { Request, Response, NextFunction } from 'express';
import registryService from '../../services/registry/index.js';

const getRegisteredNodes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await registryService.getRegisteredNodes();
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

const getRegisteredNodeTypes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await registryService.getRegisteredNodeTypes();
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

const getRegisteredNodeTypePairs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await registryService.getRegisteredNodeTypePairs();
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

export default {
  getRegisteredNodes,
  getRegisteredNodeTypes,
  getRegisteredNodeTypePairs
};