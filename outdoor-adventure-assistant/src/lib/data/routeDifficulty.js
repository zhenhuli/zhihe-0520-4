export const difficultyLevels = [
  { id: 'easy', name: '休闲级', icon: '🌿', color: '#22c55e', score: 1, description: '适合新手，路况良好' },
  { id: 'moderate', name: '入门级', icon: '🌱', color: '#84cc16', score: 2, description: '有一定起伏，需要基本体能' },
  { id: 'challenging', name: '进阶级', icon: '⛰️', color: '#eab308', score: 3, description: '地形复杂，需要户外经验' },
  { id: 'difficult', name: '困难级', icon: '🏔️', color: '#f97316', score: 4, description: '技术地形，需要专业装备' },
  { id: 'expert', name: '专家级', icon: '🗻', color: '#ef4444', score: 5, description: '极端环境，需要专业技能' }
];

export const technicalFactors = [
  { id: 'trail_condition', name: '路况', weight: 0.15, options: [
    { value: 1, label: '成熟步道' },
    { value: 2, label: '清晰小路' },
    { value: 3, label: '模糊小径' },
    { value: 4, label: '无路标/野路' },
    { value: 5, label: '完全无迹' }
  ]},
  { id: 'slope', name: '坡度', weight: 0.15, options: [
    { value: 1, label: '<10° 平缓' },
    { value: 2, label: '10-20° 缓坡' },
    { value: 3, label: '20-35° 陡坡' },
    { value: 4, label: '35-50° 急坡' },
    { value: 5, label: '>50° 峭壁' }
  ]},
  { id: 'elevation_gain', name: '累计爬升', weight: 0.15, options: [
    { value: 1, label: '<300米' },
    { value: 2, label: '300-800米' },
    { value: 3, label: '800-1500米' },
    { value: 4, label: '1500-2500米' },
    { value: 5, label: '>2500米' }
  ]},
  { id: 'max_altitude', name: '最高海拔', weight: 0.12, options: [
    { value: 1, label: '<1000米' },
    { value: 2, label: '1000-2000米' },
    { value: 3, label: '2000-3500米' },
    { value: 4, label: '3500-5000米' },
    { value: 5, label: '>5000米' }
  ]},
  { id: 'distance', name: '单程距离', weight: 0.12, options: [
    { value: 1, label: '<5公里' },
    { value: 2, label: '5-12公里' },
    { value: 3, label: '12-20公里' },
    { value: 4, label: '20-30公里' },
    { value: 5, label: '>30公里' }
  ]},
  { id: 'water_crossing', name: '涉水情况', weight: 0.08, options: [
    { value: 1, label: '无' },
    { value: 2, label: '简单踏脚' },
    { value: 3, label: '需脱鞋涉水' },
    { value: 4, label: '深及大腿' },
    { value: 5, label: '需游泳/急流' }
  ]},
  { id: 'exposure', name: '暴露感', weight: 0.08, options: [
    { value: 1, label: '完全无' },
    { value: 2, label: '轻微' },
    { value: 3, label: '部分路段' },
    { value: 4, label: '明显' },
    { value: 5, label: '强烈/恐高慎入' }
  ]},
  { id: 'navigation', name: '导航难度', weight: 0.08, options: [
    { value: 1, label: '路标清晰' },
    { value: 2, label: '偶有路标' },
    { value: 3, label: '需看轨迹' },
    { value: 4, label: '需地图+指南针' },
    { value: 5, label: '需专业导航' }
  ]},
  { id: 'rescue', name: '救援条件', weight: 0.07, options: [
    { value: 1, label: '靠近公路' },
    { value: 2, label: '数小时可达' },
    { value: 3, label: '需大半天' },
    { value: 4, label: '需1-2天' },
    { value: 5, label: '极端困难' }
  ]}
];

export const weatherRiskMultipliers = {
  sunny: { multiplier: 1.0, label: '无叠加', description: '天气良好，风险正常' },
  cloudy: { multiplier: 1.1, label: '轻微叠加', description: '能见度一般，需注意观察' },
  rainy: { multiplier: 1.5, label: '明显叠加', description: '路面湿滑，坡度难度增加' },
  thunderstorm: { multiplier: 2.5, label: '严重叠加', description: '雷暴天气，强烈建议取消' },
  snowy: { multiplier: 2.0, label: '严重叠加', description: '低温+能见度低，难度倍增' },
  foggy: { multiplier: 1.8, label: '显著叠加', description: '能见度极低，易迷路' },
  windy: { multiplier: 1.4, label: '明显叠加', description: '大风增加体能消耗和失温风险' }
};

export function calculateRouteDifficulty(params) {
  let totalScore = 0;
  let maxPossibleScore = 0;
  const breakdown = [];

  for (const factor of technicalFactors) {
    const value = params[factor.id] || 1;
    const weightedScore = value * factor.weight;
    const maxWeightedScore = 5 * factor.weight;
    totalScore += weightedScore;
    maxPossibleScore += maxWeightedScore;
    breakdown.push({
      factorId: factor.id,
      factorName: factor.name,
      value,
      weight: factor.weight,
      weightedScore,
      maxWeightedScore
    });
  }

  const normalizedScore = (totalScore / maxPossibleScore) * 5;
  const finalScore = Math.max(1, Math.min(5, Math.round(normalizedScore)));
  const difficulty = difficultyLevels.find(d => d.score === finalScore) || difficultyLevels[0];

  return {
    score: finalScore,
    normalizedScore: normalizedScore.toFixed(2),
    difficulty,
    breakdown,
    totalWeightedScore: totalScore.toFixed(3)
  };
}

export function calculateWeatherRiskOverlay(baseRiskScore, weatherId, routeDifficulty) {
  const weatherMultiplier = weatherRiskMultipliers[weatherId] || weatherRiskMultipliers.sunny;
  const routeFactor = routeDifficulty ? (routeDifficulty.score / 3) : 1;
  const overlayedScore = baseRiskScore * weatherMultiplier.multiplier * routeFactor;
  const finalScore = Math.min(20, Math.round(overlayedScore));

  let riskLevel;
  if (finalScore <= 3) riskLevel = { level: 'low', label: '低风险', color: '#22c55e' };
  else if (finalScore <= 6) riskLevel = { level: 'medium', label: '中等风险', color: '#eab308' };
  else if (finalScore <= 10) riskLevel = { level: 'high', label: '高风险', color: '#f97316' };
  else riskLevel = { level: 'extreme', label: '极高风险', color: '#ef4444' };

  return {
    baseScore: baseRiskScore,
    weatherMultiplier: weatherMultiplier.multiplier,
    routeFactor: routeFactor.toFixed(2),
    overlayedScore: finalScore,
    weatherInfo: weatherMultiplier,
    riskLevel
  };
}

export function getDifficultyAdvice(score) {
  if (score <= 1) return {
    title: '休闲徒步',
    suitable: '适合所有人群，包括儿童和老人',
    preparation: '穿着舒适运动鞋，携带水和简单零食',
    time: '半天内可完成'
  };
  if (score <= 2) return {
    title: '入门户外',
    suitable: '适合有基本运动能力的新手',
    preparation: '穿着徒步鞋，携带基础装备和1-2升水',
    time: '一天内可完成'
  };
  if (score <= 3) return {
    title: '进阶徒步',
    suitable: '适合有一定户外经验者，需良好体能',
    preparation: '携带完整登山装备，建议有经验者陪同',
    time: '一天或需要过夜'
  };
  if (score <= 4) return {
    title: '困难路线',
    suitable: '仅适合经验丰富的户外爱好者',
    preparation: '需专业技术装备，提前做好详细计划',
    time: '通常需要多日'
  };
  return {
    title: '专业探险',
    suitable: '仅适合专业登山者/探险家',
    preparation: '需全套专业装备，团队协作，充分预案',
    time: '多日探险行程'
  };
}
