const express = require('express');
const router = express.Router();
const redisService = require("../redis/redisService");

const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

router.get('/statistics', async (req, res) => {
  const n = await redisService.getAddedTodos();
  res.send({ added_todos: n });
});

module.exports = router;
