import express from "express";
import {
  createPost,
  deletePost,
  editPost,
  getAllPosts,
  getPost,
} from "../controllers/postController.js";
import { verify } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getAllPosts).post(verify, createPost);
router
  .route("/:slug")
  .get(getPost)
  .put(verify, editPost)
  .delete(verify, deletePost);

export default router;
