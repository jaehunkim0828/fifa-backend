import { DataTypes, Model, BuildOptions } from "sequelize";

import { sequelize } from "../mysql/db";
import { RankModel } from "./rank.model";
import { SeasonModel } from "./season.modle";
interface PlayerAttributes {
  id: number;
  name: string;
  ranks?: RankModel;
  seasons?: SeasonModel;
}
interface PlayerInstance extends Model<PlayerAttributes>, PlayerAttributes {}
type Player = typeof Model & {
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
) as Player;

export default Player;
