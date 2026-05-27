export const emergencyScenarios = [
  {
    id: 'injury',
    name: '人员受伤',
    icon: '🩹',
    category: 'medical',
    severity: 'high',
    triggers: ['fall', 'collision', 'equipment_failure'],
    description: '徒步或登山过程中发生摔倒、扭伤、割伤等伤害'
  },
  {
    id: 'lost',
    name: '迷路走失',
    icon: '🧭',
    category: 'navigation',
    severity: 'high',
    triggers: ['fog', 'heavy_rain', 'night_fall', 'no_trail'],
    description: '在复杂地形或恶劣天气中迷失方向'
  },
  {
    id: 'weather_emergency',
    name: '天气突变',
    icon: '⛈️',
    category: 'weather',
    severity: 'high',
    triggers: ['thunderstorm', 'sudden_snow', 'heavy_rain', 'strong_wind'],
    description: '天气突然恶化，可能危及安全'
  },
  {
    id: 'hypothermia',
    name: '失温风险',
    icon: '❄️',
    category: 'medical',
    severity: 'critical',
    triggers: ['cold', 'wet', 'wind', 'exhaustion'],
    description: '核心体温下降，可能危及生命'
  },
  {
    id: 'heat_stroke',
    name: '中暑风险',
    icon: '🌡️',
    category: 'medical',
    severity: 'critical',
    triggers: ['high_temp', 'high_humidity', 'strenuous_activity', 'dehydration'],
    description: '高温环境下体温调节失衡'
  },
  {
    id: 'dehydration',
    name: '严重脱水',
    icon: '💧',
    category: 'medical',
    severity: 'medium',
    triggers: ['insufficient_water', 'high_temp', 'strenuous_activity'],
    description: '身体水分严重不足'
  },
  {
    id: 'animal_encounter',
    name: '野生动物遭遇',
    icon: '🐻',
    category: 'wildlife',
    severity: 'medium',
    triggers: ['surprise_encounter', 'protecting_young', 'food_attraction'],
    description: '遭遇具有潜在危险的野生动物'
  },
  {
    id: 'equipment_failure',
    name: '装备故障',
    icon: '🔧',
    category: 'equipment',
    severity: 'medium',
    triggers: ['breakage', 'loss', 'malfunction'],
    description: '关键装备损坏或丢失'
  },
  {
    id: 'altitude_sickness',
    name: '高原反应',
    icon: '🗻',
    category: 'medical',
    severity: 'high',
    triggers: ['rapid_ascent', 'high_altitude', 'overexertion'],
    description: '快速上升到高海拔地区引发的身体不适'
  },
  {
    id: 'exhaustion',
    name: '体力透支',
    icon: '😓',
    category: 'fitness',
    severity: 'medium',
    triggers: ['overexertion', 'insufficient_rest', 'poor_nutrition'],
    description: '身体极度疲劳，无法继续前进'
  },
  {
    id: 'flash_flood',
    name: '山洪暴发',
    icon: '🌊',
    category: 'weather',
    severity: 'critical',
    triggers: ['heavy_rain', 'canyon', 'narrow_valley'],
    description: '在峡谷或河谷地区遭遇突发洪水'
  },
  {
    id: 'communication_loss',
    name: '通讯中断',
    icon: '📵',
    category: 'navigation',
    severity: 'medium',
    triggers: ['battery_dead', 'no_signal', 'equipment_lost'],
    description: '无法与外界或队友取得联系'
  }
];

export const emergencyProcedureSteps = {
  injury: {
    immediate: [
      '确保现场安全，避免二次伤害',
      '让伤者平卧，保持安静',
      '检查意识、呼吸和脉搏',
      '控制出血，使用干净敷料加压止血'
    ],
    assessment: [
      '评估伤害类型和严重程度',
      '检查是否有骨折或脱位',
      '询问伤者疼痛位置和程度',
      '检查是否有其他并发症'
    ],
    treatment: [
      '清洗和消毒伤口（如有）',
      '使用绷带包扎固定',
      '扭伤部位冰敷并抬高',
      '骨折部位使用夹板固定'
    ],
    evacuation: [
      '轻微伤害：简单处理后可继续或下撤',
      '严重伤害：立即寻求救援',
      '保持伤者体温，防止失温',
      '安排专人陪伴伤者'
    ]
  },
  lost: {
    immediate: [
      '立即停止前进，原地待命',
      '保持冷静，不要惊慌',
      '检查是否还有手机信号',
      '召集所有队员，清点人数'
    ],
    assessment: [
      '回忆最后已知位置',
      '检查地图和导航设备',
      '观察周围地形特征',
      '听声音辨别方向'
    ],
    self_rescue: [
      '如确定方向，沿等高线横移寻找路径',
      '沿河流下游走（通常有人烟）',
      '沿途留下明显标记',
      '定期发声呼喊'
    ],
    stay_and_wait: [
      '无法确定方向时原地等待',
      '搭建简易庇护所',
      '生火发出信号（安全情况下）',
      '使用反光物或亮色衣物发出信号'
    ]
  },
  weather_emergency: {
    immediate: [
      '立即寻找安全避难处',
      '远离高地、孤立树木、水域',
      '穿上雨衣和保暖衣物',
      '收好装备，防止淋湿'
    ],
    thunderstorm: [
      '避免在开阔地带停留',
      '远离山顶、山脊线',
      '蹲低身体，双脚并拢',
      '不要使用金属物品'
    ],
    heavy_rain: [
      '注意山洪风险，远离河谷',
      '保持体温，防止失温',
      '检查路径是否被冲毁',
      '考虑是否需要下撤'
    ],
    after_storm: [
      '等待天气完全稳定',
      '评估路线安全性',
      '检查装备是否完好',
      '决定继续前进或返回'
    ]
  },
  hypothermia: {
    immediate: [
      '立即转移到温暖避风处',
      '脱去湿衣物，换上干衣物',
      '用睡袋或保温毯包裹',
      '让患者保持清醒'
    ],
    warming: [
      '在核心部位（颈部、腋下、腹股沟）放置暖袋',
      '提供温热甜饮料（不含酒精）',
      '提供高热量食物',
      '避免直接火烤或热水澡'
    ],
    monitoring: [
      '持续监测体温和意识状态',
      '观察是否有颤抖停止（严重征兆）',
      '检查呼吸和脉搏',
      '记录症状变化'
    ],
    evacuation: [
      '中度以上失温立即寻求救援',
      '运送时保持水平体位',
      '避免剧烈移动',
      '持续保温措施'
    ]
  },
  heat_stroke: {
    immediate: [
      '立即转移到阴凉通风处',
      '让患者平躺，抬高双脚',
      '脱去多余衣物',
      '保持呼吸道通畅'
    ],
    cooling: [
      '用冷水喷洒或湿毛巾擦拭身体',
      '扇风加速蒸发降温',
      '在颈部、腋下、腹股沟放置冰袋',
      '体温降到38°C以下可停止'
    ],
    hydration: [
      '清醒时可少量多次饮用凉水',
      '补充电解质饮料',
      '避免大量快速饮水',
      '意识不清时不要强行喂水'
    ],
    evacuation: [
      '严重中暑立即呼叫急救',
      '持续监测体温和意识',
      '观察是否有抽搐或昏迷',
      '记录发病时间和症状'
    ]
  },
  dehydration: {
    immediate: [
      '停止活动，在阴凉处休息',
      '少量多次饮水，不要暴饮',
      '补充电解质（盐水或运动饮料）',
      '解开衣物，帮助散热'
    ],
    assessment: [
      '检查脱水程度（口渴、尿量、精神状态）',
      '观察是否有头晕、乏力、恶心',
      '检查皮肤弹性和黏膜湿润度',
      '监测心率变化'
    ],
    prevention: [
      '制定饮水计划，定时补充',
      '高温环境增加饮水量',
      '活动前充分补水',
      '携带足够的水和电解质'
    ],
    severe: [
      '严重脱水（意识改变）需急救',
      '考虑静脉补液',
      '监测生命体征',
      '及时下撤就医'
    ]
  },
  animal_encounter: {
    immediate: [
      '保持冷静，不要突然移动',
      '与动物保持安全距离',
      '不要直视动物眼睛（某些动物视为挑衅）',
      '慢慢后退，不要转身逃跑'
    ],
    defense: [
      '让自己看起来更大（张开手臂、举起背包）',
      '制造噪音，大声说话',
      '准备使用防熊喷雾等装备',
      '保护颈部和咽喉等要害部位'
    ],
    bear_specific: [
      '黑熊：尝试吓退，必要时装死',
      '棕熊/灰熊：通常装死（面部朝下，双手护颈）',
      '攻击性攻击：全力反击',
      '始终随身携带防熊喷雾'
    ],
    post_encounter: [
      '确认安全后再移动',
      '改变路线避开该区域',
      '报告给相关管理部门',
      '检查是否有人受伤'
    ]
  },
  equipment_failure: {
    immediate: [
      '评估故障对安全的影响',
      '清点现有可用装备',
      '考虑是否有替代方案',
      '评估是否需要终止行程'
    ],
    repair: [
      '使用随身工具进行临时修复',
      '利用现有材料 improvising',
      '队友之间共享装备',
      '优先保障安全装备'
    ],
    critical_failure: [
      '关键装备（冰爪、绳索）损坏需谨慎',
      '高风险环境下考虑下撤',
      '降低活动难度和风险',
      '重新评估路线可行性'
    ],
    prevention: [
      '出发前检查所有装备',
      '携带基本维修工具',
      '重要装备考虑备份',
      '了解装备使用和维护知识'
    ]
  },
  altitude_sickness: {
    immediate: [
      '立即停止上升',
      '休息并补充水分',
      '监测症状变化',
      '避免剧烈活动'
    ],
    mild_symptoms: [
      'AMS（头痛、恶心、失眠）：原地适应',
      '多喝水，补充电解质',
      '服用止痛药（如布洛芬）',
      '可在同一海拔继续观察'
    ],
    severe_symptoms: [
      'HAPE（肺水肿）或HACE（脑水肿）：立即下撤',
      '下撤高度至少500-1000米',
      '如有氧气立即使用',
      '寻求医疗援助'
    ],
    prevention: [
      '循序渐进，不要快速上升',
      '高海拔前适应1-2天',
      '多喝水，少喝酒',
      '注意识别早期症状'
    ]
  },
  exhaustion: {
    immediate: [
      '立即停止活动休息',
      '寻找阴凉舒适的地方',
      '补充水和食物',
      '抬高双腿促进血液回流'
    ],
    recovery: [
      '休息至少20-30分钟',
      '少量多次进食易消化食物',
      '保持温暖，避免着凉',
      '评估体力恢复情况'
    ],
    decision: [
      '轻度疲劳：休息后可继续，但降低强度',
      '中度疲劳：考虑缩短行程或改路线',
      '严重疲劳：立即下撤或扎营休息',
      '不要勉强继续，安全第一'
    ],
    prevention: [
      '合理规划行程，预留充足时间',
      '定时休息，合理分配体力',
      '保持良好营养和水分',
      '了解自身体能极限'
    ]
  },
  flash_flood: {
    immediate: [
      '立即向高处转移',
      '不要试图涉水过河',
      '远离河谷、溪流底部',
      '寻找稳固的高地避险'
    ],
    during_flood: [
      '保持在安全位置等待',
      '注意观察水位变化',
      '保存体力，不要盲目行动',
      '发出求救信号'
    ],
    crossing_danger: [
      '水位过膝不要尝试渡河',
      '水流湍急不要渡河',
      '夜间不要渡河',
      '寻找替代路线或等待'
    ],
    prevention: [
      '出发前查看天气预报',
      '避免在峡谷地区雨天露营',
      '了解历史洪水情况',
      '选择高处扎营'
    ]
  },
  communication_loss: {
    immediate: [
      '检查设备是否正常工作',
      '尝试更换电池或充电',
      '移动到开阔高地尝试接收信号',
      '与队友确认是否有通讯设备'
    ],
    alternatives: [
      '使用对讲机（如果有）',
      '准备哨子等声音信号设备',
      '学习基本手语信号',
      '约定集合点和等待时间'
    ],
    emergency_signal: [
      '三声哨响或呼喊（国际求救信号）',
      '使用镜子或反光物发出信号',
      '地面摆SOS字样（开阔地）',
      '生三堆火（三角形排列）'
    ],
    prevention: [
      '出发前检查通讯设备',
      '携带备用电源',
      '告知他人详细行程',
      '准备多种通讯方式'
    ]
  }
};

export const emergencyKitItems = [
  { category: '医疗急救', items: [
    { name: '急救包', essential: true },
    { name: '止血带', essential: true },
    { name: '消毒棉片/碘伏', essential: true },
    { name: '各种规格创可贴', essential: true },
    { name: '纱布和绷带', essential: true },
    { name: '医用胶带', essential: true },
    { name: '镊子', essential: true },
    { name: '剪刀', essential: true },
    { name: '止痛药（布洛芬/对乙酰氨基酚）', essential: true },
    { name: '抗过敏药', essential: false },
    { name: '腹泻药', essential: false },
    { name: '防晒霜', essential: true },
    { name: '润唇膏', essential: false }
  ]},
  { category: '导航通讯', items: [
    { name: '手机（充满电）', essential: true },
    { name: '充电宝', essential: true },
    { name: '离线地图', essential: true },
    { name: '指南针', essential: true },
    { name: '纸质地图', essential: false },
    { name: '对讲机', essential: false },
    { name: '哨子', essential: true }
  ]},
  { category: '保暖庇护', items: [
    { name: '急救保温毯', essential: true },
    { name: '雨衣', essential: true },
    { name: '备用保暖衣物', essential: true },
    { name: '帽子和手套', essential: false },
    { name: '简易应急帐篷', essential: false }
  ]},
  { category: '工具装备', items: [
    { name: '多功能刀具', essential: true },
    { name: '头灯/手电筒', essential: true },
    { name: '备用电池', essential: true },
    { name: '打火石/打火机', essential: true },
    { name: '绳索', essential: false },
    { name: '防水袋', essential: false },
    { name: ' duct tape（万能胶带）', essential: false }
  ]},
  { category: '能量补给', items: [
    { name: '紧急口粮（能量棒）', essential: true },
    { name: '足够的饮用水', essential: true },
    { name: '电解质片/粉', essential: true },
    { name: '高热量零食', essential: false }
  ]},
  { category: '个人防护', items: [
    { name: '太阳镜', essential: false },
    { name: '防熊喷雾（如适用）', essential: false },
    { name: '个人常用药品', essential: false }
  ]}
];

export const emergencyContacts = {
  china: [
    { name: '紧急救援电话', number: '110', description: '公安报警' },
    { name: '消防救援', number: '119', description: '消防及山地救援' },
    { name: '医疗急救', number: '120', description: '医疗急救' },
    { name: '蓝天救援队', number: '400-600-9958', description: '民间专业救援' },
    { name: '绿野救援队', number: '13901019400', description: '户外救援' }
  ],
  international: [
    { name: '国际紧急救援中心', number: '+86-10-64629129', description: '国际SOS' },
    { name: '全球紧急救援', number: '112', description: '欧盟及多国通用' },
    { name: '美国紧急电话', number: '911', description: '美国/加拿大' },
    { name: '欧盟紧急电话', number: '112', description: '欧盟国家' }
  ]
};

export function getEmergencyPlan(scenarioId) {
  return {
    scenario: emergencyScenarios.find(s => s.id === scenarioId),
    procedures: emergencyProcedureSteps[scenarioId] || null
  };
}

export function getRelevantScenarios(params) {
  const { riskLevel, altitude, temperature, duration, terrain, weather } = params;
  const relevant = [];

  if (riskLevel === 'high' || riskLevel === 'extreme') {
    relevant.push('injury', 'equipment_failure', 'exhaustion');
  }

  if (altitude > 2500) {
    relevant.push('altitude_sickness');
  }

  if (temperature < 5) {
    relevant.push('hypothermia');
  }

  if (temperature > 28) {
    relevant.push('heat_stroke', 'dehydration');
  }

  if (duration > 8) {
    relevant.push('exhaustion', 'dehydration');
  }

  if (terrain === 'rocky' || terrain === 'steep' || terrain === 'glacier') {
    relevant.push('injury', 'lost', 'equipment_failure');
  }

  if (weather === 'rainy' || weather === 'thunderstorm') {
    relevant.push('weather_emergency', 'flash_flood', 'hypothermia');
  }

  if (weather === 'foggy') {
    relevant.push('lost');
  }

  return [...new Set(relevant)].map(id => emergencyScenarios.find(s => s.id === id)).filter(Boolean);
}

export function getSeverityColor(severity) {
  switch (severity) {
    case 'critical': return '#ef4444';
    case 'high': return '#f97316';
    case 'medium': return '#eab308';
    case 'low': return '#22c55e';
    default: return '#64748b';
  }
}

export function getCategoryIcon(category) {
  const icons = {
    medical: '🏥',
    navigation: '🧭',
    weather: '🌤️',
    wildlife: '🐾',
    equipment: '🎒',
    fitness: '💪'
  };
  return icons[category] || '⚠️';
}
