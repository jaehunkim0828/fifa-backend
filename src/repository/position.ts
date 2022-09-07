import Rank from "../models/rank.model";
import Player from "../models/player.model";
import Position from "../models/position.model";

export async function findPositionAvg(part: string) {
  return Rank.findAll({
    attributes: [
      "name",
      "assist",
      "block",
      "dribble",
      "dribbleSuccess",
      "dribbleTry",
      "effectiveShoot",
      "goal",
      "passSuccess",
      "passTry",
      "shoot",
      "tackle",
      "matchCount",
    ],
    include: [
      {
        model: Player,
        attributes: [],
        required: true,
        include: [
          {
            model: Position,
            attributes: [],
            where: {
              part,
            },
          },
        ],
      },
    ],
  });
}

export async function findPartByPlayer(spid: string) {
  return await Player.findOne({
    attributes: [],
    where: {
      id: spid,
    },
    include: [
      {
        model: Position,
        attributes: ["part", "desc"],
      },
    ],
  });
}
