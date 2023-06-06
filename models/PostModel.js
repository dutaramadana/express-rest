import { DataTypes } from "sequelize";
import sequelize from "../config/databaseConfig.js";
import User from "./UserModel.js"

const Post = sequelize.define("post", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  underscored: true
});


export default Post;
