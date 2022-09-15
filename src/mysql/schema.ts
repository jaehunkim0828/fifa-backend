import PlayerModel from "../models/player.model";
import PositionModel from "../models/position.model";
import RankModel from "../models/rank.model";
import SeasonModel from "../models/season.model";
import ValueModel from "../models/value.model";

export const Player = PlayerModel;

export const Season = SeasonModel;

export const Position = PositionModel;

export const Rank = RankModel;

export const Value = ValueModel;

Player.belongsTo(Season);
Player.hasMany(Rank);
Player.belongsTo(Position, {
  foreignKey: "positionId",
  targetKey: "spposition",
});
Player.hasMany(Value, {
  foreignKey: "spidId",
  sourceKey: "id",
});

Rank.belongsTo(Player);

Position.hasMany(Player, {
  foreignKey: "positionId",
  sourceKey: "spposition",
});

Season.hasMany(Player);

Value.belongsTo(Player, {
  foreignKey: "spidId",
  targetKey: "id",
});
