import axios from "axios";
import { Request, Response, NextFunction } from "express";

import * as playerRepository from "../repository/player";
import * as playerService from "../service/player.service";
import { getFifaApi } from "../method";
import { Player, Season } from "../mysql/schema";

export async function getPlayerByName(req: Request, res: Response, next: NextFunction) {
  const { name } = req.params;
  try {
    const player = await playerService.findPlayers(name);
    res.status(200).send(player);
  } catch (err) {
    res.status(404).send(err);
  }
}

export async function updateSeason(req: Request, res: Response, next: NextFunction) {
  try {
    await playerService.updateSeason();
    res.status(200).send("season");
  } catch (err) {
    res.status(404).send(err);
  }
}

export async function getPlayerById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  try {
    const data = await playerService.findPlayerById(id);
    res.send(data);
  } catch (err) {
    res.status(404).send(err);
  }
}
