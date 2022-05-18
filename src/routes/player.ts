import express, {Request, Response, NextFunction} from 'express';


import * as playerController from '../controller/player';



const playerRouter = express.Router();

playerRouter.route('/spid')
    .get(playerController.getSpid);

playerRouter.route('/season')
    .get(playerController.getSeason);

playerRouter.route('/:id')
    .get(playerController.getPlayerById);

    export default playerRouter;