import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/databaseConfig.js";
import useBcrypt from "sequelize-bcrypt";

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Username already in use!",
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Email address already in use!",
      },
      validate: {
        isEmail: {
          msg: "Invalid email",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      field: "is_admin",
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    underscored: true,
  }
);

useBcrypt(User, {});

export default User;
