const { Blog } = require("../models");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.send(blogs);
});

router.post("/", async (req, res) => {
  const blog = await Blog.create(req.body);
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

router.delete("/:id", async (req, res) => {
  const blog = await blog.findByPk(req.params.id);

  if (!blog) {
    return res.sendStatus(404);
  }

  await blog.destroy();

  res.sendStatus(204);
});

module.exports = router;
