import { DataTypes, Model, BuildOptions } from "sequelize";

import { sequelize } from "../mysql/db";

interface SeasonAttributes {
  seasonId?: number;
  className?: string;
  seasonImg?: string;
}
interface SeasonInstance extends Model<SeasonAttributes>, SeasonAttributes {}
export type SeasonModel = typeof Model & {
  new (values?: object, options?: BuildOptions): SeasonInstance;
};

const Season = sequelize.define(
  "seasons",
  {
    seasonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    className: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    seasonImg: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { timestamps: false }
) as SeasonModel;

export default Season;
