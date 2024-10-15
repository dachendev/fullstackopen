import express, { Request } from "express";
import calculateBmi from "./bmiCalculator";

const app = express();
const port = 3000;

app.get("/hello", (_, res) => {
  res.send("Hello Full Stack!");
});

interface BmiQuery {
  height: number;
  weight: number;
}

app.get("/bmi", (req: Request<{}, {}, {}, BmiQuery>, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    res.json({
      error: "malformatted parameters",
    });
    return;
  }

  const bmi = calculateBmi(height, weight);

  res.json({
    height,
    weight,
    bmi,
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
