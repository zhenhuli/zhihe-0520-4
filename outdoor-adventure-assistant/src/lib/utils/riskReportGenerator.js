import { getRiskLevel } from '../data/riskData.js';
import { difficultyLevels } from '../data/routeDifficulty.js';

export function generateRiskReportId() {
  return 'report_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

export function generateRiskReport(params) {
  const {
    basicInfo,
    riskScore,
    routeDifficulty,
    weatherOverlay,
    riskBreakdown,
    routeBreakdown,
    safetyMeasures,
    recommendations
  } = params;

  const overallRisk = getRiskLevel(weatherOverlay?.overlayedScore || riskScore || 0);
  const routeDiff = difficultyLevels.find(d => d.score === routeDifficulty?.score) || difficultyLevels[0];

  return {
    id: generateRiskReportId(),
    generatedAt: new Date().toISOString(),
    version: '1.0',
    overallAssessment: {
      riskScore: weatherOverlay?.overlayedScore || riskScore || 0,
      riskLevel: overallRisk.level,
      riskLabel: overallRisk.label,
      riskColor: overallRisk.color,
      routeDifficulty: routeDifficulty?.score || 1,
      routeDifficultyLabel: routeDiff.name,
      weatherMultiplier: weatherOverlay?.weatherMultiplier || 1.0,
      summary: generateOverallSummary(overallRisk, routeDiff)
    },
    basicInfo: {
      tripName: basicInfo?.tripName || '未命名出行',
      activityType: basicInfo?.activityType || 'hiking',
      date: basicInfo?.date || new Date().toISOString().split('T')[0],
      location: basicInfo?.location || '未指定',
      duration: basicInfo?.duration || 4,
      groupSize: basicInfo?.groupSize || 'small',
      participants: basicInfo?.participants || 1
    },
    riskAnalysis: {
      baseRiskScore: riskScore || 0,
      baseRiskLevel: getRiskLevel(riskScore || 0),
      weatherImpact: {
        condition: basicInfo?.weather || 'sunny',
        multiplier: weatherOverlay?.weatherMultiplier || 1.0,
        description: weatherOverlay?.weatherInfo?.description || ''
      },
      routeImpact: {
        difficulty: routeDifficulty?.score || 1,
        factor: weatherOverlay?.routeFactor || 1.0
      },
      breakdown: riskBreakdown || generateDefaultRiskBreakdown()
    },
    routeAnalysis: {
      totalScore: routeDifficulty?.normalizedScore || 1,
      level: routeDiff.name,
      levelIcon: routeDiff.icon,
      breakdown: routeBreakdown || [],
      technicalRequirements: generateTechnicalRequirements(routeDifficulty?.score || 1)
    },
    safetyMeasures: safetyMeasures || {
      emergencyPlan: false,
      firstAid: false,
      navigation: false,
      communication: false
    },
    recommendations: recommendations || generateRecommendations(overallRisk, routeDifficulty?.score || 1, basicInfo || {}),
    emergencyPreparedness: generateEmergencyPreparedness(overallRisk),
    equipmentChecklist: generateEquipmentChecklist(routeDifficulty?.score || 1, basicInfo || {}),
    conclusion: generateConclusion(overallRisk, routeDifficulty?.score || 1)
  };
}

function generateOverallSummary(riskLevel, routeDiff) {
  const riskDesc = {
    low: '风险较低，适合按计划出行',
    medium: '存在一定风险，需做好充分准备',
    high: '风险较高，建议谨慎评估后再出行',
    extreme: '风险极高，强烈建议重新考虑或改期'
  };

  return `本次出行综合风险评估为【${riskLevel.label}】，路线难度为【${routeDiff.name}】。${riskDesc[riskLevel.level] || ''}。`;
}

function generateDefaultRiskBreakdown() {
  return [
    { factor: '天气', value: 1, weight: 0.25 },
    { factor: '地形', value: 1, weight: 0.25 },
    { factor: '经验', value: 0, weight: 0.2 },
    { factor: '团队', value: 0, weight: 0.15 },
    { factor: '装备', value: 0, weight: 0.15 }
  ];
}

function generateTechnicalRequirements(difficulty) {
  if (difficulty <= 1) {
    return {
      skills: ['基础徒步能力'],
      equipment: ['舒适运动鞋', '水和零食'],
      experience: '适合所有人群'
    };
  } else if (difficulty <= 2) {
    return {
      skills: ['基本徒步技能', '简单导航'],
      equipment: ['徒步鞋', '基础装备', '1-2升水'],
      experience: '适合有基本运动能力者'
    };
  } else if (difficulty <= 3) {
    return {
      skills: ['路线判断', '基础自救'],
      equipment: ['登山鞋', '完整登山装备', '导航设备'],
      experience: '需要一定户外经验'
    };
  } else if (difficulty <= 4) {
    return {
      skills: ['复杂地形穿越', '应急处理', '导航能力'],
      equipment: ['专业登山鞋', '技术装备', '全套安全装备'],
      experience: '需要丰富户外经验'
    };
  } else {
    return {
      skills: ['专业登山技术', '绳索操作', '高级导航', '急救技能'],
      equipment: ['全套专业装备', '技术攀登装备', '卫星通讯设备'],
      experience: '仅适合专业人士'
    };
  }
}

function generateRecommendations(riskLevel, difficulty, basicInfo) {
  const recs = [];
  const altitude = basicInfo.altitude || 0;
  const temperature = basicInfo.temperature || 20;
  const duration = basicInfo.duration || 4;

  if (riskLevel.level === 'high' || riskLevel.level === 'extreme') {
    recs.push({
      priority: 'critical',
      title: '重新评估出行计划',
      content: '当前综合风险较高，建议：1) 考虑改期到天气更好的时候；2) 选择难度更低的路线；3) 由经验丰富者带队或参加专业团队。'
    });
  }

  if (difficulty >= 4) {
    recs.push({
      priority: 'high',
      title: '专业准备要求',
      content: '高难度路线需要：1) 专业技术装备；2) 相关技能训练；3) 详细路线规划；4) 提前了解救援信息。'
    });
  }

  if (altitude > 2000) {
    recs.push({
      priority: 'high',
      title: '高海拔注意事项',
      content: '注意高原反应：1) 上升速度不宜过快；2) 提前适应海拔；3) 携带抗高反药物；4) 多喝水，避免饮酒。'
    });
  }

  if (temperature < 5) {
    recs.push({
      priority: 'high',
      title: '低温环境准备',
      content: '低温环境需注意：1) 采用三层穿衣法；2) 携带保暖装备；3) 防止冻伤；4) 携带高热量食物。'
    });
  }

  if (temperature > 28) {
    recs.push({
      priority: 'medium',
      title: '高温防暑措施',
      content: '高温天气：1) 注意防暑降温；2) 增加饮水和电解质；3) 避开正午时段；4) 穿透气防晒衣物。'
    });
  }

  if (duration > 8) {
    recs.push({
      priority: 'medium',
      title: '长时间活动准备',
      content: '长时间活动：1) 合理安排休息；2) 充足的食物和水；3) 携带头灯；4) 考虑是否需要过夜装备。'
    });
  }

  recs.push({
    priority: 'low',
    title: '通用安全建议',
    content: '1) 出发前告知他人行程；2) 检查天气预报；3) 携带必要装备；4) 保持通讯畅通；5) 遵循安全规范。'
  });

  return recs;
}

function generateEmergencyPreparedness(riskLevel) {
  const baseItems = [
    { item: '急救包', required: true },
    { item: '通讯设备', required: true },
    { item: '导航设备', required: true },
    { item: '保温毯', required: true },
    { item: '哨子', required: true },
    { item: '头灯', required: true },
    { item: '紧急口粮', required: true }
  ];

  if (riskLevel.level === 'high' || riskLevel.level === 'extreme') {
    return {
      level: 'advanced',
      items: [
        ...baseItems,
        { item: '卫星定位设备', required: true },
        { item: '应急避难装备', required: true },
        { item: '完整医疗用品', required: true },
        { item: '备用电源', required: true }
      ],
      advice: '高风险出行建议配备完善的应急装备，并确保所有队员了解应急程序。'
    };
  }

  if (riskLevel.level === 'medium') {
    return {
      level: 'standard',
      items: [
        ...baseItems,
        { item: '备用电源', required: false },
        { item: '简易维修工具', required: false }
      ],
      advice: '中等风险出行应确保基础应急装备齐全，队员了解基本自救知识。'
    };
  }

  return {
    level: 'basic',
    items: baseItems,
    advice: '低风险出行也应携带基础应急物品，保持警惕。'
  };
}

function generateEquipmentChecklist(difficulty, basicInfo) {
  const categories = [
    {
      name: '着装类',
      items: [
        { name: '适合的鞋履', essential: true, note: difficulty >= 3 ? '专业登山鞋' : '舒适运动鞋' },
        { name: '速干衣裤', essential: true },
        { name: '保暖层', essential: basicInfo.temperature < 15, note: '抓绒/羽绒' },
        { name: '防风防雨外套', essential: true },
        { name: '帽子', essential: true },
        { name: '手套', essential: basicInfo.temperature < 10 }
      ]
    },
    {
      name: '背包类',
      items: [
        { name: '主背包', essential: true, note: difficulty >= 4 ? '50L以上' : '20-35L' },
        { name: '防水罩', essential: true },
        { name: '随身小包', essential: false }
      ]
    },
    {
      name: '导航通讯',
      items: [
        { name: '手机+离线地图', essential: true },
        { name: '充电宝', essential: true },
        { name: '指南针', essential: difficulty >= 3 },
        { name: '对讲机', essential: difficulty >= 4 }
      ]
    },
    {
      name: '补给类',
      items: [
        { name: '饮用水', essential: true, note: '至少1.5L/人' },
        { name: '能量食品', essential: true },
        { name: '电解质', essential: basicInfo.temperature > 25 }
      ]
    }
  ];

  return categories;
}

function generateConclusion(riskLevel, difficulty) {
  const goNoGo = riskLevel.level === 'low' || riskLevel.level === 'medium';
  const conditions = [];

  if (!goNoGo) {
    conditions.push('强烈建议重新评估出行计划，考虑改期或降低难度');
  } else if (riskLevel.level === 'medium') {
    conditions.push('可以按计划出行，但需做好充分准备');
    if (difficulty >= 3) {
      conditions.push('建议有经验者陪同');
    }
  } else {
    conditions.push('可以按计划安全出行');
  }

  conditions.push('出发前再次确认天气预报');
  conditions.push('告知他人详细行程和返回时间');
  conditions.push('保持通讯畅通，随时关注环境变化');

  return {
    goNoGo,
    goNoGoText: goNoGo ? '可以出行' : '不建议出行',
    conditions
  };
}

export function formatReportForDisplay(report) {
  return {
    ...report,
    generatedAtFormatted: new Date(report.generatedAt).toLocaleString('zh-CN'),
    dateFormatted: new Date(report.basicInfo.date).toLocaleDateString('zh-CN')
  };
}

export function exportReportAsText(report) {
  const lines = [];
  lines.push('='.repeat(60));
  lines.push('户外出行风险评估报告');
  lines.push('='.repeat(60));
  lines.push('');
  lines.push(`报告编号: ${report.id}`);
  lines.push(`生成时间: ${new Date(report.generatedAt).toLocaleString('zh-CN')}`);
  lines.push('');
  lines.push('-'.repeat(60));
  lines.push('一、基本信息');
  lines.push('-'.repeat(60));
  lines.push(`出行名称: ${report.basicInfo.tripName}`);
  lines.push(`活动类型: ${report.basicInfo.activityType}`);
  lines.push(`出行日期: ${report.basicInfo.date}`);
  lines.push(`活动地点: ${report.basicInfo.location}`);
  lines.push(`预计时长: ${report.basicInfo.duration} 小时`);
  lines.push('');
  lines.push('-'.repeat(60));
  lines.push('二、总体评估');
  lines.push('-'.repeat(60));
  lines.push(`综合风险指数: ${report.overallAssessment.riskScore}`);
  lines.push(`风险等级: ${report.overallAssessment.riskLabel}`);
  lines.push(`路线难度: ${report.overallAssessment.routeDifficultyLabel}`);
  lines.push('');
  lines.push(report.overallAssessment.summary);
  lines.push('');
  lines.push('-'.repeat(60));
  lines.push('三、建议措施');
  lines.push('-'.repeat(60));
  report.recommendations.forEach((rec, i) => {
    lines.push(`${i + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`);
    lines.push(`   ${rec.content}`);
    lines.push('');
  });
  lines.push('-'.repeat(60));
  lines.push('四、结论');
  lines.push('-'.repeat(60));
  lines.push(`出行建议: ${report.conclusion.goNoGoText}`);
  lines.push('');
  report.conclusion.conditions.forEach(cond => {
    lines.push(`- ${cond}`);
  });
  lines.push('');
  lines.push('='.repeat(60));
  lines.push('本报告仅供参考，请以实际情况和专业判断为准');
  lines.push('='.repeat(60));

  return lines.join('\n');
}

export function downloadReport(report, format = 'text') {
  let content, filename, type;

  if (format === 'json') {
    content = JSON.stringify(report, null, 2);
    filename = `risk_report_${report.id}.json`;
    type = 'application/json';
  } else {
    content = exportReportAsText(report);
    filename = `risk_report_${report.id}.txt`;
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
