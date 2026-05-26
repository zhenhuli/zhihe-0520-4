export const fireScenes = [
  {
    id: 'paper',
    name: '纸张起火',
    icon: '📄',
    description: '普通固体可燃物火灾',
    category: 'A类火灾',
    suitableExtinguishers: ['powder', 'water', 'co2'],
    riskIfWrong: {
      none: '火势蔓延，引燃周围物品'
    },
    background: '#fff3cd'
  },
  {
    id: 'oil',
    name: '油锅起火',
    icon: '🍳',
    description: '液体或可熔化固体火灾',
    category: 'B类火灾',
    suitableExtinguishers: ['powder', 'co2'],
    unsuitableExtinguishers: ['water'],
    riskIfWrong: {
      water: '水遇高温油会爆溅，造成火势扩大和人员烫伤！'
    },
    background: '#f8d7da'
  },
  {
    id: 'gas',
    name: '燃气泄漏起火',
    icon: '🔥',
    description: '气体火灾',
    category: 'C类火灾',
    suitableExtinguishers: ['powder', 'co2'],
    unsuitableExtinguishers: ['water'],
    riskIfWrong: {
      water: '水无法扑灭气体火灾，可能导致燃气积聚引发爆炸！'
    },
    background: '#f8d7da'
  },
  {
    id: 'electrical',
    name: '电器设备起火',
    icon: '🔌',
    description: '带电设备火灾',
    category: 'E类火灾',
    suitableExtinguishers: ['co2', 'powder'],
    unsuitableExtinguishers: ['water'],
    riskIfWrong: {
      water: '用水扑救会导致触电危险，造成人员伤亡！'
    },
    background: '#d1ecf1'
  },
  {
    id: 'metal',
    name: '金属火灾',
    icon: '⚙️',
    description: '活泼金属火灾（如钾、钠、镁等）',
    category: 'D类火灾',
    suitableExtinguishers: ['powder'],
    unsuitableExtinguishers: ['water', 'co2'],
    riskIfWrong: {
      water: '水与活泼金属反应会产生氢气，引发爆炸！',
      co2: '二氧化碳会与某些金属反应，加剧燃烧！'
    },
    background: '#e2e3e5'
  },
  {
    id: 'kitchen',
    name: '厨房烹饪起火',
    icon: '👨‍🍳',
    description: '烹饪器具内的烹饪物火灾',
    category: 'F类火灾',
    suitableExtinguishers: ['powder'],
    unsuitableExtinguishers: ['water', 'co2'],
    riskIfWrong: {
      water: '水会使热油飞溅，扩大火势！',
      co2: '二氧化碳效果不佳，且可能将油脂吹出！'
    },
    background: '#ffeeba'
  }
];

export const extinguishers = [
  {
    id: 'powder',
    name: '干粉灭火器',
    icon: '🔴',
    color: '#dc3545',
    description: '适用于A、B、C、E类火灾',
    features: [
      '灭火速度快',
      '适用范围广',
      '可扑救带电设备火灾',
      '不导电'
    ],
    usage: [
      { step: 1, text: '提起灭火器，上下摇晃几次', detail: '使筒内干粉松动' },
      { step: 2, text: '拔掉保险销', detail: '握住喷管中部，不能握住喷管底部' },
      { step: 3, text: '在距离火源2-3米处', detail: '站在上风方向' },
      { step: 4, text: '对准火焰根部扫射', detail: '由近及远，快速推进' }
    ]
  },
  {
    id: 'water',
    name: '水基灭火器',
    icon: '🔵',
    color: '#0d6efd',
    description: '适用于A类火灾',
    features: [
      '冷却效果好',
      '对固体火灾效果佳',
      '清洁环保',
      '容易复燃'
    ],
    usage: [
      { step: 1, text: '提起灭火器', detail: '检查压力表是否正常' },
      { step: 2, text: '拔掉保险销', detail: '握住喷枪' },
      { step: 3, text: '在距离火源3-5米处', detail: '站在上风位置' },
      { step: 4, text: '对准燃烧物喷射', detail: '由下向上，覆盖燃烧面' }
    ]
  },
  {
    id: 'co2',
    name: '二氧化碳灭火器',
    icon: '⚫',
    color: '#212529',
    description: '适用于B、C、E类火灾',
    features: [
      '无残留污染',
      '适用于精密仪器',
      '不导电',
      '注意防冻伤'
    ],
    usage: [
      { step: 1, text: '提起灭火器', detail: '注意不要颠倒' },
      { step: 2, text: '拔掉保险销', detail: '握住喇叭筒根部的手柄' },
      { step: 3, text: '在距离火源1.5-2米处', detail: '站在上风方向' },
      { step: 4, text: '对准火焰根部喷射', detail: '注意防止冻伤，密闭空间注意通风' }
    ]
  }
];
