import express from "express";
import {
  authUser,
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/userController.js";
import { verify } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(verify, getUsers);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);
router.post("/register", createUser);
router.post("/login", authUser);

export default router;
