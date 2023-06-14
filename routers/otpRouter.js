import express from "express";
import { localVariables, verify } from "../middlewares/authMiddleware.js";
import { generateOTP, verivyOTP } from "../controllers/otpController.js";

const router = express.Router();

router.route("/generateOTP").get(verify, localVariables, generateOTP);
router.route("/verivyOTP").get(verify, verivyOTP);

export default router;
