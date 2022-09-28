import { DataTypes, Model, BuildOptions } from "sequelize";

import { sequelize } from "../mysql/db";
export interface PositionAttributes {
  spposition?: number;
  desc?: string;
  part?: string;
}
interface PositionInstance extends Model<PositionAttributes>, PositionAttributes {}
export type PositionModel = typeof Model & {
  new (values?: object, options?: BuildOptions): PositionInstance;
};

const Position = sequelize.define(
  "positions",
  {
    spposition: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    desc: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    part: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  },
  { timestamps: false }
) as PositionModel;

export default Position;
