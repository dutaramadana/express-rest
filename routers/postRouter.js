import express from "express";
import {
  createPost,
  getAllPosts,
  getPost,
} from "../controllers/postController.js";
import { verify } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getAllPosts).post(verify, createPost);
router.route("/:slug").get(getPost);

export default router;
