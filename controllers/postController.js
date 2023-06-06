import { Op } from "sequelize";
import { User, Post } from "../models/UserPostAssociations.js";

/**
 * GET ALL POSTS
 */
const getAllPosts = async (req, res, next) => {
  try {

    const result = await Post.findAll({
      include: [{
          model: User,
        },
      ],
    });

    res.status(200).json({ result });

  } catch (error) {

    console.log(error);
    res.status(500).json({ error });
    
  }
};

export { getAllPosts };
