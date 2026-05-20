export const foodDatabase = [
  { id: 'chocolate', name: '黑巧克力', calories: 589, weight: 100, type: 'energy', portable: true, digestTime: '快速' },
  { id: 'energy_bar', name: '能量棒', calories: 450, weight: 100, type: 'energy', portable: true, digestTime: '快速' },
  { id: 'nuts', name: '混合坚果', calories: 607, weight: 100, type: 'energy', portable: true, digestTime: '中速' },
  { id: 'dried_fruit', name: '葡萄干', calories: 299, weight: 100, type: 'carb', portable: true, digestTime: '快速' },
  { id: 'sandwich', name: '三明治', calories: 250, weight: 100, type: 'meal', portable: true, digestTime: '中速' },
  { id: 'instant_noodles', name: '方便面', calories: 450, weight: 100, type: 'meal', portable: false, digestTime: '中速' },
  { id: 'canned_tuna', name: '金枪鱼罐头', calories: 130, weight: 100, type: 'protein', portable: true, digestTime: '慢速' },
  { id: 'beef_jerky', name: '牛肉干', calories: 410, weight: 100, type: 'protein', portable: true, digestTime: '慢速' },
  { id: 'protein_bar', name: '蛋白棒', calories: 400, weight: 100, type: 'protein', portable: true, digestTime: '中速' },
  { id: 'sports_drink', name: '运动饮料', calories: 40, weight: 100, type: 'hydration', portable: true, digestTime: '快速' },
  { id: 'banana', name: '香蕉', calories: 89, weight: 100, type: 'carb', portable: true, digestTime: '快速' },
  { id: 'oatmeal', name: '燕麦片', calories: 389, weight: 100, type: 'meal', portable: true, digestTime: '慢速' },
  { id: 'rice_cake', name: '米饼', calories: 380, weight: 100, type: 'carb', portable: true, digestTime: '快速' },
  { id: 'peanut_butter', name: '花生酱', calories: 594, weight: 100, type: 'energy', portable: true, digestTime: '慢速' }
];

export function getFoodRecommendations(totalCalories, durationHours, temperature) {
  const isCold = temperature < 10;
  const isLongDistance = durationHours > 4;
  
  const targetCalories = totalCalories * (isLongDistance ? 0.8 : 0.6);
  const meals = [];
  
  const breakfast = {
    name: '早餐补给',
    time: '出发前30分钟',
    items: [
      { ...foodDatabase.find(f => f.id === 'oatmeal'), amount: 80 },
      { ...foodDatabase.find(f => f.id === 'banana'), amount: 100 }
    ],
    totalCalories: Math.round(389 * 0.8 + 89)
  };
  
  const mainMeals = [];
  if (isLongDistance) {
    mainMeals.push({
      name: '午餐',
      time: '行进中后段',
      items: [
        { ...foodDatabase.find(f => f.id === 'sandwich'), amount: 200 },
        { ...foodDatabase.find(f => f.id === 'nuts'), amount: 30 }
      ],
      totalCalories: Math.round(250 * 2 + 607 * 0.3)
    });
  }
  
  const snacks = [];
  const snackCount = Math.ceil(durationHours / 1.5);
  for (let i = 0; i < snackCount; i++) {
    const snackItems = [];
    if (i % 2 === 0) {
      snackItems.push({ ...foodDatabase.find(f => f.id === 'energy_bar'), amount: 50 });
    } else {
      snackItems.push({ ...foodDatabase.find(f => f.id === 'dried_fruit'), amount: 40 });
    }
    
    if (isCold && i % 3 === 0) {
      snackItems.push({ ...foodDatabase.find(f => f.id === 'chocolate'), amount: 30 });
    }
    
    snacks.push({
      name: `补给点 ${i + 1}`,
      time: `${((i + 1) * 1.5).toFixed(1)} 小时后`,
      items: snackItems,
      totalCalories: Math.round(snackItems.reduce((sum, item) => sum + item.calories * item.amount / 100, 0))
    });
  }
  
  meals.push(breakfast, ...mainMeals);
  
  const totalFoodCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0) + 
                           snacks.reduce((sum, snack) => sum + snack.totalCalories, 0);
  
  const hydration = [];
  const waterIntake = Math.ceil(durationHours * (isCold ? 0.4 : 0.6));
  hydration.push({
    name: '饮用水',
    amount: `${waterIntake}L`,
    note: isCold ? '低温环境适当减少，但建议携带保温壶' : '高温环境注意补充电解质'
  });
  
  if (durationHours > 3) {
    hydration.push({
      name: '运动饮料',
      amount: `${Math.ceil(durationHours * 0.3)}L`,
      note: '补充电解质和碳水化合物'
    });
  }
  
  return {
    meals,
    snacks,
    hydration,
    totalFoodCalories,
    targetCalories: Math.round(targetCalories),
    recommendation: getRecommendationNote(durationHours, temperature)
  };
}

function getRecommendationNote(duration, temperature) {
  if (temperature < 0) {
    return '极寒环境：建议增加高热量食物，携带保温装备，每小时补充一次能量';
  } else if (temperature < 10) {
    return '寒冷环境：适当增加脂肪摄入，热食有助于保持体温';
  } else if (temperature > 30) {
    return '高温环境：优先补充水分和电解质，避免过于油腻的食物';
  } else if (duration > 6) {
    return '长距离徒步：合理分配补给，保持血糖稳定，不要等到饥饿才进食';
  }
  return '适中条件：按计划补给，保持良好节奏';
}
