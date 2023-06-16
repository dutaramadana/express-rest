import express from "express";
import {
  authUser,
  createUser,
  deleteUser,
  forgotPassword,
  getForgotPasswordLink,
  getUserById,
  getUsers,
  profile,
  resetPassword,
  updateUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { isAdmin, localVariables, verify } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(verify, isAdmin, getUsers);

router.route("/profile").get(verify, profile).put(verify, updateUserProfile);

router.post("/forgot-password", localVariables, forgotPassword);
router.route("/reset-password/:id/:passwordResetToken").get(getForgotPasswordLink).post(resetPassword);

router
  .route("/:id")
  .get(verify, isAdmin, getUserById)
  .put(verify, isAdmin, updateUser)
  .delete(verify, isAdmin, deleteUser);
router.post("/register", createUser);
router.post("/login", authUser);

export default router;
