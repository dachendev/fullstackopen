import express from "express";
import cors from "cors";
import diagnosesData from "./data/diagnoses";

const app = express();
const port = 3001;

app.use(cors());

app.get("/api/ping", (_, res) => {
  res.send("pong!");
});

app.get("/api/diagnoses", (_, res) => {
  res.json({ data: diagnosesData });
});

app.listen(port, () => {
  console.log("Server listening at http://localhost:" + port);
});
