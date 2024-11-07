const express = require("express");
const Blog = require("./Blog");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/api/blogs", async (req, res) => {
  const blogs = await Blog.findAll();
  res.send(blogs);
});

app.post("/api/blogs", async (req, res) => {
  const blog = await Blog.create(req.body);
  res.status(201).send(blog);
});

app.delete("/api/blogs/:id", async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id);
  await blog.destroy();
  res.sendStatus(204);
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).send({ error: err });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
