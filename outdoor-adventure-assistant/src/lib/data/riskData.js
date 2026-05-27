export const weatherConditions = [
  { id: 'sunny', name: '晴朗', icon: '☀️', riskLevel: 0, description: '天气良好' },
  { id: 'cloudy', name: '多云', icon: '⛅', riskLevel: 1, description: '能见度一般' },
  { id: 'rainy', name: '降雨', icon: '🌧️', riskLevel: 3, description: '路面湿滑' },
  { id: 'thunderstorm', name: '雷暴', icon: '⛈️', riskLevel: 5, description: '避免户外' },
  { id: 'snowy', name: '降雪', icon: '🌨️', riskLevel: 4, description: '低温+能见度低' },
  { id: 'foggy', name: '大雾', icon: '🌫️', riskLevel: 3, description: '能见度极低' },
  { id: 'windy', name: '大风', icon: '💨', riskLevel: 3, description: '注意防风' }
];

export const terrainTypes = [
  { id: 'trail', name: '成熟步道', icon: '🛤️', riskLevel: 0 },
  { id: 'forest', name: '丛林小路', icon: '🌲', riskLevel: 2 },
  { id: 'rocky', name: '岩石地形', icon: '🪨', riskLevel: 3 },
  { id: 'steep', name: '陡坡', icon: '📐', riskLevel: 4 },
  { id: 'glacier', name: '冰川', icon: '🧊', riskLevel: 5 },
  { id: 'water', name: '涉水路段', icon: '🌊', riskLevel: 3 }
];

export const experienceLevels = [
  { id: 'beginner', name: '新手', icon: '🌱', riskModifier: 2, description: '首次或少量户外经验' },
  { id: 'intermediate', name: '中级', icon: '🌿', riskModifier: 0, description: '有一定户外经验' },
  { id: 'advanced', name: '高级', icon: '🌳', riskModifier: -1, description: '丰富户外经验' },
  { id: 'expert', name: '专家', icon: '🏆', riskModifier: -2, description: '专业户外人士' }
];

export const groupSizes = [
  { id: 'solo', name: '独自出行', icon: '🚶', riskModifier: 2 },
  { id: 'small', name: '2-3人', icon: '👥', riskModifier: 0 },
  { id: 'medium', name: '4-6人', icon: '👨‍👩‍👧‍👦', riskModifier: -1 },
  { id: 'large', name: '7人以上', icon: '🏃‍♂️🏃‍♀️', riskModifier: 1 }
];

export const physicalConditions = [
  { id: 'excellent', name: '极佳', icon: '💪', riskModifier: -1 },
  { id: 'good', name: '良好', icon: '👍', riskModifier: 0 },
  { id: 'fair', name: '一般', icon: '😐', riskModifier: 1 },
  { id: 'poor', name: '较差', icon: '😓', riskModifier: 3 }
];

export function getRiskLevel(score) {
  if (score <= 2) return { level: 'low', label: '低风险', color: '#22c55e', advice: '可以按计划出行，做好常规准备即可' };
  if (score <= 5) return { level: 'medium', label: '中等风险', color: '#eab308', advice: '需谨慎对待，建议做好充分准备和应急预案' };
  if (score <= 8) return { level: 'high', label: '高风险', color: '#f97316', advice: '建议有经验者陪同，严格评估自身能力，做好充分应急预案' };
  return { level: 'extreme', label: '极高风险', color: '#ef4444', advice: '强烈建议重新评估出行计划，或由专业团队带领' };
}

export function calculateRiskScore(params) {
  const weather = weatherConditions.find(w => w.id === params.weather);
  const terrain = terrainTypes.find(t => t.id === params.terrain);
  const experience = experienceLevels.find(e => e.id === params.experience);
  const group = groupSizes.find(g => g.id === params.groupSize);
  const physical = physicalConditions.find(p => p.id === params.physical);

  let score = 0;

  if (weather) score += weather.riskLevel;
  if (terrain) score += terrain.riskLevel;
  if (experience) score += experience.riskModifier;
  if (group) score += group.riskModifier;
  if (physical) score += physical.riskModifier;

  if (params.altitude > 3000) score += 3;
  else if (params.altitude > 2000) score += 2;
  else if (params.altitude > 1000) score += 1;

  if (params.duration > 12) score += 3;
  else if (params.duration > 8) score += 2;
  else if (params.duration > 4) score += 1;

  if (params.temperature < -10) score += 2;
  else if (params.temperature < 0) score += 1;
  else if (params.temperature > 35) score += 2;
  else if (params.temperature > 30) score += 1;

  if (params.hasEmergencyPlan) score -= 1;
  if (params.hasFirstAid) score -= 1;
  if (params.hasNavigation) score -= 1;
  if (params.hasCommunication) score -= 1;

  return Math.max(0, score);
}