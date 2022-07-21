import { DataTypes } from "sequelize";

import { sequelize } from "../mysql/db";

export const Player = sequelize.define(
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
);

export const Season = sequelize.define(
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
);

Player.belongsTo(Season);

export const Position = sequelize.define(
  "position",
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
  },
  { timestamps: false }
);

export const Rank = sequelize.define(
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
);

Rank.belongsTo(Player);
Player.hasMany(Rank);
