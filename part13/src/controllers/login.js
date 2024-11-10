const express = require("express");
const { User, Session } = require("../models");

const router = express.Router();

router.post("/", async (req, res) => {
  if (typeof req.body.username !== "string") {
    return res.status(400).send({ error: "username missing" });
  }

  if (typeof req.body.password !== "string") {
    return res.status(400).send({ error: "password missing" });
  }

  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  const passwordCheck = req.body.password === "secret";

  if (!(user && passwordCheck)) {
    return res.status(401).send({ error: "username or password invalid" });
  }

  const session = await Session.create({
    expiresAt: Date.now() + 1 * 60 * 60 * 1000, // 1 hr
    userId: user.id,
  });

  res.send({ sessionId: session.id });
});

module.exports = router;
