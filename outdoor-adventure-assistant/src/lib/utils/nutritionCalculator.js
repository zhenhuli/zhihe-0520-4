export const intensityLevels = [
  { id: 'light', name: '轻度', multiplier: 1.0, description: '平路徒步，速度缓慢' },
  { id: 'moderate', name: '中等', multiplier: 1.3, description: '常规徒步，有少量起伏' },
  { id: 'heavy', name: '高强度', multiplier: 1.6, description: '持续爬升，负重较大' },
  { id: 'extreme', name: '极限', multiplier: 2.0, description: '技术攀登，极端环境' }
];

export const foodCategories = [
  {
    id: 'carbohydrate',
    name: '碳水化合物',
    ratio: 0.55,
    caloriesPerGram: 4,
    icon: '🍚',
    examples: '能量棒、麦片、面包、米饭、面条'
  },
  {
    id: 'protein',
    name: '蛋白质',
    ratio: 0.20,
    caloriesPerGram: 4,
    icon: '🥩',
    examples: '肉干、能量胶、奶酪、豆类'
  },
  {
    id: 'fat',
    name: '脂肪',
    ratio: 0.25,
    caloriesPerGram: 9,
    icon: '🥜',
    examples: '坚果、巧克力、黄油、食用油'
  }
];

export function calculateWaterIntake({ duration, temperature, elevation, intensity, weight, packWeight }) {
  const baseWaterPerHour = 0.5;

  const tempFactor = temperature < 10 ? 0.8 : temperature < 20 ? 1.0 : temperature < 30 ? 1.2 : temperature < 35 ? 1.5 : 1.8;
  const elevationFactor = elevation < 1000 ? 1.0 : elevation < 2000 ? 1.1 : elevation < 3000 ? 1.2 : elevation < 4000 ? 1.4 : 1.6;
  const intensityFactor = intensity === 'light' ? 1.0 : intensity === 'moderate' ? 1.2 : intensity === 'heavy' ? 1.5 : 1.8;
  const weightFactor = ((weight + packWeight) / 70);

  const waterPerHour = baseWaterPerHour * tempFactor * elevationFactor * intensityFactor * weightFactor;
  const totalWater = waterPerHour * duration;

  const hourlyBreakdown = [];
  for (let i = 1; i <= Math.ceil(duration); i++) {
    const hourWater = i <= duration ? waterPerHour : waterPerHour * (duration - (i - 1));
    hourlyBreakdown.push({
      hour: i,
      water: Math.round(hourWater * 1000),
      cumulative: Math.round(Math.min(i * waterPerHour, totalWater) * 1000)
    });
  }

  return {
    totalLiters: totalWater.toFixed(1),
    waterPerHour: waterPerHour.toFixed(2),
    tempFactor: tempFactor.toFixed(2),
    elevationFactor: elevationFactor.toFixed(2),
    intensityFactor: intensityFactor.toFixed(2),
    hourlyBreakdown,
    electrolytesRecommendation: temperature > 25 || intensity !== 'light' ? Math.round(totalWater * 0.5) : 0
  };
}

export function calculateFoodIntake({ duration, caloriesPerHour, intensity }) {
  const intensityData = intensityLevels.find(i => i.id === intensity) || intensityLevels[0];
  const adjustedCaloriesPerHour = caloriesPerHour * intensityData.multiplier;
  const totalCalories = adjustedCaloriesPerHour * duration;

  const breakdown = foodCategories.map(cat => {
    const categoryCalories = totalCalories * cat.ratio;
    const grams = categoryCalories / cat.caloriesPerGram;
    return {
      ...cat,
      calories: Math.round(categoryCalories),
      grams: Math.round(grams),
      percentage: Math.round(cat.ratio * 100)
    };
  });

  const totalGrams = breakdown.reduce((sum, item) => sum + item.grams, 0);

  const mealPlan = generateMealPlan(duration, totalCalories, intensity);

  return {
    totalCalories: Math.round(totalCalories),
    adjustedCaloriesPerHour: Math.round(adjustedCaloriesPerHour),
    totalGrams: Math.round(totalGrams),
    intensityMultiplier: intensityData.multiplier,
    breakdown,
    mealPlan
  };
}

function generateMealPlan(duration, totalCalories, intensity) {
  const meals = [];
  const isMultiDay = duration > 8;
  const isOvernight = duration > 12;

  if (duration <= 4) {
    meals.push({
      type: 'snacks',
      name: '路餐零食',
      calories: Math.round(totalCalories),
      items: ['能量棒 × 2-3', '坚果混合 50g', '水果干 30g', '巧克力 1-2块']
    });
  } else if (duration <= 8) {
    meals.push(
      {
        type: 'breakfast',
        name: '早餐(出发前)',
        calories: Math.round(totalCalories * 0.25),
        items: ['燕麦片/面包', '鸡蛋/牛奶', '香蕉']
      },
      {
        type: 'lunch',
        name: '午餐(路餐)',
        calories: Math.round(totalCalories * 0.35),
        items: ['三明治/饭团', '能量棒 × 2', '坚果 50g']
      },
      {
        type: 'snacks',
        name: '途中补给',
        calories: Math.round(totalCalories * 0.40),
        items: ['能量胶 × 3-4', '水果干', '巧克力', '电解质饮料']
      }
    );
  } else {
    const days = Math.ceil(duration / 24);
    for (let day = 1; day <= days; day++) {
      const dayMultiplier = days > 1 ? (1 / days) : 1;
      meals.push(
        {
          type: 'breakfast',
          name: `第${day}天 早餐`,
          calories: Math.round(totalCalories * 0.20 * dayMultiplier),
          items: ['燕麦片 50g', '奶粉 30g', '坚果 20g', '能量棒 1根']
        },
        {
          type: 'lunch',
          name: `第${day}天 午餐`,
          calories: Math.round(totalCalories * 0.30 * dayMultiplier),
          items: ['冻干餐 1份', '能量棒 × 2', '坚果 30g']
        },
        {
          type: 'dinner',
          name: `第${day}天 晚餐`,
          calories: Math.round(totalCalories * 0.35 * dayMultiplier),
          items: ['冻干主餐 1份', '奶酪 30g', '饼干', '热饮']
        },
        {
          type: 'snacks',
          name: `第${day}天 零食补给`,
          calories: Math.round(totalCalories * 0.15 * dayMultiplier),
          items: ['能量胶 × 2', '巧克力', '水果干', '糖块']
        }
      );
    }
  }

  return meals;
}

export function calculateElectrolyteIntake({ duration, temperature, intensity }) {
  const baseElectrolytesPerHour = 500;

  const tempFactor = temperature < 20 ? 0.7 : temperature < 30 ? 1.0 : temperature < 35 ? 1.5 : 2.0;
  const intensityFactor = intensity === 'light' ? 0.8 : intensity === 'moderate' ? 1.0 : intensity === 'heavy' ? 1.4 : 1.8;

  const electrolytesPerHour = baseElectrolytesPerHour * tempFactor * intensityFactor;
  const totalElectrolytes = electrolytesPerHour * duration;

  return {
    totalMg: Math.round(totalElectrolytes),
    mgPerHour: Math.round(electrolytesPerHour),
    tempFactor: tempFactor.toFixed(2),
    intensityFactor: intensityFactor.toFixed(2),
    supplementAdvice: totalElectrolytes > 2000 ? '建议携带电解质泡腾片或运动饮料' :
                       totalElectrolytes > 1000 ? '可携带少量电解质补充剂' :
                       '正常饮食即可满足需求'
  };
}

export function getHydrationTips({ temperature, elevation, duration }) {
  const tips = [];

  if (temperature > 30) {
    tips.push('高温环境下每15-20分钟补充一次水分，不要等到口渴再喝');
    tips.push('考虑携带电解质饮料，避免单纯饮用大量纯水');
  }

  if (elevation > 2500) {
    tips.push('高海拔地区呼吸失水增加，需增加饮水量约30-50%');
    tips.push('避免饮酒和含咖啡因饮料，会加速脱水');
  }

  if (duration > 8) {
    tips.push('长时间活动建议每小时定时饮水，每次150-200ml');
    tips.push('留意尿液颜色，浅黄色为正常，深黄色表示需补水');
  }

  if (temperature < 0) {
    tips.push('寒冷环境仍需补水，建议携带保温壶喝热水');
    tips.push('不要用雪直接解渴，会消耗体核心温度');
  }

  tips.push('出发前1-2小时预喝500ml水，活动前再次补充200-300ml');
  tips.push('返程后继续补充水分，补充活动中丢失的体液');

  return tips;
}

export function getNutritionTips({ intensity, duration }) {
  const tips = [];

  if (intensity === 'heavy' || intensity === 'extreme') {
    tips.push('高强度活动前2-3小时进食高碳水餐，避免饱腹运动');
    tips.push('运动中每45-60分钟补充30-60g碳水化合物');
  }

  if (duration > 12) {
    tips.push('多日行程注意饮食多样性，避免食欲下降');
    tips.push('晚餐适当增加脂肪摄入，帮助夜间保暖');
    tips.push('每天早餐必须吃，提供上午活动所需能量');
  }

  tips.push('携带比预估多25%的食物作为应急储备');
  tips.push('选择轻便、高能量密度的食物，减轻负重');
  tips.push('注意补充盐分，特别是大量出汗后');
  tips.push('避免尝试新食物，可能引起肠胃不适');

  return tips;
}
