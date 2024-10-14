interface Args {
  height: number;
  weight: number;
}

const parseArguments = (args: string[]): Args => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  const height = Number(args[2]);
  if (isNaN(height)) {
    throw new Error("Provided height was not a number");
  }

  const weight = Number(args[3]);
  if (isNaN(weight)) {
    throw new Error("Provided weight was not a number");
  }

  return { height, weight };
};

/**
 * Calculate BMI based on a given height and weight
 * @param height - the height (in centimeters)
 * @param weight - the weight (in kilograms)
 * @returns a message that suits the results
 */
const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / Math.pow(height / 100, 2);

  if (bmi < 16) return "Underweight (Severe thinness)";
  if (bmi < 17) return "Underweight (Moderate thinness)";
  if (bmi < 18.5) return "Underweight (Mild thinness)";
  if (bmi < 25) return "Normal range";
  if (bmi < 30) return "Overweight (Pre-obese)";
  if (bmi < 35) return "Obese (Class I)";
  if (bmi < 40) return "Obese (Class II)";
  return "Obese (Class III)";
};

try {
  const { height, weight } = parseArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (err: unknown) {
  if (err instanceof Error) {
    console.log("Error:", err.message);
  }
}

export {};
