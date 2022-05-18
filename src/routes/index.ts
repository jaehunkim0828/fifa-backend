import express from 'express';

import playerRouter from './player';

const rootRouter = express.Router();

rootRouter.use('/player', playerRouter);

export default rootRouter;