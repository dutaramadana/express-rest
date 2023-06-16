const notFound = (req, res, next) => {
  const path = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

  res.status(404).json({ statusCode: 404, path, message: "Not Found" });
  next();
};

export { notFound };
