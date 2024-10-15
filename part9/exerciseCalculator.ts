interface Args {
  hours: number[];
  target: number;
}

const parseArguments = (args: string[]): Args => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  const hours = args[2].split(",").map((s) => {
    const num = Number(s);
    if (isNaN(num)) {
      throw new Error("Provided hours were not numbers");
    }
    return num;
  });

  const target = Number(args[3]);
  if (isNaN(target)) {
    throw new Error("Provided target was not a number");
  }

  return { hours, target };
};

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (hours: number[], target: number): Result => {
  let totalHours = 0;
  let trainingDays = 0;

  for (const h of hours) {
    if (h > 0) trainingDays++;
    totalHours += h;
  }

  const average = totalHours / hours.length;
  const success = average >= target;

  let rating;
  let ratingDescription;

  if (success) {
    rating = 3;
    ratingDescription =
      "Excellent work! You've exceeded your goals and made great progress.";
  } else if (average > 0.5 * target) {
    rating = 2;
    ratingDescription =
      "Good effort! You're getting close to your goal, keep pushing.";
  } else {
    rating = 1;
    ratingDescription =
      "Needs improvement. Consistency is key to achieving better results.";
  }

  return {
    periodLength: hours.length,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
  const { hours, target } = parseArguments(process.argv);
  console.log(calculateExercises(hours, target));
} catch (err: unknown) {
  if (err instanceof Error) {
    console.log("Error:", err.message);
  }
}

export {};
