import { Op } from "sequelize";
import { User, Post } from "../models/UserPostAssociations.js";

/**
 * GET ALL POSTS
 */
const getAllPosts = async (req, res, next) => {
  try {
    // variabel dalam url berupa string, kita harus mengkonversi menjadi int
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 5;
    const author = req.query.author || "";
    const title = req.query.title || "";
    const offset = limit * page;

    const totalRows = await Post.count({
      where: {
        title: {
          [Op.like]: `%${title}%`,
        },
      },
      include: {
        model: User,
        attributes: [`username`, `email`],
        where: {
          username: {
            [Op.like]: `%${author}%`,
          },
        },
      },
    });

    const totalPage = Math.ceil(totalRows / limit);

    const result = await Post.findAll({
      where: {
        title: {
          [Op.like]: `%${title}%`,
        },
      },
      include: {
        model: User,
        attributes: [`username`, `email`],
        where: {
          username: {
            [Op.like]: `%${author}%`,
          },
        },
      },
      offset,
      limit,
    });

    let data = [];
    result.forEach((currentValue, index) => {
      data.push({
        id: currentValue.id,
        title: currentValue.title,
        slug: currentValue.slug,
        content: currentValue.content,
        createdAt: currentValue.createdAt,
        updatedAt: currentValue.updatedAt,
        author: currentValue.user.username,
      });
    });

    res.status(200).json({
      data,
      page,
      limit,
      totalRows,
      totalPage,
      totalRows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

/**
 * CREATE POST
 */
const createPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const author = req.user.username;
    const { title, content } = req.body;
    const slug = title
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    const post = await Post.create({ title, slug, content, userId });

    const data = {
      title: post.title,
      slug: post.slug,
      content: post.content,
      author: author,
      updatedAt: post.updatedAt,
      createdAt: post.createdAt,
    };

    res.status(201).json({ httpStatus: 201, message: "CREATED", data });
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * GET POST BY SLUG
 */

const getPost = async (req, res, next) => {
  const slug = req.params.slug;

  try {
    const post = await Post.findOne({
      where: { slug },
      include: {
        model: User,
      },
    });

    const data = {
      title: post.title,
      slug: post.slug,
      content: post.content,
      author: post.user.username,
      updatedAt: post.updatedAt,
      createdAt: post.createdAt,
    };

    res.status(200).json({ httpStatus: 200, message: "OK", data });
  } catch (error) {
    res.status(404).json({ httpStatus: 404, message: "Content not found" });
  }
};

export { getAllPosts, createPost, getPost };
