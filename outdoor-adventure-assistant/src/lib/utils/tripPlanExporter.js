import { getRiskLevel } from '../data/riskData.js';

export function generateTripPlanId() {
  return 'plan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

export function buildTripPlan(options) {
  const {
    tripName = '未命名出行',
    activityType = 'hiking',
    date = new Date().toISOString().split('T')[0],
    location = '未指定',
    duration = 8,
    team = [],
    routeNodes = [],
    equipment = {},
    riskAssessment = {},
    fitnessPlan = {},
    emergencyPlan = {},
    notes = ''
  } = options;

  const plan = {
    id: generateTripPlanId(),
    createdAt: new Date().toISOString(),
    version: '1.0',
    basicInfo: {
      tripName,
      activityType,
      date,
      location,
      duration
    },
    teamInfo: buildTeamInfo(team),
    routeInfo: buildRouteInfo(routeNodes),
    equipmentInfo: buildEquipmentInfo(equipment),
    riskInfo: buildRiskInfo(riskAssessment),
    fitnessInfo: buildFitnessInfo(fitnessPlan),
    emergencyInfo: buildEmergencyInfo(emergencyPlan),
    schedule: buildSchedule(routeNodes, team),
    notes
  };

  return plan;
}

function buildTeamInfo(team) {
  if (!team || team.length === 0) return { members: [], totalMembers: 0 };

  const roles = {};
  for (const member of team) {
    roles[member.role] = (roles[member.role] || 0) + 1;
  }

  return {
    members: team.map(m => ({
      name: m.name,
      role: m.role,
      bodyWeight: m.bodyWeight,
      fitness: m.fitness,
      experience: m.experience,
      notes: m.notes
    })),
    totalMembers: team.length,
    roles
  };
}

function buildRouteInfo(nodes) {
  if (!nodes || nodes.length === 0) return { nodes: [], stats: null };

  let totalDistance = 0;
  let totalElevation = 0;
  let totalTime = 0;
  let maxAlt = 0;

  for (const node of nodes) {
    totalDistance += node.distanceFromPrev || 0;
    totalElevation += node.elevationGain || 0;
    totalTime += node.estimatedTime || 0;
    if (node.altitude > maxAlt) maxAlt = node.altitude;
  }

  return {
    nodes: nodes.map(n => ({
      name: n.name,
      type: n.type,
      altitude: n.altitude,
      distanceFromPrev: n.distanceFromPrev,
      elevationGain: n.elevationGain,
      estimatedTime: n.estimatedTime,
      activityType: n.activityType,
      notes: n.notes
    })),
    stats: {
      totalDistance,
      totalElevation,
      totalTime,
      maxAltitude: maxAlt
    }
  };
}

function buildEquipmentInfo(equipment) {
  if (!equipment || !equipment.categories) return { categories: {}, summary: {} };

  const totalWeight = Object.values(equipment.categories).reduce((sum, items) => {
    return sum + items.reduce((s, item) => s + (item.totalWeight || item.weight || 0), 0);
  }, 0);

  return {
    categories: equipment.categories,
    summary: {
      totalWeight: (totalWeight / 1000).toFixed(1),
      totalCount: equipment.summary?.totalCount || 0,
      essentialCount: equipment.summary?.essentialCount || 0
    }
  };
}

function buildRiskInfo(riskAssessment) {
  if (!riskAssessment) return {};

  return {
    riskScore: riskAssessment.riskScore || 0,
    riskLevel: riskAssessment.riskLevel || 'low',
    weather: riskAssessment.weather || 'sunny',
    terrain: riskAssessment.terrain || 'trail',
    experience: riskAssessment.experience || 'intermediate',
    groupSize: riskAssessment.groupSize || 'small',
    altitude: riskAssessment.altitude || 0,
    temperature: riskAssessment.temperature || 20
  };
}

function buildFitnessInfo(fitnessPlan) {
  if (!fitnessPlan) return {};

  return {
    calories: fitnessPlan.calories || 0,
    water: fitnessPlan.water || 0,
    durationHours: fitnessPlan.durationHours || 0,
    fitnessIndex: fitnessPlan.fitnessIndex || 0
  };
}

function buildEmergencyInfo(emergencyPlan) {
  if (!emergencyPlan) return {};

  return {
    emergencyContact: emergencyPlan.emergencyContact || '',
    rescueInfo: emergencyPlan.rescueInfo || '',
    medicalInfo: emergencyPlan.medicalInfo || '',
    hasFirstAid: emergencyPlan.hasFirstAid || false,
    hasCommunication: emergencyPlan.hasCommunication || false
  };
}

function buildSchedule(routeNodes, team) {
  if (!routeNodes || routeNodes.length === 0) return { timeline: [], summary: '' };

  const timeline = [];
  let totalMinutes = 0;

  for (let i = 0; i < routeNodes.length; i++) {
    const node = routeNodes[i];
    const startMinutes = totalMinutes;
    const endMinutes = totalMinutes + (node.estimatedTime || 0);

    timeline.push({
      order: i + 1,
      name: node.name,
      type: node.type,
      startTime: formatTime(startMinutes),
      endTime: formatTime(endMinutes),
      duration: node.estimatedTime || 0,
      altitude: node.altitude,
      distance: node.distanceFromPrev || 0,
      activity: node.activityType || 'hike',
      notes: node.notes
    });

    totalMinutes = endMinutes;
  }

  return {
    timeline,
    summary: `全程共${routeNodes.length}个节点，预计用时${Math.floor(totalMinutes / 60)}小时${totalMinutes % 60}分钟`
  };
}

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function exportPlanAsText(plan) {
  const lines = [];

  lines.push('='.repeat(70));
  lines.push('           户 外 出 行 计 划 书');
  lines.push('='.repeat(70));
  lines.push('');
  lines.push(`计划编号: ${plan.id}`);
  lines.push(`生成时间: ${new Date(plan.createdAt).toLocaleString('zh-CN')}`);
  lines.push(`版本: ${plan.version}`);
  lines.push('');

  lines.push('-'.repeat(70));
  lines.push('一、基本信息');
  lines.push('-'.repeat(70));
  lines.push(`  出行名称: ${plan.basicInfo.tripName}`);
  lines.push(`  活动类型: ${getActivityTypeName(plan.basicInfo.activityType)}`);
  lines.push(`  出行日期: ${plan.basicInfo.date}`);
  lines.push(`  活动地点: ${plan.basicInfo.location}`);
  lines.push(`  预计时长: ${plan.basicInfo.duration} 小时`);
  lines.push('');

  if (plan.teamInfo && plan.teamInfo.members.length > 0) {
    lines.push('-'.repeat(70));
    lines.push('二、团队成员');
    lines.push('-'.repeat(70));
    lines.push(`  共 ${plan.teamInfo.totalMembers} 名成员`);
    lines.push('');

    for (const [i, member] of plan.teamInfo.members.entries()) {
      lines.push(`  ${i + 1}. ${member.name}`);
      lines.push(`     角色: ${getRoleName(member.role)} | 体重: ${member.bodyWeight}kg`);
      lines.push(`     体能: ${getFitnessName(member.fitness)} | 经验: ${getExperienceName(member.experience)}`);
      if (member.notes) {
        lines.push(`     备注: ${member.notes}`);
      }
      lines.push('');
    }

    if (plan.teamInfo.roles) {
      lines.push('  角色分布:');
      for (const [role, count] of Object.entries(plan.teamInfo.roles)) {
        lines.push(`    - ${getRoleName(role)}: ${count}人`);
      }
      lines.push('');
    }
  }

  if (plan.routeInfo && plan.routeInfo.nodes.length > 0) {
    lines.push('-'.repeat(70));
    lines.push('三、路线规划');
    lines.push('-'.repeat(70));

    if (plan.routeInfo.stats) {
      lines.push(`  总距离: ${plan.routeInfo.stats.totalDistance} km`);
      lines.push(`  累计爬升: ${plan.routeInfo.stats.totalElevation} m`);
      lines.push(`  预计用时: ${Math.floor(plan.routeInfo.stats.totalTime / 60)}小时${plan.routeInfo.stats.totalTime % 60}分钟`);
      lines.push(`  最高海拔: ${plan.routeInfo.stats.maxAltitude} m`);
      lines.push('');
    }

    lines.push('  路线节点:');
    for (const [i, node] of plan.routeInfo.nodes.entries()) {
      lines.push(`  ${i + 1}. ${node.name} [${getNodeTypeName(node.type)}]`);
      lines.push(`     海拔: ${node.altitude}m | 距上站: ${node.distanceFromPrev}km | 爬升: ${node.elevationGain}m`);
      lines.push(`     活动: ${getActivityAtNodeName(node.activityType)} | 预计用时: ${node.estimatedTime}分钟`);
      if (node.notes) {
        lines.push(`     备注: ${node.notes}`);
      }
      lines.push('');
    }
  }

  if (plan.schedule && plan.schedule.timeline.length > 0) {
    lines.push('-'.repeat(70));
    lines.push('四、行程时间表');
    lines.push('-'.repeat(70));
    lines.push(`  ${plan.schedule.summary}`);
    lines.push('');

    for (const item of plan.schedule.timeline) {
      lines.push(`  ${item.order}. ${item.name} [${getNodeTypeName(item.type)}]`);
      lines.push(`     ${item.startTime} - ${item.endTime} (${item.duration}分钟)`);
      lines.push(`     海拔: ${item.altitude}m | 行进距离: ${item.distance}km`);
      if (item.notes) {
        lines.push(`     备注: ${item.notes}`);
      }
      lines.push('');
    }
  }

  if (plan.equipmentInfo && plan.equipmentInfo.categories) {
    lines.push('-'.repeat(70));
    lines.push('五、装备清单');
    lines.push('-'.repeat(70));

    if (plan.equipmentInfo.summary) {
      lines.push(`  预估总重量: ${plan.equipmentInfo.summary.totalWeight} kg`);
      lines.push(`  装备总数: ${plan.equipmentInfo.summary.totalCount} 件`);
      lines.push(`  必备装备: ${plan.equipmentInfo.summary.essentialCount} 件`);
      lines.push('');
    }

    const categoryNames = {
      clothing: '衣物系统', footwear: '鞋类', backpack: '背包系统',
      camping: '露营装备', navigation: '导航', lighting: '照明',
      firstAid: '急救', hydration: '饮水', food: '饮食',
      tools: '工具', communication: '通讯', hygiene: '卫生', documents: '证件'
    };

    for (const [catName, items] of Object.entries(plan.equipmentInfo.categories)) {
      if (items.length === 0) continue;

      lines.push(`  【${categoryNames[catName] || catName}】`);
      for (const item of items) {
        const weight = (item.weight / 1000).toFixed(2);
        const qty = item.quantity > 1 ? ` ×${item.quantity}` : '';
        const essential = item.essential ? ' [必备]' : '';
        lines.push(`    - ${item.name}${qty} (${weight}kg)${essential}`);
      }
      lines.push('');
    }
  }

  if (plan.riskInfo && plan.riskInfo.riskScore) {
    lines.push('-'.repeat(70));
    lines.push('六、风险评估');
    lines.push('-'.repeat(70));
    const riskLevel = getRiskLevel(plan.riskInfo.riskScore);
    lines.push(`  风险评分: ${plan.riskInfo.riskScore}`);
    lines.push(`  风险等级: ${riskLevel.label}`);
    lines.push(`  建议: ${riskLevel.advice}`);
    lines.push('');
  }

  if (plan.fitnessInfo && plan.fitnessInfo.calories) {
    lines.push('-'.repeat(70));
    lines.push('七、体能与营养');
    lines.push('-'.repeat(70));
    lines.push(`  预计消耗: ${plan.fitnessInfo.calories} 卡路里`);
    lines.push(`  建议饮水: ${plan.fitnessInfo.water} 升`);
    lines.push(`  活动时长: ${plan.fitnessInfo.durationHours} 小时`);
    lines.push('');
  }

  if (plan.emergencyInfo && (plan.emergencyInfo.emergencyContact || plan.emergencyInfo.rescueInfo)) {
    lines.push('-'.repeat(70));
    lines.push('八、应急预案');
    lines.push('-'.repeat(70));
    if (plan.emergencyInfo.emergencyContact) {
      lines.push(`  紧急联系人: ${plan.emergencyInfo.emergencyContact}`);
    }
    if (plan.emergencyInfo.rescueInfo) {
      lines.push(`  救援信息: ${plan.emergencyInfo.rescueInfo}`);
    }
    lines.push('');
  }

  if (plan.notes) {
    lines.push('-'.repeat(70));
    lines.push('九、备注');
    lines.push('-'.repeat(70));
    lines.push(`  ${plan.notes}`);
    lines.push('');
  }

  lines.push('='.repeat(70));
  lines.push('  本计划书仅供参考，实际出行请以专业判断和实际情况为准');
  lines.push('  祝出行平安顺利！');
  lines.push('='.repeat(70));

  return lines.join('\n');
}

export function exportPlanAsJSON(plan) {
  return JSON.stringify(plan, null, 2);
}

export function downloadTripPlan(plan, format = 'text') {
  let content, filename, type;

  if (format === 'json') {
    content = exportPlanAsJSON(plan);
    filename = `trip_plan_${plan.id}.json`;
    type = 'application/json';
  } else {
    content = exportPlanAsText(plan);
    filename = `trip_plan_${plan.id}.txt`;
    type = 'text/plain';
  }

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

const activityTypeNames = {
  hiking: '徒步', mountaineering: '登山', camping: '露营', expedition: '野外探险'
};
const roleNames = {
  leader: '领队', navigator: '导航员', medic: '队医', equipment: '装备官',
  cook: '炊事员', scout: '先锋', communicator: '通讯员', member: '普通队员'
};
const fitnessNames = {
  excellent: '极佳', good: '良好', fair: '一般', poor: '较差'
};
const experienceNames = {
  expert: '专家', advanced: '高级', intermediate: '中级', beginner: '新手'
};
const nodeTypeNames = {
  start: '起点', waypoint: '途经点', rest: '休息点', camp: '营地',
  summit: '顶峰', water: '水源', danger: '危险点', end: '终点'
};
const activityAtNodeNames = {
  hike: '徒步', climb: '攀登', rest: '休息', eat: '用餐',
  camp: '露营', swim: '涉水', explore: '探索', photo: '拍照'
};

function getActivityTypeName(id) { return activityTypeNames[id] || id; }
function getRoleName(id) { return roleNames[id] || id; }
function getFitnessName(id) { return fitnessNames[id] || id; }
function getExperienceName(id) { return experienceNames[id] || id; }
function getNodeTypeName(id) { return nodeTypeNames[id] || id; }
function getActivityAtNodeName(id) { return activityAtNodeNames[id] || id; }
