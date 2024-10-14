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

  for (let h of hours) {
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

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
