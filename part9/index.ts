import express from "express";
import calculateBmi from "./bmiCalculator";

const app = express();
const port = 3000;

app.get("/hello", (_, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;

  if (!height || !weight) {
    res.status(400).json({
      error: "missing parameters",
    });
    return;
  }

  if (isNaN(Number(height)) || isNaN(Number(weight))) {
    res.status(400).json({
      error: "malformatted parameters",
    });
    return;
  }

  const bmi = calculateBmi(Number(height), Number(weight));

  res.json({
    height,
    weight,
    bmi,
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
