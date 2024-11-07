const { User, Blog } = require("../models");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  res.send(users);
});

router.post("/", async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(201).send(newUser);
});

router.put("/:username", async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });

  if (!user) {
    return res.sendStatus(404);
  }

  if (typeof req.body.username !== "string") {
    return res.sendStatus(400);
  }

  user.username = req.body.username;
  await user.save();

  res.send(user);
});

module.exports = router;
