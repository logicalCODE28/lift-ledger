/**
 * Pure business logic for LiftLedger (Gym Performance & Macro Calculator).
 * Completely decoupled from the UI layer for deterministic unit testing.
 */

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const GOAL_CONFIG = {
  cut: {
    calorieMultiplier: 0.8, // 20% caloric deficit
    macroSplit: { protein: 0.4, carbs: 0.35, fats: 0.25 },
  },
  maintain: {
    calorieMultiplier: 1.0, // Maintenance calories
    macroSplit: { protein: 0.3, carbs: 0.4, fats: 0.3 },
  },
  bulk: {
    calorieMultiplier: 1.15, // 15% caloric surplus
    macroSplit: { protein: 0.3, carbs: 0.45, fats: 0.25 },
  },
};

/**
 * Internal helper to validate that a value is a strictly valid finite number.
 * Rejects null, undefined, strings, booleans, NaN, and Infinity.
 *
 * @param {unknown} value - The input value to validate.
 * @param {string} fieldName - Human-readable field name for error reporting.
 */
function assertValidNumber(value, fieldName) {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${fieldName} must be a valid finite number.`);
  }
}

/**
 * Calculates Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation.
 *
 * @param {number} weightKg - Body weight in kilograms (30 - 300).
 * @param {number} heightCm - Height in centimeters (100 - 250).
 * @param {number} age - Age in years (14 - 100).
 * @param {string} gender - Biological sex ('male' | 'female').
 * @returns {number} Rounded BMR in kcal/day.
 */
export function calculateBMR(weightKg, heightCm, age, gender) {
  assertValidNumber(weightKg, 'Weight');
  assertValidNumber(heightCm, 'Height');
  assertValidNumber(age, 'Age');

  if (weightKg <= 0) {
    throw new Error('Weight must be greater than zero.');
  }
  if (weightKg < 30 || weightKg > 300) {
    throw new Error('Weight must be within a logical range (30 kg to 300 kg).');
  }

  if (heightCm <= 0) {
    throw new Error('Height must be greater than zero.');
  }
  if (heightCm < 100 || heightCm > 250) {
    throw new Error('Height must be within a logical range (100 cm to 250 cm).');
  }

  if (age <= 0) {
    throw new Error('Age must be greater than zero.');
  }
  if (age < 14 || age > 100) {
    throw new Error('Age must be between 14 and 100 years.');
  }

  if (typeof gender !== 'string' || gender.trim() === '') {
    throw new Error('Gender is required and must be a non-empty string.');
  }

  const normalizedGender = gender.trim().toLowerCase();
  if (normalizedGender !== 'male' && normalizedGender !== 'female') {
    throw new Error('Gender must be either "male" or "female".');
  }

  const baseBMR = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const genderOffset = normalizedGender === 'male' ? 5 : -161;

  return Math.round(baseBMR + genderOffset);
}

/**
 * Calculates daily target calories and macronutrient distribution (in grams)
 * based on BMR, physical activity level, and fitness goal.
 *
 * @param {number} bmr - Basal Metabolic Rate in kcal/day (500 - 10000).
 * @param {string|number} activityLevel - Activity key ('sedentary', 'light', 'moderate', 'active', 'very_active') or numeric multiplier (1.1 - 2.5).
 * @param {string} goal - Fitness objective ('cut' | 'maintain' | 'bulk').
 * @returns {{ tdee: number, calories: number, protein: number, carbs: number, fats: number, goal: string }}
 */
export function calculateMacros(bmr, activityLevel, goal) {
  assertValidNumber(bmr, 'BMR');

  if (bmr <= 0) {
    throw new Error('BMR must be greater than zero.');
  }
  if (bmr < 500 || bmr > 10000) {
    throw new Error('BMR must be within a logical physiological range (500 to 10000 kcal).');
  }

  let multiplier;
  if (typeof activityLevel === 'number' && !Number.isNaN(activityLevel) && Number.isFinite(activityLevel)) {
    if (activityLevel <= 0) {
      throw new Error('Activity multiplier must be greater than zero.');
    }
    if (activityLevel < 1.1 || activityLevel > 2.5) {
      throw new Error('Activity multiplier must be between 1.1 and 2.5.');
    }
    multiplier = activityLevel;
  } else if (typeof activityLevel === 'string' && activityLevel.trim() !== '') {
    const normalizedActivity = activityLevel.trim().toLowerCase();
    multiplier = ACTIVITY_MULTIPLIERS[normalizedActivity];
    if (!multiplier) {
      throw new Error(
        'Invalid activity level. Allowed values: "sedentary", "light", "moderate", "active", "very_active".'
      );
    }
  } else {
    throw new Error('Activity level must be a valid category string or numeric multiplier.');
  }

  if (typeof goal !== 'string' || goal.trim() === '') {
    throw new Error('Goal is required and must be a non-empty string.');
  }

  const normalizedGoal = goal.trim().toLowerCase();
  const goalSettings = GOAL_CONFIG[normalizedGoal];
  if (!goalSettings) {
    throw new Error('Invalid goal. Allowed values: "cut", "maintain", "bulk".');
  }

  const tdee = Math.round(bmr * multiplier);
  const calories = Math.round(tdee * goalSettings.calorieMultiplier);

  // Macronutrient energy density: Protein = 4 kcal/g, Carbs = 4 kcal/g, Fat = 9 kcal/g
  const protein = Math.round((calories * goalSettings.macroSplit.protein) / 4);
  const carbs = Math.round((calories * goalSettings.macroSplit.carbs) / 4);
  const fats = Math.round((calories * goalSettings.macroSplit.fats) / 9);

  return {
    tdee,
    calories,
    protein,
    carbs,
    fats,
    goal: normalizedGoal,
  };
}

/**
 * Estimates One-Rep Max (1RM) using the Epley formula: weight * (1 + reps / 30).
 * Returns the exact lifted weight when reps === 1.
 *
 * @param {number} weightKg - Lifted weight in kilograms (0.5 - 600).
 * @param {number} reps - Completed repetitions (integer between 1 and 30).
 * @returns {number} Estimated 1RM in kilograms (rounded to at most 1 decimal place).
 */
export function calculateOneRepMax(weightKg, reps) {
  assertValidNumber(weightKg, 'Weight');
  assertValidNumber(reps, 'Repetitions');

  if (weightKg <= 0) {
    throw new Error('Weight must be greater than zero.');
  }
  if (weightKg < 0.5 || weightKg > 600) {
    throw new Error('Weight must be within a logical range (0.5 kg to 600 kg).');
  }

  if (reps <= 0) {
    throw new Error('Repetitions must be greater than zero.');
  }
  if (!Number.isInteger(reps)) {
    throw new Error('Repetitions must be a whole integer.');
  }
  if (reps > 30) {
    throw new Error('Repetitions cannot exceed 30 for reliable 1RM estimation.');
  }

  if (reps === 1) {
    return weightKg;
  }

  const estimatedMax = weightKg * (1 + reps / 30);
  return Math.round(estimatedMax * 10) / 10;
}
