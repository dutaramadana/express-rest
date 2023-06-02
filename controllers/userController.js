import { Op } from "sequelize";
import User from "../models/UserModel.js";

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
  const { username, email, password, isAdmin } = req.body;
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
          isAdmin,
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

export { getUsers, createUser, getUserById, updateUser, deleteUser };
