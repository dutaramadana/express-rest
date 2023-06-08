import { Op } from "sequelize";
import User from "../models/UserModel.js";
import Post from "../models/PostModel.js";
import generateToken from "../utils/generateToken.js";

/**
 * LOG IN USER
 */
const authUser = async (req, res, next) => {
  const { email, password } = req.body;

  // ambil user berdasarkan email
  const user = await User.findOne({
    where: {
      email,
    },
  });

  // cek password
  const isAuthenticated = user?.authenticate(password);

  if (user && isAuthenticated) {
    res.status(200).json({ user, token: generateToken(user.id, user.email) });
  } else {
    res.status(500).json({ error: "Incorrect email or password" });
  }
};

/**
 * GET ALL USERS
 */
const getUsers = async (req, res, next) => {
  // variabel dalam url berupa string, kita harus mengkonversi menjadi int
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search || "";
  const offset = limit * page;

  const totalRows = await User.count({
    where: {
      [Op.or]: [
        {
          username: {
            [Op.like]: `%${search}%`,
          },
        },
      ],
    },
  });

  const totalPage = Math.ceil(totalRows / limit);

  const result = await User.findAll({
    where: {
      [Op.or]: [
        {
          username: {
            [Op.like]: `%${search}%`,
          },
        },
      ],
    },
    offset,
    limit,
  });

  res.status(200).json({
    result,
    page,
    limit,
    totalRows,
    totalPage,
  });
};

/**
 * GET USER BY ID
 */

const getUserById = async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findByPk(userId);

  if (user === null) {
    res.status(404).json({ error: `User with ID: ${userId} is not found` });
  } else {
    res.status(200).json({ user });
  }
};

/**
 * CREATE USER
 */
const createUser = async (req, res, next) => {
  const { username, email, password, isAdmin } = req.body;

  try {
    const user = await User.create({ username, email, password, isAdmin });
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.errors[0].message });
  }
};

/**
 * UPDATE USER BY ID
 */
const updateUser = async (req, res, next) => {
  const userId = req.params.id;
  const { username, email, password } = req.body;
  const user = await User.findByPk(userId);

  try {
    if (user === null) {
      res.status(404).json({ message: `User with ID: ${userId} is not found` });
    } else {
      await User.update(
        {
          username,
          email,
          password,
        },
        {
          where: {
            id: userId,
          },
        }
      );
      res
        .status(200)
        .json({ message: `User with ID: ${userId} updated successfully` });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

/**
 * DELETE USER BY ID
 */

const deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findByPk(userId);

  if (user === null) {
    res.status(404).json({ message: `User with ID: ${userId} is not found` });
  } else {
    await User.destroy({
      where: {
        id: user.id,
      },
    });
    res
      .status(200)
      .json({ message: `User with ID: ${userId} deleted successfully` });
  }
};

/**
 * GET USER PROFILE (USER DETAILS AND USER POST)
 */
const profile = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 3;
    const title = req.query.title || "";
    const offset = limit * page;

    const userId = req.user.id;

    const totalRows = await Post.count({
      where: {
        userId,
        title: {
          [Op.like]: `%${title}%`,
        },
      },
    });

    const totalPage = Math.ceil(totalRows / limit);

    const user = await User.findByPk(userId);
    const userPost = await Post.findAll({
      where: {
        userId,
        title: {
          [Op.like]: `%${title}%`,
        },
      },
      attributes: {
        exclude: ["id", "userId"],
      },
      offset,
      limit,
    });

    if (userPost.length === 0) {
      res.status(200).json({ userDetails: user, userPost: "No Content" });
    } else {
      res.status(200).json({
        userDetails: user,
        userPost,
        page,
        limit,
        totalRows,
        totalPage,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Something wrong" });
  }
};

/**
 * UPDATE USER PROFILE
 */
const updateUserProfile = async (req, res, next) => {
  try {
    // get user from header
    const userId = req.user.id;
    const { username, email, password } = req.body;
    const user = await User.findByPk(userId);
    
    if(user){
      user.username = username || user.username
      user.email = email || user.email

      if(password){
        user.password = password
      }

      const updatedUser = await user.save();
      res.status(200).json({ updatedUser });
      
    } 
    

  } catch (error) {
    res.status(500).json({ error });
  }
};

export {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  authUser,
  profile,
  updateUserProfile,
};
