import { ingredients, noteFamilies } from '../data/ingredients.js';
import { classicPerfumes } from '../data/perfumes.js';

function getAllIngredients() {
  return [...ingredients.top, ...ingredients.middle, ...ingredients.base];
}

function findIngredientById(id) {
  return getAllIngredients().find(ing => ing.id === id);
}

export function analyzeBlend(blend) {
  const allIngredients = getAllIngredients();
  const selectedIngredients = [];

  ['top', 'middle', 'base'].forEach(noteType => {
    if (blend[noteType]) {
      blend[noteType].forEach(item => {
        const ing = allIngredients.find(i => i.id === item.id);
        if (ing) {
          selectedIngredients.push({
            ...ing,
            noteType,
            ratio: item.ratio,
            weight: item.ratio * (noteType === 'top' ? 0.3 : noteType === 'middle' ? 0.5 : 0.7)
          });
        }
      });
    }
  });

  if (selectedIngredients.length === 0) {
    return null;
  }

  const familyDistribution = {};
  const noteKeywords = {};
  let totalWeight = 0;

  selectedIngredients.forEach(ing => {
    totalWeight += ing.weight;
    familyDistribution[ing.family] = (familyDistribution[ing.family] || 0) + ing.weight;
    ing.notes.forEach(note => {
      noteKeywords[note] = (noteKeywords[note] || 0) + ing.weight * 0.5;
    });
  });

  const familyPercentages = {};
  Object.keys(familyDistribution).forEach(family => {
    familyPercentages[family] = Math.round((familyDistribution[family] / totalWeight) * 100);
  });

  const sortedKeywords = Object.entries(noteKeywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([keyword]) => keyword);

  const style = determineStyle(familyPercentages, selectedIngredients);
  const dominantFamilies = Object.entries(familyPercentages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([family, percentage]) => ({ family, percentage }));

  const season = determineSeason(familyPercentages);
  const gender = determineGender(familyPercentages);
  const timeOfDay = determineTimeOfDay(familyPercentages);
  const longevity = calculateLongevity(selectedIngredients);
  const sillage = calculateSillage(selectedIngredients);

  const similarPerfumes = findSimilarPerfumes(blend);

  return {
    familyPercentages,
    dominantFamilies,
    keywords: sortedKeywords,
    style,
    season,
    gender,
    timeOfDay,
    longevity,
    sillage,
    similarPerfumes,
    colorPalette: generateColorPalette(selectedIngredients)
  };
}

function determineStyle(familyPercentages, ingredients) {
  const styles = [];

  if (familyPercentages['花香调'] > 30) {
    styles.push({ name: '花香调', confidence: Math.min(familyPercentages['花香调'], 100) });
  }
  if (familyPercentages['东方调'] > 20 || (familyPercentages['东方调'] + familyPercentages['木质调']) > 35) {
    styles.push({ name: '东方调', confidence: Math.min(familyPercentages['东方调'] + (familyPercentages['木质调'] * 0.5), 100) });
  }
  if (familyPercentages['木质调'] > 25) {
    styles.push({ name: '木质调', confidence: Math.min(familyPercentages['木质调'], 100) });
  }
  if (familyPercentages['柑橘调'] > 25) {
    styles.push({ name: '柑橘调', confidence: Math.min(familyPercentages['柑橘调'], 100) });
  }
  if (familyPercentages['美食调'] > 20) {
    styles.push({ name: '美食调', confidence: Math.min(familyPercentages['美食调'], 100) });
  }
  if (familyPercentages['辛香调'] > 20) {
    styles.push({ name: '辛香调', confidence: Math.min(familyPercentages['辛香调'], 100) });
  }
  if (familyPercentages['草本调'] > 20) {
    styles.push({ name: '草本调', confidence: Math.min(familyPercentages['草本调'], 100) });
  }
  if (familyPercentages['动物调'] > 15) {
    styles.push({ name: '动物调', confidence: Math.min(familyPercentages['动物调'] * 2, 100) });
  }

  if (styles.length === 0) {
    styles.push({ name: '混合调', confidence: 100 });
  }

  return styles.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
}

function determineSeason(familyPercentages) {
  const winter = (familyPercentages['东方调'] || 0) + (familyPercentages['辛香调'] || 0) + (familyPercentages['木质调'] || 0) * 0.5;
  const summer = (familyPercentages['柑橘调'] || 0) + (familyPercentages['果香调'] || 0) + (familyPercentages['草本调'] || 0) * 0.5;
  const spring = (familyPercentages['花香调'] || 0) + (familyPercentages['果香调'] || 0) * 0.5;
  const autumn = (familyPercentages['木质调'] || 0) + (familyPercentages['美食调'] || 0) + (familyPercentages['辛香调'] || 0) * 0.5;

  const seasons = [
    { name: '春季', value: spring, icon: '🌸' },
    { name: '夏季', value: summer, icon: '☀️' },
    { name: '秋季', value: autumn, icon: '🍂' },
    { name: '冬季', value: winter, icon: '❄️' }
  ];

  return seasons.sort((a, b) => b.value - a.value)[0];
}

function determineGender(familyPercentages) {
  const feminine = (familyPercentages['花香调'] || 0) + (familyPercentages['果香调'] || 0) + (familyPercentages['美食调'] || 0) * 0.5;
  const masculine = (familyPercentages['木质调'] || 0) + (familyPercentages['辛香调'] || 0) + (familyPercentages['草本调'] || 0) * 0.5;
  const neutral = 100 - Math.abs(feminine - masculine);

  if (neutral > 40) {
    return { name: '中性', value: neutral, description: '男女皆宜' };
  } else if (feminine > masculine) {
    return { name: '女性化', value: feminine, description: '更适合女性' };
  } else {
    return { name: '男性化', value: masculine, description: '更适合男性' };
  }
}

function determineTimeOfDay(familyPercentages) {
  const day = (familyPercentages['柑橘调'] || 0) + (familyPercentages['果香调'] || 0) + (familyPercentages['草本调'] || 0);
  const night = (familyPercentages['东方调'] || 0) + (familyPercentages['美食调'] || 0) + (familyPercentages['动物调'] || 0);

  if (day > night) {
    return { name: '日间', icon: '☀️', description: '适合白天使用' };
  } else {
    return { name: '夜间', icon: '🌙', description: '适合夜晚使用' };
  }
}

function calculateLongevity(ingredients) {
  let totalWeight = 0;
  let longevity = 0;

  ingredients.forEach(ing => {
    const baseLongevity = ing.noteType === 'top' ? 2 : ing.noteType === 'middle' ? 6 : 12;
    longevity += baseLongevity * ing.weight;
    totalWeight += ing.weight;
  });

  const avgLongevity = longevity / totalWeight;
  let level, description;

  if (avgLongevity < 4) {
    level = '短';
    description = '2-4小时，需要补香';
  } else if (avgLongevity < 7) {
    level = '中等';
    description = '4-8小时，日常持久';
  } else if (avgLongevity < 10) {
    level = '长';
    description = '8-12小时，持久留香';
  } else {
    level = '超长';
    description: '12小时以上，极致持久';
  }

  return { level, description, value: Math.round(avgLongevity) };
}

function calculateSillage(ingredients) {
  let totalWeight = 0;
  let sillage = 0;

  ingredients.forEach(ing => {
    sillage += ing.intensity * ing.weight;
    totalWeight += ing.weight;
  });

  const avgSillage = sillage / totalWeight;
  let level, description;

  if (avgSillage < 4) {
    level = '淡';
    description: '肌肤之亲，只有近距离才能闻到';
  } else if (avgSillage < 6) {
    level = '适中';
    description: '舒适的存在感，不会过度张扬';
  } else if (avgSillage < 8) {
    level = '明显';
    description: '较强的扩散力，容易被他人察觉';
  } else {
    level = '强';
    description: '极具存在感，一出现就能被闻到';
  }

  return { level, description, value: Math.round(avgSillage) };
}

function generateColorPalette(ingredients) {
  const colors = ingredients.map(ing => ing.color);
  return [...new Set(colors)].slice(0, 5);
}

function findSimilarPerfumes(blend) {
  const similarities = classicPerfumes.map(perfume => {
    const similarity = calculateBlendSimilarity(blend, perfume.blend);
    return { ...perfume, similarity };
  });

  return similarities
    .filter(p => p.similarity > 20)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);
}

function calculateBlendSimilarity(blend1, blend2) {
  let similarity = 0;
  let maxPossible = 0;

  ['top', 'middle', 'base'].forEach(noteType => {
    const items1 = blend1[noteType] || [];
    const items2 = blend2[noteType] || [];

    items1.forEach(item1 => {
      const match = items2.find(item2 => item2.id === item1.id);
      if (match) {
        const weight = noteType === 'top' ? 0.3 : noteType === 'middle' ? 0.5 : 0.7;
        const ratioDiff = Math.abs(item1.ratio - match.ratio);
        const ratioMatch = Math.max(0, 100 - ratioDiff);
        similarity += ratioMatch * weight;
        maxPossible += 100 * weight;
      }
    });

    items2.forEach(item2 => {
      const match = items1.find(item1 => item1.id === item2.id);
      if (!match) {
        const weight = noteType === 'top' ? 0.3 : noteType === 'middle' ? 0.5 : 0.7;
        maxPossible += 50 * weight;
      }
    });
  });

  return maxPossible > 0 ? Math.round((similarity / maxPossible) * 100) : 0;
}

export function getIngredientById(id) {
  return findIngredientById(id);
}
