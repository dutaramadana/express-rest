import { Op } from "sequelize";
import { User, Post } from "../models/UserPostAssociations.js";

/**
 * @description GET ALL POSTS
 * @route       GET /api/posts
 * @access      public
 */
const getAllPosts = async (req, res) => {
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
 * @description GET POST BY SLUG
 * @route       GET /api/posts/:slug
 * @access      public
 */
const getPost = async (req, res) => {
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

/**
 * @description CREATE POST
 * @route       POST /api/posts
 * @access      private
 */
const createPost = async (req, res) => {
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
 * @description EDIT POST
 * @route       PUT /api/posts/:slug
 * @access      private
 */
const editPost = async (req, res) => {
  const slugParam = req.params.slug;
  const userId = req.user.id;

  const { title, content } = req.body;
  const slug = title
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
    .toLowerCase();

  try {
    const post = await Post.findOne({
      where: { slug: slugParam },
      include: {
        model: User,
      },
    });

    if (post.user.id !== userId) {
      res.status(403).json({ message: "FORBIDDEN!" });
    } else {
      post.title = title || post.title;
      post.slug = slug || post.slug;
      post.content = content || post.content;

      const updatedPost = await post.save();

      const data = {
        title: updatedPost.title,
        slug: updatedPost.slug,
        content: updatedPost.content,
        author: updatedPost.user.username,
        updatedAt: updatedPost.updatedAt,
        createdAt: updatedPost.createdAt,
      };
      res.status(200).json({ message: "OK", data });
    }
  } catch (error) {
    res.status(404).json({ httpStatus: 404, message: "Content not found" });
  }
};

/**
 * @description DELETE POST
 * @route       PUT /api/posts/:slug
 * @access      private
 */
const deletePost = async (req, res) => {
  const slugParam = req.params.slug;
  const userId = req.user.id;

  try {
    const post = await Post.findOne({
      where: { slug: slugParam },
      include: {
        model: User,
      },
    });

    if (post.user.id !== userId) {
      res.status(403).json({ httpStatus: 403, message: "FORBIDDEN" });
    } else {
      await post.destroy();
      res
        .status(200)
        .json({ httpStatus: 200, message: "Post Deleted Successfully" });
    }
  } catch (error) {
    res.status(404).json({ httpStatus: 404, message: "Content not found" });
  }
};

export { getAllPosts, createPost, getPost, editPost, deletePost };
