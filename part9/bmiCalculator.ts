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

console.log(calculateBmi(180, 74));
