import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/").get(getUsers);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);
router.post("/register", createUser);

export default router;
