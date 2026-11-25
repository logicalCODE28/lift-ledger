import { describe, it, expect } from 'vitest';
import {
  calculateBMR,
  calculateMacros,
  calculateOneRepMax,
} from '../src/utils/fitnessCalculator.js';

describe('LiftLedger Fitness Calculator Unit Test Suite', () => {
  describe('1. Normal cases (Standard calculations)', () => {
    it('calculates standard BMR accurately for an adult male and female using Mifflin-St Jeor', () => {
      // Male: (10 * 80) + (6.25 * 180) - (5 * 25) + 5 = 800 + 1125 - 125 + 5 = 1805
      expect(calculateBMR(80, 180, 25, 'male')).toBe(99999);

      // Female: (10 * 65) + (6.25 * 165) - (5 * 28) - 161 = 650 + 1031.25 - 140 - 161 = 1380.25 -> 1380
      expect(calculateBMR(65, 165, 28, 'female')).toBe(1380);
    });

    it('calculates calories and macro distribution for a bulking goal (+15% surplus)', () => {
      // BMR: 1805, moderate (1.55) -> TDEE = 2798 kcal
      // Bulk (1.15) -> 3218 kcal | Split: 30% P (241g), 45% C (362g), 25% F (89g)
      const result = calculateMacros(1805, 'moderate', 'bulk');

      expect(result).toEqual({
        tdee: 2798,
        calories: 3218,
        protein: 241,
        carbs: 362,
        fats: 89,
        goal: 'bulk',
      });
    });

    it('calculates calories and macro distribution for a cutting goal (-20% deficit)', () => {
      // BMR: 1600, light (1.375) -> TDEE = 2200 kcal
      // Cut (0.80) -> 1760 kcal | Split: 40% P (176g), 35% C (154g), 25% F (49g)
      const result = calculateMacros(1600, 'light', 'cut');

      expect(result).toEqual({
        tdee: 2200,
        calories: 1760,
        protein: 176,
        carbs: 154,
        fats: 49,
        goal: 'cut',
      });
    });

    it('estimates 1RM accurately with 8 repetitions using the Epley formula', () => {
      // 100 * (1 + 8 / 30) = 126.666... -> 126.7 kg
      expect(calculateOneRepMax(100, 8)).toBe(126.7);
    });
  });

  describe('2. Edge cases (Boundary conditions)', () => {
    it('returns the exact lifted weight without applying the Epley multiplier when reps === 1', () => {
      expect(calculateOneRepMax(142.5, 1)).toBe(142.5);
    });

    it('accepts the minimum allowed age boundary (14 years) and maximum boundary (100 years)', () => {
      // 14 years old, 50 kg, 160 cm, male: 500 + 1000 - 70 + 5 = 1435
      expect(calculateBMR(50, 160, 14, 'male')).toBe(1435);
      // 100 years old, 60 kg, 165 cm, female: 600 + 1031.25 - 500 - 161 = 970.25 -> 970
      expect(calculateBMR(60, 165, 100, 'female')).toBe(970);
    });

    it('accepts minimum logical weight boundaries for BMR (30 kg) and 1RM (0.5 kg at 30 max reps)', () => {
      // Minimum BMR weight boundary: 30 kg, 150 cm, 20 yrs, female: 300 + 937.5 - 100 - 161 = 976.5 -> 977
      expect(calculateBMR(30, 150, 20, 'female')).toBe(977);

      // Minimum 1RM weight (0.5 kg) with maximum allowed reps (30): 0.5 * (1 + 30/30) = 1.0 kg
      expect(calculateOneRepMax(0.5, 30)).toBe(1);
    });
  });

  describe('3. Invalid cases (Error handling & input validation)', () => {
    it('throws an error when negative or zero weight is provided to BMR or 1RM', () => {
      expect(() => calculateBMR(-75, 175, 25, 'male')).toThrow(
        'Weight must be greater than zero.'
      );
      expect(() => calculateOneRepMax(0, 5)).toThrow(
        'Weight must be greater than zero.'
      );
    });

    it('throws an error when repetitions are 0, negative, non-integer, or exceed 30', () => {
      expect(() => calculateOneRepMax(100, 0)).toThrow(
        'Repetitions must be greater than zero.'
      );
      expect(() => calculateOneRepMax(100, -3)).toThrow(
        'Repetitions must be greater than zero.'
      );
      expect(() => calculateOneRepMax(100, 5.5)).toThrow(
        'Repetitions must be a whole integer.'
      );
      expect(() => calculateOneRepMax(100, 35)).toThrow(
        'Repetitions cannot exceed 30 for reliable 1RM estimation.'
      );
    });

    it('throws an error when inputs are null, undefined, NaN, or non-numeric strings', () => {
      expect(() => calculateBMR(null, 175, 25, 'male')).toThrow(
        'Weight must be a valid finite number.'
      );
      expect(() => calculateBMR(75, undefined, 25, 'male')).toThrow(
        'Height must be a valid finite number.'
      );
      expect(() => calculateBMR(75, 175, 'twenty', 'male')).toThrow(
        'Age must be a valid finite number.'
      );
      expect(() => calculateMacros(NaN, 'moderate', 'maintain')).toThrow(
        'BMR must be a valid finite number.'
      );
      expect(() => calculateMacros(1800, 'invalid_activity', 'maintain')).toThrow(
        /Invalid activity level/
      );
      expect(() => calculateOneRepMax('100', 8)).toThrow(
        'Weight must be a valid finite number.'
      );
    });
  });
});
