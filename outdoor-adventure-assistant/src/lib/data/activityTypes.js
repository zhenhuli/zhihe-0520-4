export const activityTypes = [
  {
    id: 'hiking',
    name: '徒步',
    icon: '🥾',
    description: '日间徒步、郊山健行',
    baseRisk: 'low',
    typicalDuration: '1-8小时'
  },
  {
    id: 'mountaineering',
    name: '登山',
    icon: '⛰️',
    description: '高海拔登山、技术攀登',
    baseRisk: 'high',
    typicalDuration: '数天'
  },
  {
    id: 'camping',
    name: '露营',
    icon: '⛺',
    description: '野外露营、过夜停留',
    baseRisk: 'medium',
    typicalDuration: '1-3天'
  },
  {
    id: 'expedition',
    name: '野外探险',
    icon: '🧭',
    description: '无人区穿越、多日探险',
    baseRisk: 'high',
    typicalDuration: '数天至数周'
  }
];