export const teamRoles = [
  { id: 'leader', name: '领队', icon: '👑', description: '负责整体决策和安全', weightMultiplier: 1.2, essentialSkills: ['导航', '急救', '决策'] },
  { id: 'navigator', name: '导航员', icon: '🧭', description: '负责路线规划和导航', weightMultiplier: 1.0, essentialSkills: ['导航', '地图阅读'] },
  { id: 'medic', name: '队医', icon: '⛑️', description: '负责医疗急救', weightMultiplier: 1.0, essentialSkills: ['急救', '药品管理'] },
  { id: 'equipment', name: '装备官', icon: '🎒', description: '负责装备管理和维护', weightMultiplier: 1.1, essentialSkills: ['装备检查', '维修'] },
  { id: 'cook', name: '炊事员', icon: '🍳', description: '负责饮食安排', weightMultiplier: 0.9, essentialSkills: ['烹饪', '食物管理'] },
  { id: 'scout', name: '先锋', icon: '🔭', description: '负责探路和侦察', weightMultiplier: 1.0, essentialSkills: ['快速行进', '观察'] },
  { id: 'communicator', name: '通讯员', icon: '📻', description: '负责通讯联络', weightMultiplier: 0.9, essentialSkills: ['通讯设备', '记录'] },
  { id: 'member', name: '普通队员', icon: '👤', description: '普通队员', weightMultiplier: 1.0, essentialSkills: [] }
];

export const fitnessLevels = [
  { id: 'excellent', name: '极佳', icon: '💪', capacityMultiplier: 1.3, maxWeightRatio: 0.30 },
  { id: 'good', name: '良好', icon: '👍', capacityMultiplier: 1.1, maxWeightRatio: 0.25 },
  { id: 'fair', name: '一般', icon: '😐', capacityMultiplier: 1.0, maxWeightRatio: 0.22 },
  { id: 'poor', name: '较差', icon: '😓', capacityMultiplier: 0.85, maxWeightRatio: 0.18 }
];

export const experienceLevels = [
  { id: 'expert', name: '专家', icon: '🏆', capacityMultiplier: 1.15 },
  { id: 'advanced', name: '高级', icon: '🌳', capacityMultiplier: 1.05 },
  { id: 'intermediate', name: '中级', icon: '🌿', capacityMultiplier: 1.0 },
  { id: 'beginner', name: '新手', icon: '🌱', capacityMultiplier: 0.9 }
];

export function generateMemberId() {
  return 'member_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

export function createMember(name, role = 'member', bodyWeight = 65, fitness = 'good', experience = 'intermediate') {
  return {
    id: generateMemberId(),
    name: name || `队员${Math.floor(Math.random() * 1000)}`,
    role,
    bodyWeight,
    fitness,
    experience,
    skills: [],
    notes: '',
    assignedItems: [],
    assignedWeight: 0
  };
}

export function calculateMemberCapacity(member) {
  const role = teamRoles.find(r => r.id === member.role) || teamRoles[7];
  const fitness = fitnessLevels.find(f => f.id === member.fitness) || fitnessLevels[2];
  const experience = experienceLevels.find(e => e.id === member.experience) || experienceLevels[2];

  const baseCapacity = member.bodyWeight * fitness.maxWeightRatio;
  const adjustedCapacity = baseCapacity * role.weightMultiplier * fitness.capacityMultiplier * experience.capacityMultiplier;

  return {
    baseCapacity: Math.round(baseCapacity),
    adjustedCapacity: Math.round(adjustedCapacity),
    maxWeightRatio: fitness.maxWeightRatio,
    roleMultiplier: role.weightMultiplier,
    fitnessMultiplier: fitness.capacityMultiplier,
    experienceMultiplier: experience.capacityMultiplier
  };
}

export function getRoleInfo(roleId) {
  return teamRoles.find(r => r.id === roleId) || teamRoles[7];
}

export function getFitnessInfo(fitnessId) {
  return fitnessLevels.find(f => f.id === fitnessId) || fitnessLevels[2];
}

export function getExperienceInfo(experienceId) {
  return experienceLevels.find(e => e.id === experienceId) || experienceLevels[2];
}
