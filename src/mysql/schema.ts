import PlayerModel from "../models/player.model";
import PositionModel from "../models/position.model";
import RankModel from "../models/rank.model";
import SeasonModel from "../models/season.model";
import ValueModel from "../models/value.model";
import CommentModel from "../models/comment";
import PostModel from "../models/post.model";

export const Player = PlayerModel;
export const Season = SeasonModel;
export const Position = PositionModel;
export const Rank = RankModel;
export const Value = ValueModel;
export const Comment = CommentModel;
export const Post = PostModel;

// spids
Player.belongsTo(Season);
Player.hasMany(Rank);
Player.belongsTo(Position, {
  foreignKey: "positionId",
  targetKey: "spposition",
});
Player.hasMany(Value, {
  foreignKey: "spidId",
  sourceKey: "id",
});
Player.belongsTo(Post, {
  foreignKey: "postId",
  targetKey: "id",
});

// ranks
Rank.belongsTo(Player);

// positions
Position.hasMany(Player, {
  foreignKey: "positionId",
  sourceKey: "spposition",
});

//seasons
Season.hasMany(Player);

//values
Value.belongsTo(Player, {
  foreignKey: "spidId",
  targetKey: "id",
});

//posts
Post.hasMany(Comment, {
  foreignKey: "postId",
  sourceKey: "id",
});
Post.hasMany(Player, {
  foreignKey: "postId",
  sourceKey: "id",
});

// comment
Comment.belongsTo(Post, {
  foreignKey: "postId",
  targetKey: "id",
});
