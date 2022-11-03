import { DataTypes, Model, BuildOptions } from "sequelize";

import { sequelize } from "../mysql/db";

export interface TeamAttributes {
  id?: number;
  name: string;
}

interface TeamInstance extends Model<TeamAttributes>, TeamAttributes {}
export type TeamModel = typeof Model & {
  new (values?: object, options?: BuildOptions): TeamInstance;
};

const Team = sequelize.define(
  "teams",
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
) as TeamModel;

export default Team;
