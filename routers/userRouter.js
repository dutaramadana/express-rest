import express from "express";
import {
  authUser,
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  profile,
  updateUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { isAdmin, verify } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getUsers);

router.route("/profile").get(verify, profile).put(verify, updateUserProfile);

router
  .route("/:id")
  .get(getUserById)
  .put(verify, isAdmin, updateUser)
  .delete(verify, isAdmin, deleteUser);
router.post("/register", createUser);
router.post("/login", authUser);

export default router;
