const { User, Blog } = require("../models");
const express = require("express");
const { Op } = require("sequelize");
const { sessionMiddleware } = require("../middleware");

const router = express.Router();

router.get("/", async (req, res) => {
  const where = {};

  if (req.query.search) {
    where[Op.or] = {
      title: {
        [Op.substring]: req.query.search,
      },
      author: {
        [Op.substring]: req.query.search,
      },
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
    },
    where,
    order: [["likes", "DESC"]],
  });
  res.send(blogs);
});

router.post("/", sessionMiddleware, async (req, res) => {
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

router.delete("/:id", sessionMiddleware, async (req, res) => {
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
