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
