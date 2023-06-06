import Post from "./PostModel.js";
import User from "./UserModel.js";

User.hasMany(Post);

Post.belongsTo(User);

export { User, Post };
