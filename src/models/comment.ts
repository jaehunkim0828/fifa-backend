import { DataTypes, Model, BuildOptions } from "sequelize";

import { sequelize } from "../mysql/db";

enum CommentRoleStatus {
  user = "user",
  admin = "admin",
}

export interface CommentAttributes {
  id?: number;
  username: string;
  content: string;
  role: "user" | "admin";
  createAt: Date;
  groupNum: number;
  postId: number;
  hierarchy: number;
  password: string;
  addChat?: CommentAttributes[];
}

export class InputComment implements CommentAttributes {
  username = "";
  content = "";
  role = CommentRoleStatus.user;
  createAt = new Date();
  groupNum = 0;
  postId = 0;
  hierarchy = 0;
  password = "";
}

interface CommentInstance extends Model<CommentAttributes>, CommentAttributes {}
export type CommentModel = typeof Model & {
  new (values?: object, options?: BuildOptions): CommentInstance;
};

const Comment = sequelize.define(
  "comments",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
    },
    createAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    groupNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hierarchy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  },
  { timestamps: false }
) as CommentModel;

export default Comment;
