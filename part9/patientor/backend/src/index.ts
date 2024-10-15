import express from "express";
import cors from "cors";

const app = express();
const port = 3001;

app.use(cors());

app.get("/api/ping", (_, res) => {
  res.send("pong!");
});

app.listen(port, () => {
  console.log("Server listening at http://localhost:" + port);
});
