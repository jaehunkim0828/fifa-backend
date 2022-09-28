import { DataTypes, Model, BuildOptions } from "sequelize";

import { sequelize } from "../mysql/db";

export interface PostAttributes {
  id?: number;
  name?: string;
}
interface PostInstance extends Model<PostAttributes>, PostAttributes {}
export type PostModel = typeof Model & {
  new (values?: object, options?: BuildOptions): PostInstance;
};

const Post = sequelize.define(
  "posts",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  },
  { timestamps: false }
) as PostModel;

export default Post;
