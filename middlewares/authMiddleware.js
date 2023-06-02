import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const verify = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Not authenticated" });
  } else if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_KEY);

      req.user = await User.findByPk(decoded.id);

      next();
    } catch (error) {
      res.status(500).json({ error });
    }
  }
};

export { verify };
