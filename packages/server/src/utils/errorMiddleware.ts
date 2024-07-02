import express from 'express';

export default async function middleware(
  err: any,
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  console.log('ERROR', err);
  res.status(500).send({ status: 'error', reason: 'internal-error' });
}
