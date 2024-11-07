const express = require("express");
const { Blog } = require("../models");
const sequelize = require("sequelize");

const router = express.Router();

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      "author",
      [sequelize.fn("count", sequelize.col("id")), "articles"],
      [sequelize.fn("sum", sequelize.col("likes")), "likes"],
    ],
    group: "author",
    order: [["likes", "DESC"]],
  });
  res.send(blogs);
});

module.exports = router;
