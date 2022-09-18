import { DataTypes, Model, BuildOptions } from "sequelize";
import { Ranks } from "../entities/rank.entities";

import { sequelize } from "../mysql/db";
import { PositionAttributes } from "./position.model";
import { RankInstance } from "./rank.model";
import { SeasonAttributes } from "./season.model";

export interface PlayerAttributes {
  id: number;
  name: string;
  seasonSeasonId: string;
  positionId: string | null;
  ranks?: Ranks[] | [];
  season?: SeasonAttributes;
  position?: PositionAttributes;
}
export interface PlayerInstance extends Model<PlayerAttributes>, PlayerAttributes {}

export type PlayerModel = typeof Model & {
  new (values?: object, options?: BuildOptions): PlayerInstance;
};

const Player = sequelize.define(
  "spids",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
  },
  { timestamps: false }
) as PlayerModel;

export default Player;
