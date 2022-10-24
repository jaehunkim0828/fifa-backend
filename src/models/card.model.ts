import { DataTypes, Model, BuildOptions } from "sequelize";

import { sequelize } from "../mysql/db";

export interface CardAttributes {
  id?: number;
  nation: string;
  salary: number;
  image: string;
  border: string;
  bigSeason: string;
}

interface CardInstance extends Model<CardAttributes>, CardAttributes {}
export type CardModel = typeof Model & {
  new (values?: object, options?: BuildOptions): CardInstance;
};

const Card = sequelize.define(
  "cards",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nation: {
      type: DataTypes.STRING(128),
    },
    salary: {
      type: DataTypes.INTEGER,
    },
    image: {
      type: DataTypes.STRING(128),
    },
    border: {
      type: DataTypes.STRING(128),
    },
    bigSeason: {
      type: DataTypes.STRING(128),
    },
  },
  { timestamps: false }
) as CardModel;

export default Card;
