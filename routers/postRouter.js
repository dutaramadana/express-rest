import express from "express";
import { createPost, getAllPosts } from "../controllers/postController.js";
import { verify } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getAllPosts).post(verify, createPost);

export default router;
