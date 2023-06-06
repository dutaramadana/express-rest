import express from "express";
import { getAllPosts } from "../controllers/postController.js";

const router = express.Router();

router.route("/").get(getAllPosts);

export default router;
