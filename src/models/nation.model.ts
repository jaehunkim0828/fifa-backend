import { DataTypes, Model, BuildOptions } from "sequelize";

import { sequelize } from "../mysql/db";

export interface NationAttributes {
  id?: number;
  name: string;
}

interface NationInstance extends Model<NationAttributes>, NationAttributes {}
export type NationModel = typeof Model & {
  new (values?: object, options?: BuildOptions): NationInstance;
};

const Nation = sequelize.define(
  "nations",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(128),
    },
  },
  { timestamps: false }
) as NationModel;

export default Nation;
