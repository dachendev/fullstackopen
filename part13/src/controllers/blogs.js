const { User, Blog } = require("../models");
const express = require("express");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");
const { Op } = require("sequelize");

const getToken = (req) => {
  const auth = req.get("authorization");
  if (auth && auth.startsWith("Bearer ")) {
    return auth.slice(7);
  }
  return null;
};

const authMiddleware = async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).send({ error: "missing token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).send({ error: "token invalid" });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).send({ error: "token invalid" });
  }
};

const router = express.Router();

router.get("/", async (req, res) => {
  const where = {};

  if (req.query.search) {
    where.title = {
      [Op.substring]: req.query.search,
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
    },
    where,
  });
  res.send(blogs);
});

router.post("/", authMiddleware, async (req, res) => {
  const blog = await Blog.create({ ...req.body, userId: req.user.id });
  res.status(201).send(blog);
});

router.put("/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);

  if (!blog) {
    return res.sendStatus(404);
  }

  if (typeof req.body.likes !== "number") {
    return res.sendStatus(400);
  }

  blog.likes = req.body.likes;
  await blog.save();

  res.send(blog);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);

  if (!blog) {
    return res.sendStatus(404);
  }

  if (blog.userId !== req.user.id) {
    return res.sendStatus(401);
  }

  await blog.destroy();

  res.sendStatus(204);
});

module.exports = router;
