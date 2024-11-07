const express = require("express");
const { Reading } = require("../models");

const router = express.Router();

router.post("/", async (req, res) => {
  if (typeof req.body.userId !== "number") {
    return res.status(400).send({ error: "missing userId" });
  }

  if (typeof req.body.blogId !== "number") {
    return res.status(400).send({ error: "missing blogId" });
  }

  const newReading = await Reading.create({
    userId: req.body.userId,
    blogId: req.body.blogId,
  });

  res.status(201).send(newReading);
});

router.put("/:id", async (req, res) => {
  if (typeof req.body.read !== "boolean") {
    return res.status(400).send({ error: "read invalid" });
  }

  const reading = await Reading.findByPk(req.params.id);

  reading.read = req.body.read;
  await reading.save();

  return res.send(reading);
});

module.exports = router;
