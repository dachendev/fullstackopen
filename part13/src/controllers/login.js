const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { SECRET } = require("../util/config");

const router = express.Router();

router.post("/", async (req, res) => {
  if (typeof req.body.username !== "string") {
    return res.status(400).send({ error: "missing username" });
  }

  if (typeof req.body.password !== "string") {
    return res.status(400).send({ error: "missing password" });
  }

  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  const passwordCheck = req.body.password === "secret";

  if (!(user && passwordCheck)) {
    return res.status(401).send({ error: "invalid username or password" });
  }

  const payload = {
    id: user.id,
    username: user.username,
  };

  const token = jwt.sign(payload, SECRET);

  res.send({
    token,
    name: user.name,
    username: user.username,
  });
});

module.exports = router;
