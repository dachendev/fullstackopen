const express = require("express");
const { sessionMiddleware } = require("../middleware");
const { Session } = require("../models");

const router = express.Router();

router.delete("/", sessionMiddleware, async (req, res) => {
  await Session.destroy({
    where: {
      id: req.sessionId,
    },
  });

  res.sendStatus(204);
});

module.exports = router;
