import express from "express";
import calculateBmi from "./bmiCalculator";
import calculateExercises from "./exerciseCalculator";

const app = express();
const port = 3000;

app.use(express.json());

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

app.post("/exercises", (req, res) => {
  const { dailyExercises, target } = req.body;

  if (!dailyExercises || !target) {
    res.status(400).json({
      error: "missing parameters",
    });
    return;
  }

  if (
    !Array.isArray(dailyExercises) ||
    !dailyExercises.every((v) => typeof v === "number" && !isNaN(v)) ||
    isNaN(Number(target))
  ) {
    res.status(400).json({
      error: "malformatted parameters",
    });
    return;
  }

  const result = calculateExercises(dailyExercises as number[], Number(target));
  res.json(result);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
