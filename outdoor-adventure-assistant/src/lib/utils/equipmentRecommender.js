import { equipmentDatabase } from '../data/equipmentData.js';

export function getEquipmentRecommendations(params) {
  const { activity, duration, season, temperature, altitude, groupSize, experience } = params;

  const isOvernight = duration > 8 || activity === 'camping' || activity === 'expedition' || activity === 'mountaineering';
  const isCold = temperature < 10;
  const isExtremeCold = temperature < -5;
  const isHighAltitude = altitude > 3000;
  const isMultiDay = duration > 24;

  const categories = {};
  let totalWeight = 0;
  let essentialCount = 0;
  let totalCount = 0;

  function flattenItems(categoryData) {
    if (Array.isArray(categoryData)) return categoryData;
    const flat = [];
    for (const sub of Object.values(categoryData)) {
      if (Array.isArray(sub)) flat.push(...sub);
    }
    return flat;
  }

  for (const [categoryName, categoryData] of Object.entries(equipmentDatabase)) {
    const items = flattenItems(categoryData);
    const recommended = [];

    for (const item of items) {
      let shouldInclude = false;
      let reason = '';

      if (item.essential) {
        shouldInclude = true;
        reason = '必备';
      }

      if (item.scenarios && item.scenarios.includes(activity)) {
        shouldInclude = true;
        reason = `${activity}活动建议`;
      }

      if (item.seasons && !shouldInclude) {
        if (isExtremeCold && item.seasons.includes('extreme_cold')) {
          shouldInclude = true;
          reason = '极寒环境';
        } else if (isCold && item.seasons.includes('cold')) {
          shouldInclude = true;
          reason = '寒冷天气';
        } else if (!isCold && item.seasons.includes('warm')) {
          shouldInclude = true;
          reason = '温暖天气';
        } else if (item.seasons.includes('snow') && isHighAltitude) {
          shouldInclude = true;
          reason = '高海拔可能降雪';
        } else if (item.seasons.includes('all')) {
          if (!item.seasons.includes('cold') && !item.seasons.includes('warm')) {
            shouldInclude = shouldInclude || item.essential;
          }
        }
      }

      if (isOvernight && ['camping', 'food', 'hydration'].includes(categoryName)) {
        if (!item.scenarios || item.scenarios.some(s => ['camping', 'expedition', 'mountaineering'].includes(s))) {
          shouldInclude = shouldInclude || item.essential;
        }
      }

      if (isMultiDay && categoryName === 'food' && item.id === 'meals') {
        shouldInclude = true;
        reason = '多日行程';
      }

      if (isHighAltitude && ['gloves_waterproof', 'gaiters', 'sunglasses'].includes(item.id)) {
        shouldInclude = true;
        reason = '高海拔紫外线强';
      }

      if (shouldInclude) {
        const qty = item.quantity || 1;
        recommended.push({
          ...item,
          quantity: qty,
          totalWeight: item.weight * qty,
          reason
        });
        totalWeight += item.weight * qty;
        totalCount += qty;
        if (item.essential) essentialCount += qty;
      }
    }

    if (recommended.length > 0) {
      categories[categoryName] = recommended;
    }
  }

  const weatherExtra = [];
  if (temperature > 30) {
    weatherExtra.push({ name: '建议增加: 遮阳伞、冰袖', weight: 0 });
  }
  if (isCold && !isExtremeCold) {
    weatherExtra.push({ name: '建议增加: 暖宝宝、热饮保温', weight: 0 });
  }
  if (isExtremeCold) {
    weatherExtra.push({ name: '建议增加: 备用保暖层、防风面罩', weight: 0 });
  }

  return {
    categories,
    summary: {
      totalWeight: (totalWeight / 1000).toFixed(1),
      totalCount,
      essentialCount,
      optionalCount: totalCount - essentialCount
    },
    weatherExtra,
    isOvernight,
    isCold,
    isHighAltitude
  };
}

export const categoryLabels = {
  clothing: '衣物系统',
  baseLayers: '贴身层',
  midLayers: '中间层',
  outerLayers: '外层',
  accessories: '配件',
  footwear: '鞋类',
  backpack: '背包系统',
  camping: '露营装备',
  navigation: '导航',
  lighting: '照明',
  firstAid: '急救',
  hydration: '饮水',
  food: '饮食',
  tools: '工具',
  communication: '通讯',
  hygiene: '卫生',
  documents: '证件'
};

export const clothingSubcategoryLabels = {
  baseLayers: '贴身层',
  midLayers: '中间层',
  outerLayers: '外层',
  accessories: '配件'
};