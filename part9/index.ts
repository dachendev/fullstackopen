import express from "express";

const app = express();
const port = 3000;

app.get("/hello", (_, res) => {
  res.send("Hello Full Stack!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
