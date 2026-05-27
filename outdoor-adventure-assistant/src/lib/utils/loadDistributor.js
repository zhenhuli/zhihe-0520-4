import { calculateMemberCapacity, getRoleInfo } from '../data/teamData.js';

const SHARED_EQUIPMENT_CATEGORIES = ['camping', 'food', 'hydration', 'tools', 'firstAid', 'navigation', 'communication', 'lighting', 'hygiene'];

const ROLE_CATEGORY_MAP = {
  leader: ['navigation', 'communication', 'firstAid'],
  navigator: ['navigation'],
  medic: ['firstAid'],
  equipment: ['tools', 'backpack'],
  cook: ['food', 'cooking'],
  scout: ['navigation'],
  communicator: ['communication']
};

export function getAllEquipmentItems(categories) {
  const allItems = [];
  for (const [catName, items] of Object.entries(categories)) {
    for (const item of items) {
      allItems.push({
        ...item,
        category: catName,
        isShared: SHARED_EQUIPMENT_CATEGORIES.includes(catName)
      });
    }
  }
  return allItems;
}

export function distributeLoad(members, equipmentCategories) {
  const allItems = getAllEquipmentItems(equipmentCategories);
  const sharedItems = allItems.filter(i => i.isShared);
  const personalItems = allItems.filter(i => !i.isShared);

  const memberCapacities = members.map(m => ({
    member: m,
    capacity: calculateMemberCapacity(m),
    assigned: [],
    assignedWeight: 0
  }));

  for (const item of sharedItems) {
    let assigned = false;
    const sorted = [...memberCapacities].sort((a, b) => {
      const aUtil = a.capacity.adjustedCapacity > 0 ? a.assignedWeight / a.capacity.adjustedCapacity : 1;
      const bUtil = b.capacity.adjustedCapacity > 0 ? b.assignedWeight / b.capacity.adjustedCapacity : 1;
      return aUtil - bUtil;
    });

    const roleCategories = ROLE_CATEGORY_MAP[item.category] || [];
    const roleMatch = sorted.filter(mc => {
      const roleCats = ROLE_CATEGORY_MAP[mc.member.role] || [];
      return roleCats.includes(item.category);
    });

    const candidates = roleMatch.length > 0 ? roleMatch : sorted;

    for (const mc of candidates) {
      const remaining = mc.capacity.adjustedCapacity - mc.assignedWeight;
      if (remaining >= item.totalWeight * 0.3) {
        mc.assigned.push(item);
        mc.assignedWeight += item.totalWeight;
        assigned = true;
        break;
      }
    }

    if (!assigned && candidates.length > 0) {
      const target = candidates[0];
      target.assigned.push(item);
      target.assignedWeight += item.totalWeight;
    }
  }

  for (const mc of memberCapacities) {
    for (const item of personalItems) {
      mc.assigned.push({ ...item, personal: true });
      mc.assignedWeight += item.totalWeight;
    }
  }

  return memberCapacities.map(mc => ({
    member: mc.member,
    capacity: mc.capacity,
    items: mc.assigned,
    totalWeight: mc.assignedWeight,
    utilization: mc.capacity.adjustedCapacity > 0
      ? Math.round((mc.assignedWeight / mc.capacity.adjustedCapacity) * 100)
      : 0
  }));
}

export function getDistributionSummary(distribution) {
  const totalWeight = distribution.reduce((sum, d) => sum + d.totalWeight, 0);
  const totalCapacity = distribution.reduce((sum, d) => sum + d.capacity.adjustedCapacity, 0);
  const totalItems = distribution.reduce((sum, d) => sum + d.items.length, 0);

  return {
    totalWeight,
    totalCapacity,
    totalItems,
    utilization: totalCapacity > 0 ? Math.round((totalWeight / totalCapacity) * 100) : 0,
    memberCount: distribution.length,
    avgWeightPerPerson: distribution.length > 0 ? Math.round(totalWeight / distribution.length) : 0
  };
}

export function redistributeLoadFairly(members, equipmentCategories) {
  const result = distributeLoad(members, equipmentCategories);

  const totalWeight = result.reduce((sum, d) => sum + d.totalWeight, 0);
  const avgWeight = result.length > 0 ? totalWeight / result.length : 0;

  return result
    .map(d => ({
      ...d,
      deviation: Math.round(((d.totalWeight - avgWeight) / 10))
    }))
    .sort((a, b) => b.totalWeight - a.totalWeight);
}

export function generateDistributionAdvice(distribution) {
  const advice = [];

  for (const d of distribution) {
    const utilization = d.utilization;

    if (utilization > 90) {
      advice.push({
        member: d.member.name,
        level: 'warning',
        message: `${d.member.name}的负重占其能力的${utilization}%，已接近极限，建议适当减轻`
      });
    } else if (utilization > 75) {
      advice.push({
        member: d.member.name,
        level: 'info',
        message: `${d.member.name}的负重分配合理，利用率${utilization}%`
      });
    } else if (utilization < 30 && d.items.length > 0) {
      advice.push({
        member: d.member.name,
        level: 'success',
        message: `${d.member.name}的负重较轻，可考虑分担更多装备`
      });
    }
  }

  const overloaded = distribution.filter(d => d.utilization > 90);
  if (overloaded.length > 0) {
    advice.push({
      member: 'general',
      level: 'danger',
      message: `有${overloaded.length}名队员负重过高，建议重新分配或精简装备`
    });
  }

  const underloaded = distribution.filter(d => d.utilization < 30 && d.items.length > 0);
  if (underloaded.length > 0) {
    advice.push({
      member: 'general',
      level: 'info',
      message: `有${underloaded.length}名队员负重较轻，可优化分配`
    });
  }

  return advice;
}
