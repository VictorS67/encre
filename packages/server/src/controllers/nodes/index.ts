import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { InternalError } from "../../exceptions/internal.js";
import nodesService from "../../services/nodes/index.js";

const getAllNodes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await nodesService.getAllNodes();
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

const getNodeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (typeof req.params === "undefined" || !req.params.id) {
      throw new InternalError(
        StatusCodes.PRECONDITION_FAILED,
        "nodesController.getNodeById: id not provided!"
      );
    }
    const response = await nodesService.getNodeById(req.params.id);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

const getNode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      typeof req.params === "undefined" ||
      !req.params.type ||
      !req.params.subtype
    ) {
      throw new InternalError(
        StatusCodes.PRECONDITION_FAILED,
        "nodesController.getNode - type or subtype not provided!"
      );
    }
    const response = await nodesService.getNode(
      req.params.type,
      req.params.subtype,
      req.body
    );
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

const getNodeIODefs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await nodesService.getNodeIODefs(req.body);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

const getNodeBody = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await nodesService.getNodeBody(req.body);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

const getNodeAttrs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await nodesService.getNodeAttrs(req.body);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllNodes,
  getNodeById,
  getNode,
  getNodeIODefs,
  getNodeBody,
  getNodeAttrs,
};
