export const weightCategories = [
  {
    id: 'backpack',
    name: '背包系统',
    icon: '🎒',
    priority: 'essential'
  },
  {
    id: 'shelter',
    name: '庇护系统',
    icon: '⛺',
    priority: 'essential'
  },
  {
    id: 'sleeping',
    name: '睡眠系统',
    icon: '😴',
    priority: 'essential'
  },
  {
    id: 'clothing',
    name: '衣物系统',
    icon: '🧥',
    priority: 'essential'
  },
  {
    id: 'cooking',
    name: '炊具系统',
    icon: '🍳',
    priority: 'important'
  },
  {
    id: 'hydration',
    name: '饮水系统',
    icon: '💧',
    priority: 'essential'
  },
  {
    id: 'food',
    name: '食物补给',
    icon: '🍫',
    priority: 'essential'
  },
  {
    id: 'firstaid',
    name: '急救医疗',
    icon: '⛑️',
    priority: 'essential'
  },
  {
    id: 'navigation',
    name: '导航通讯',
    icon: '🧭',
    priority: 'essential'
  },
  {
    id: 'tools',
    name: '工具装备',
    icon: '🔧',
    priority: 'important'
  },
  {
    id: 'hygiene',
    name: '卫生用品',
    icon: '🧴',
    priority: 'optional'
  },
  {
    id: 'misc',
    name: '其他物品',
    icon: '📦',
    priority: 'optional'
  }
];

export function getWeightAdvice(baseWeight, totalWeight, bodyWeight) {
  const baseWeightKg = baseWeight / 1000;
  const totalWeightKg = totalWeight / 1000;
  const weightRatio = (totalWeightKg / bodyWeight) * 100;

  let baseWeightRating;
  if (baseWeightKg < 10) baseWeightRating = { level: 'excellent', label: '超轻', color: '#22c55e', advice: '基础重量控制极佳，轻量化达人' };
  else if (baseWeightKg < 15) baseWeightRating = { level: 'good', label: '优秀', color: '#84cc16', advice: '基础重量控制良好' };
  else if (baseWeightKg < 20) baseWeightRating = { level: 'moderate', label: '一般', color: '#eab308', advice: '可以考虑进一步轻量化' };
  else baseWeightRating = { level: 'heavy', label: '偏重', color: '#f97316', advice: '基础重量偏重，建议精简装备' };

  let totalWeightRating;
  if (weightRatio < 15) totalWeightRating = { level: 'excellent', label: '极轻', color: '#22c55e', advice: '负重比例极佳，行进会很轻松' };
  else if (weightRatio < 20) totalWeightRating = { level: 'good', label: '合理', color: '#84cc16', advice: '负重比例合理，适合长时间活动' };
  else if (weightRatio < 25) totalWeightRating = { level: 'moderate', label: '适中', color: '#eab308', advice: '负重比例适中，注意体能分配' };
  else if (weightRatio < 30) totalWeightRating = { level: 'heavy', label: '偏重', color: '#f97316', advice: '负重偏重，建议精简或增强体能' };
  else totalWeightRating = { level: 'excessive', label: '过重', color: '#ef4444', advice: '负重量过大，强烈建议精简，避免受伤' };

  return {
    baseWeightKg: baseWeightKg.toFixed(1),
    totalWeightKg: totalWeightKg.toFixed(1),
    weightRatio: weightRatio.toFixed(1),
    baseWeightRating,
    totalWeightRating
  };
}

export function getCategoryWeightBreakdown(equipment) {
  const categoryWeights = {};
  let totalEssential = 0;
  let totalOptional = 0;
  let totalImportant = 0;

  for (const category of weightCategories) {
    categoryWeights[category.id] = {
      ...category,
      weight: 0,
      items: []
    };
  }

  if (equipment) {
    for (const [catName, items] of Object.entries(equipment)) {
      for (const item of items) {
        const mappedCat = mapCategory(catName, item.category);
        if (categoryWeights[mappedCat]) {
          const itemWeight = item.totalWeight || item.weight || 0;
          categoryWeights[mappedCat].weight += itemWeight;
          categoryWeights[mappedCat].items.push(item);

          if (item.essential || categoryWeights[mappedCat].priority === 'essential') {
            totalEssential += itemWeight;
          } else if (categoryWeights[mappedCat].priority === 'important') {
            totalImportant += itemWeight;
          } else {
            totalOptional += itemWeight;
          }
        }
      }
    }
  }

  const breakdown = Object.values(categoryWeights)
    .filter(cat => cat.weight > 0 || cat.items.length > 0)
    .sort((a, b) => b.weight - a.weight);

  const totalWeight = breakdown.reduce((sum, cat) => sum + cat.weight, 0);

  for (const cat of breakdown) {
    cat.percentage = totalWeight > 0 ? ((cat.weight / totalWeight) * 100).toFixed(1) : 0;
  }

  return {
    categories: breakdown,
    totalWeight,
    totalEssential,
    totalImportant,
    totalOptional
  };
}

function mapCategory(catName, subCategory) {
  const mapping = {
    backpack: 'backpack',
    camping: 'shelter',
    sleeping: 'sleeping',
    clothing: 'clothing',
    footwear: 'clothing',
    food: 'food',
    hydration: 'hydration',
    firstAid: 'firstaid',
    navigation: 'navigation',
    communication: 'navigation',
    lighting: 'navigation',
    tools: 'tools',
    hygiene: 'hygiene',
    documents: 'misc'
  };
  return mapping[catName] || 'misc';
}

export function getLighteningTips(breakdown, bodyWeight) {
  const tips = [];
  const totalWeight = breakdown.totalWeight / 1000;
  const weightRatio = (totalWeight / bodyWeight) * 100;

  if (weightRatio > 25) {
    tips.push({
      priority: 'high',
      title: '总体减重建议',
      items: [
        '当前负重比例较高，优先考虑减重',
        '检查是否有重复或可用一物多用的物品',
        '考虑租用或共享部分装备（如帐篷、炉具）'
      ]
    });
  }

  const sortedCats = [...breakdown.categories].sort((a, b) => b.weight - a.weight);
  for (const cat of sortedCats.slice(0, 3)) {
    const catWeightKg = cat.weight / 1000;
    if (catWeightKg > 2) {
      const catTips = getCategoryLighteningTips(cat.id);
      if (catTips.items.length > 0) {
        tips.push(catTips);
      }
    }
  }

  const optionalWeight = breakdown.totalOptional / 1000;
  if (optionalWeight > 3) {
    tips.push({
      priority: 'medium',
      title: '可选物品精简',
      items: [
        `可选物品重 ${optionalWeight.toFixed(1)}kg，可考虑精简`,
        '询问自己：这件东西真的需要吗？',
        '考虑小容量包装或多用途物品替代'
      ]
    });
  }

  tips.push({
    priority: 'low',
    title: '通用轻量化技巧',
    items: [
      '选择轻量化装备时，权衡重量与安全性',
      '去除物品包装，改用小分装盒/袋',
      '衣服采用多层穿搭法，而非厚重单衣',
      '食物选择高能量密度、轻量化的选项'
    ]
  });

  return tips;
}

function getCategoryLighteningTips(categoryId) {
  const tips = {
    backpack: {
      priority: 'medium',
      title: '🎒 背包减重',
      items: [
        '考虑使用轻量化背包（自重<1.5kg）',
        '移除不必要的背包附件和隔层',
        '使用防水袋代替厚重的背包防雨罩'
      ]
    },
    shelter: {
      priority: 'high',
      title: '⛺ 庇护系统减重',
      items: [
        '考虑超轻帐篷或天幕+登山杖组合',
        '单人出行选择1人帐，或与他人共享',
        '检查是否可以不用地布'
      ]
    },
    sleeping: {
      priority: 'high',
      title: '😴 睡眠系统减重',
      items: [
        '选择高蓬松度羽绒睡袋（充绒量根据温度选择）',
        '考虑使用轻量化睡垫（R值匹配需求）',
        '用便携枕头代替充气枕头，或用衣物填充'
      ]
    },
    clothing: {
      priority: 'medium',
      title: '🧥 衣物减重',
      items: [
        '采用三层穿衣法，灵活组合',
        '选择速干面料，避免棉质衣物',
        '多带袜子和内衣，外套可以少带'
      ]
    },
    cooking: {
      priority: 'medium',
      title: '🍳 炊具减重',
      items: [
        '考虑一体式炉具，重量更轻',
        '使用钛锅或铝锅，避免不锈钢',
        '食物选择无需烹煮的冻干餐'
      ]
    },
    hydration: {
      priority: 'low',
      title: '💧 饮水系统减重',
      items: [
        '使用轻量水瓶代替重水壶',
        '根据路线水源情况决定携带水量',
        '考虑使用净水器代替携带大量水'
      ]
    },
    food: {
      priority: 'medium',
      title: '🍫 食物减重',
      items: [
        '选择高能量密度食物（坚果、能量棒、冻干餐）',
        '去除所有食物外包装',
        '精确计算所需量，避免过量携带'
      ]
    }
  };
  return tips[categoryId] || { priority: 'low', title: '', items: [] };
}

export function calculatePackWeightDistribution(totalWeight, bodyWeight) {
  const idealRatio = 0.2;
  const maxSafeRatio = 0.3;
  const currentRatio = totalWeight / bodyWeight;

  const distribution = {
    idealWeight: (bodyWeight * idealRatio).toFixed(1),
    maxSafeWeight: (bodyWeight * maxSafeRatio).toFixed(1),
    currentWeight: totalWeight.toFixed(1),
    currentRatio: (currentRatio * 100).toFixed(1),
    overWeight: Math.max(0, totalWeight - bodyWeight * maxSafeRatio).toFixed(1)
  };

  return distribution;
}
