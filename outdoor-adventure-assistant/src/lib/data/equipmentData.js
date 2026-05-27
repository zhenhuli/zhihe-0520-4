export const equipmentDatabase = {
  clothing: {
    baseLayers: [
      { id: 'thermal_top', name: '速干排汗内衣(上)', category: 'base', weight: 150, seasons: ['all'], essential: true },
      { id: 'thermal_bottom', name: '速干排汗内衣(下)', category: 'base', weight: 120, seasons: ['all'], essential: true },
      { id: 'merino_top', name: '美利奴羊毛保暖层', category: 'base', weight: 250, seasons: ['cold'], essential: false },
      { id: 'compression', name: '压缩衣裤', category: 'base', weight: 200, seasons: ['all'], essential: false }
    ],
    midLayers: [
      { id: 'fleece', name: '抓绒衣', category: 'mid', weight: 350, seasons: ['all'], essential: true },
      { id: 'down_jacket', name: '羽绒服', category: 'mid', weight: 500, seasons: ['cold'], essential: false },
      { id: 'softshell', name: '软壳衣', category: 'mid', weight: 400, seasons: ['all'], essential: false }
    ],
    outerLayers: [
      { id: 'rain_jacket', name: '防水冲锋衣', category: 'outer', weight: 450, seasons: ['all'], essential: true },
      { id: 'rain_pants', name: '防水冲锋裤', category: 'outer', weight: 400, seasons: ['all'], essential: true },
      { id: 'down_parka', name: '厚羽绒外套', category: 'outer', weight: 800, seasons: ['extreme_cold'], essential: false },
      { id: 'wind_jacket', name: '防风衣', category: 'outer', weight: 180, seasons: ['all'], essential: false }
    ],
    accessories: [
      { id: 'hat_sun', name: '遮阳帽', category: 'accessory', weight: 80, seasons: ['warm'], essential: false },
      { id: 'hat_warm', name: '保暖帽', category: 'accessory', weight: 60, seasons: ['cold'], essential: true },
      { id: 'gloves_light', name: '轻薄手套', category: 'accessory', weight: 50, seasons: ['cool'], essential: false },
      { id: 'gloves_warm', name: '保暖手套', category: 'accessory', weight: 120, seasons: ['cold'], essential: true },
      { id: 'gloves_waterproof', name: '防水手套', category: 'accessory', weight: 150, seasons: ['cold', 'wet'], essential: false },
      { id: 'neck_gaiter', name: '脖套/魔术头巾', category: 'accessory', weight: 50, seasons: ['all'], essential: false },
      { id: 'sunglasses', name: '太阳镜', category: 'accessory', weight: 30, seasons: ['all'], essential: true },
      { id: 'gaiters', name: '雪套/防沙套', category: 'accessory', weight: 150, seasons: ['snow', 'desert'], essential: false },
      { id: 'socks_warm', name: '厚保暖袜', category: 'accessory', weight: 100, seasons: ['cold'], essential: true },
      { id: 'socks_light', name: '轻薄速干袜', category: 'accessory', weight: 60, seasons: ['all'], essential: true }
    ]
  },
  footwear: [
    { id: 'hiking_shoes', name: '徒步鞋', category: 'footwear', weight: 800, seasons: ['all'], essential: true },
    { id: 'approach_shoes', name: '接近鞋', category: 'footwear', weight: 600, seasons: ['all'], essential: false },
    { id: 'mountaineering_boots', name: '登山靴', category: 'footwear', weight: 1500, seasons: ['cold', 'snow'], essential: false },
    { id: 'sandals', name: '营地凉鞋/拖鞋', category: 'footwear', weight: 200, seasons: ['all'], essential: false },
    { id: 'crampons', name: '冰爪', category: 'footwear', weight: 900, seasons: ['snow', 'ice'], essential: false },
    { id: 'microspikes', name: '冰钉', category: 'footwear', weight: 400, seasons: ['snow'], essential: false }
  ],
  backpack: [
    { id: 'daypack', name: '单日背包(20-30L)', category: 'backpack', weight: 800, seasons: ['all'], essential: true, scenarios: ['hiking'] },
    { id: 'overnight_pack', name: '过夜背包(40-50L)', category: 'backpack', weight: 1400, seasons: ['all'], essential: true, scenarios: ['camping', 'expedition'] },
    { id: 'expedition_pack', name: '探险背包(60-80L)', category: 'backpack', weight: 2000, seasons: ['all'], essential: false, scenarios: ['mountaineering', 'expedition'] },
    { id: 'rain_cover', name: '背包防雨罩', category: 'backpack', weight: 100, seasons: ['all'], essential: true },
    { id: 'dry_bag', name: '防水袋', category: 'backpack', weight: 80, seasons: ['all'], essential: true }
  ],
  camping: [
    { id: 'tent', name: '帐篷', category: 'camping', weight: 1800, seasons: ['all'], essential: true, scenarios: ['camping', 'expedition', 'mountaineering'] },
    { id: 'sleeping_bag', name: '睡袋', category: 'camping', weight: 1200, seasons: ['all'], essential: true, scenarios: ['camping', 'expedition', 'mountaineering'] },
    { id: 'sleeping_pad', name: '防潮垫/充气垫', category: 'camping', weight: 600, seasons: ['all'], essential: true, scenarios: ['camping', 'expedition', 'mountaineering'] },
    { id: 'pillow', name: '充气枕头', category: 'camping', weight: 80, seasons: ['all'], essential: false },
    { id: 'tarp', name: '天幕/遮阳篷', category: 'camping', weight: 800, seasons: ['all'], essential: false },
    { id: 'ground_cloth', name: '地布', category: 'camping', weight: 300, seasons: ['all'], essential: false }
  ],
  navigation: [
    { id: 'map', name: '纸质地图', category: 'navigation', weight: 50, seasons: ['all'], essential: true },
    { id: 'compass', name: '指南针', category: 'navigation', weight: 60, seasons: ['all'], essential: true },
    { id: 'gps', name: 'GPS设备', category: 'navigation', weight: 200, seasons: ['all'], essential: false },
    { id: 'altimeter', name: '高度计', category: 'navigation', weight: 100, seasons: ['all'], essential: false },
    { id: 'whistle', name: '求生哨', category: 'navigation', weight: 15, seasons: ['all'], essential: true }
  ],
  lighting: [
    { id: 'headlamp', name: '头灯', category: 'lighting', weight: 100, seasons: ['all'], essential: true },
    { id: 'headlamp_batteries', name: '头灯备用电池', category: 'lighting', weight: 50, seasons: ['all'], essential: true },
    { id: 'lantern', name: '营地灯', category: 'lighting', weight: 200, seasons: ['all'], essential: false, scenarios: ['camping', 'expedition'] },
    { id: 'flashlight', name: '手电筒', category: 'lighting', weight: 150, seasons: ['all'], essential: false }
  ],
  firstAid: [
    { id: 'first_aid_kit', name: '急救包', category: 'firstaid', weight: 300, seasons: ['all'], essential: true },
    { id: 'medications', name: '个人药品', category: 'firstaid', weight: 100, seasons: ['all'], essential: true },
    { id: 'blister_kit', name: '水泡处理包', category: 'firstaid', weight: 50, seasons: ['all'], essential: true },
    { id: 'sunscreen', name: '防晒霜', category: 'firstaid', weight: 150, seasons: ['all'], essential: true },
    { id: 'lip_balm', name: '润唇膏', category: 'firstaid', weight: 20, seasons: ['all'], essential: true },
    { id: 'insect_repellent', name: '防虫喷雾', category: 'firstaid', weight: 150, seasons: ['warm'], essential: false }
  ],
  hydration: [
    { id: 'water_bottle_1l', name: '水瓶(1L)', category: 'hydration', weight: 200, seasons: ['all'], essential: true, quantity: 2 },
    { id: 'water_bladder', name: '水袋(2-3L)', category: 'hydration', weight: 150, seasons: ['all'], essential: false },
    { id: 'water_filter', name: '净水器/净水片', category: 'hydration', weight: 100, seasons: ['all'], essential: false, scenarios: ['expedition', 'camping'] },
    { id: 'thermos', name: '保温壶', category: 'hydration', weight: 500, seasons: ['cold'], essential: false }
  ],
  food: [
    { id: 'emergency_food', name: '应急食品', category: 'food', weight: 200, seasons: ['all'], essential: true },
    { id: 'trail_snacks', name: '路餐/零食', category: 'food', weight: 300, seasons: ['all'], essential: true },
    { id: 'meals', name: '正餐', category: 'food', weight: 500, seasons: ['all'], essential: false, scenarios: ['camping', 'expedition'] },
    { id: 'stove', name: '炉具', category: 'food', weight: 300, seasons: ['all'], essential: false, scenarios: ['camping', 'expedition', 'mountaineering'] },
    { id: 'fuel', name: '燃料', category: 'food', weight: 200, seasons: ['all'], essential: false, scenarios: ['camping', 'expedition', 'mountaineering'] },
    { id: 'cookware', name: '锅具/餐具', category: 'food', weight: 300, seasons: ['all'], essential: false, scenarios: ['camping', 'expedition'] }
  ],
  tools: [
    { id: 'knife', name: '多功能刀', category: 'tools', weight: 150, seasons: ['all'], essential: true },
    { id: 'multi_tool', name: '多功能工具钳', category: 'tools', weight: 250, seasons: ['all'], essential: false },
    { id: 'trekking_poles', name: '登山杖', category: 'tools', weight: 500, seasons: ['all'], essential: false },
    { id: 'rope', name: '辅绳(5mm/6mm)', category: 'tools', weight: 200, seasons: ['all'], essential: false, scenarios: ['mountaineering', 'expedition'] },
    { id: 'carabiner', name: '主锁/快挂', category: 'tools', weight: 100, seasons: ['all'], essential: false, scenarios: ['mountaineering'] },
    { id: 'harness', name: '安全带', category: 'tools', weight: 400, seasons: ['all'], essential: false, scenarios: ['mountaineering'] },
    { id: 'helmet', name: '头盔', category: 'tools', weight: 350, seasons: ['all'], essential: false, scenarios: ['mountaineering'] },
    { id: 'ice_axe', name: '冰镐', category: 'tools', weight: 500, seasons: ['snow', 'ice'], essential: false, scenarios: ['mountaineering'] },
    { id: 'repair_kit', name: '修补工具包', category: 'tools', weight: 100, seasons: ['all'], essential: false },
    { id: 'duct_tape', name: '胶带', category: 'tools', weight: 50, seasons: ['all'], essential: false }
  ],
  communication: [
    { id: 'phone', name: '手机', category: 'communication', weight: 200, seasons: ['all'], essential: true },
    { id: 'power_bank', name: '充电宝', category: 'communication', weight: 200, seasons: ['all'], essential: true },
    { id: 'walkie_talkie', name: '对讲机', category: 'communication', weight: 300, seasons: ['all'], essential: false },
    { id: 'satellite_messenger', name: '卫星通讯器', category: 'communication', weight: 200, seasons: ['all'], essential: false, scenarios: ['expedition', 'mountaineering'] },
    { id: 'plb', name: '个人定位信标', category: 'communication', weight: 150, seasons: ['all'], essential: false, scenarios: ['expedition', 'mountaineering'] }
  ],
  hygiene: [
    { id: 'trowel', name: '挖猫砂铲', category: 'hygiene', weight: 100, seasons: ['all'], essential: false },
    { id: 'toilet_paper', name: '卫生纸', category: 'hygiene', weight: 50, seasons: ['all'], essential: false },
    { id: 'hand_sanitizer', name: '洗手液', category: 'hygiene', weight: 80, seasons: ['all'], essential: true },
    { id: 'towel', name: '速干毛巾', category: 'hygiene', weight: 100, seasons: ['all'], essential: false },
    { id: 'trash_bag', name: '垃圾袋', category: 'hygiene', weight: 30, seasons: ['all'], essential: true }
  ],
  documents: [
    { id: 'id_card', name: '身份证件', category: 'documents', weight: 30, seasons: ['all'], essential: true },
    { id: 'insurance', name: '保险信息', category: 'documents', weight: 10, seasons: ['all'], essential: true },
    { id: 'emergency_contact', name: '紧急联系人信息', category: 'documents', weight: 10, seasons: ['all'], essential: true },
    { id: 'permit', name: '进山许可/通行证', category: 'documents', weight: 20, seasons: ['all'], essential: false }
  ]
};