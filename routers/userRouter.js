import express from "express";
import {
  authUser,
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/userController.js";
import { isAdmin, verify } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getUsers);
router
  .route("/:id")
  .get(getUserById)
  .put(verify, isAdmin, updateUser)
  .delete(verify, isAdmin, deleteUser);
router.post("/register", createUser);
router.post("/login", authUser);

export default router;
