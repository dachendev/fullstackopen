const redis = require("./index");

const getAddedTodos = async () => {
  const strOrNull = await redis.getAsync("added_todos");
  return parseInt(strOrNull || 0);
};

const incAddedTodos = async () => {
  const n = await getAddedTodos();
  await redis.setAsync("added_todos", n + 1);
};

module.exports = {
  getAddedTodos,
  incAddedTodos,
};