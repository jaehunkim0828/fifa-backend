import PlayerModel from "../models/player.model";
import PositionModel from "../models/position.model";
import RankModel from "../models/rank.model";
import SeasonModel from "../models/season.model";

export const Player = PlayerModel;

export const Season = SeasonModel;

export const Position = PositionModel;

export const Rank = RankModel;

Player.belongsTo(Season);
Rank.belongsTo(Player);
Player.hasMany(Rank);
Player.belongsTo(Position, {
  foreignKey: "positionId",
  targetKey: "spposition",
});
Position.hasMany(Player, {
  foreignKey: "positionId",
  sourceKey: "spposition",
});
Season.hasMany(Player);
