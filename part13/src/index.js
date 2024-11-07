const express = require("express");
const usersRouter = require("./controllers/users");
const blogsRouter = require("./controllers/blogs");
const { connectToDatabase } = require("./util/db");
const { PORT } = require("./util/config");

const app = express();

app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/blogs", blogsRouter);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.log(err.stack);
  res.status(500).send({ error: err });
});

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
};

start();
