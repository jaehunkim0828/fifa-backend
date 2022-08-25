import { DataTypes, Model, BuildOptions } from "sequelize";
import { Ranks } from "../entities/rank.entities";

import { sequelize } from "../mysql/db";

interface RankAttributes extends Ranks {
  readonly id?: number;
}
interface RankInstance extends Model<RankAttributes>, RankAttributes {}
export type RankModel = typeof Model & {
  new (values?: object, options?: BuildOptions): RankInstance;
};

const Rank = sequelize.define(
  "rank",
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    matchCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    position: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    assist: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    block: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dribble: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dribbleSuccess: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dribbleTry: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    effectiveShoot: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    goal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    passSuccess: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    passTry: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    shoot: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    tackle: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    createDate: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
  },
  { timestamps: false }
) as RankModel;

export default Rank;
