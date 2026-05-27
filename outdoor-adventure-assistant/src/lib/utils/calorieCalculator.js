export function calculateCalories({ distance, elevation, weight, packWeight, speed, temperature }) {
  const bodyWeight = weight;
  const totalWeight = bodyWeight + packWeight;

  const flatWalkingCaloriesPerKm = 0.75 * totalWeight;
  const flatCalories = distance * flatWalkingCaloriesPerKm;

  const elevationCalories = elevation * 1.5 * (totalWeight / 60);

  const speedFactor = speed <= 3 ? 0.9 : speed <= 5 ? 1.0 : speed <= 7 ? 1.2 : 1.4;

  const tempFactor = temperature < 0 ? 1.15 : temperature < 10 ? 1.1 : temperature < 25 ? 1.0 : temperature < 35 ? 1.05 : 1.12;

  const terrainFactor = 1.0;

  const totalCalories = (flatCalories + elevationCalories) * speedFactor * tempFactor * terrainFactor;

  const durationHours = distance / speed;
  const durationMinutes = durationHours * 60;

  return {
    totalCalories: Math.round(totalCalories),
    flatCalories: Math.round(flatCalories),
    elevationCalories: Math.round(elevationCalories),
    durationHours: durationHours.toFixed(1),
    durationMinutes: Math.round(durationMinutes),
    speedFactor: speedFactor.toFixed(2),
    tempFactor: tempFactor.toFixed(2),
    caloriesPerHour: Math.round(totalCalories / durationHours)
  };
}

export function calculateFitnessIndex({ restingHeartRate, vo2max, weeklyExerciseHours, activityFrequency }) {
  let score = 0;

  if (restingHeartRate < 50) score += 20;
  else if (restingHeartRate < 60) score += 15;
  else if (restingHeartRate < 70) score += 10;
  else if (restingHeartRate < 80) score += 5;
  else score += 0;

  if (vo2max >= 60) score += 25;
  else if (vo2max >= 50) score += 20;
  else if (vo2max >= 40) score += 15;
  else if (vo2max >= 30) score += 10;
  else score += 5;

  if (weeklyExerciseHours >= 10) score += 25;
  else if (weeklyExerciseHours >= 7) score += 20;
  else if (weeklyExerciseHours >= 4) score += 15;
  else if (weeklyExerciseHours >= 2) score += 10;
  else score += 5;

  if (activityFrequency >= 5) score += 30;
  else if (activityFrequency >= 3) score += 25;
  else if (activityFrequency >= 2) score += 20;
  else if (activityFrequency >= 1) score += 15;
  else score += 10;

  return score;
}

export function getFitnessLevel(score) {
  if (score >= 85) return { level: 'excellent', label: '极佳', color: '#22c55e', recommendation: '可胜任高难度户外挑战' };
  if (score >= 70) return { level: 'good', label: '良好', color: '#84cc16', recommendation: '可应对大部分户外活动' };
  if (score >= 55) return { level: 'fair', label: '一般', color: '#eab308', recommendation: '建议循序渐进，选择中等难度活动' };
  if (score >= 40) return { level: 'poor', label: '较差', color: '#f97316', recommendation: '建议从低强度活动开始，加强日常锻炼' };
  return { level: 'weak', label: '薄弱', color: '#ef4444', recommendation: '建议先提升基础体能，从短途低海拔开始' };
}

export function estimateMaxSafeDuration({ fitnessIndex, distance, elevation, packWeight }) {
  const baseDuration = 8;
  const fitnessMultiplier = fitnessIndex / 60;
  const elevationPenalty = elevation > 1000 ? 0.85 : elevation > 500 ? 0.92 : 1.0;
  const weightPenalty = packWeight > 20 ? 0.85 : packWeight > 15 ? 0.92 : packWeight > 10 ? 0.96 : 1.0;

  return (baseDuration * fitnessMultiplier * elevationPenalty * weightPenalty).toFixed(1);
}