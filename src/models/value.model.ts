import { DataTypes, Model, BuildOptions } from "sequelize";
import { sequelize } from "../mysql/db";
import { PlayerAttributes } from "./player.model";

export interface ValueAttributes {
  id?: number;
  rating: number;
  price: string;
  spidId: string;
  player?: PlayerAttributes;
}
export interface ValueInstance extends Model<ValueAttributes>, ValueAttributes {}

export type ValueModel = typeof Model & {
  new (values?: object, options?: BuildOptions): ValueInstance;
};

const Value = sequelize.define(
  "values",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  },
  { timestamps: false }
) as ValueModel;

export default Value;
