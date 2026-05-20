export const ENVELOPE_SIZES = {
  'C4': {
    name: 'C4 (A4)',
    width: 229,
    height: 324,
    flapHeight: 100,
    description: '适用于A4纸张，大型文件信封'
  },
  'C5': {
    name: 'C5 (A5)',
    width: 162,
    height: 229,
    flapHeight: 70,
    description: '适用于A5纸张，标准商务信封'
  },
  'C6': {
    name: 'C6 (A6)',
    width: 114,
    height: 162,
    flapHeight: 50,
    description: '适用于A6纸张，贺卡请柬信封'
  },
  'DL': {
    name: 'DL',
    width: 110,
    height: 220,
    flapHeight: 55,
    description: '标准商务信封，适用于三折A4'
  },
  'Square': {
    name: '方形',
    width: 155,
    height: 155,
    flapHeight: 55,
    description: '方形信封，贺卡邀请函'
  }
}

export const FOLD_STEPS = [
  { id: 0, name: '平面展开', description: '信封平铺纸张状态' },
  { id: 1, name: '折叠左侧', description: '将左侧翼向内折叠' },
  { id: 2, name: '折叠右侧', description: '将右侧翼向内折叠' },
  { id: 3, name: '折叠底部', description: '将底部向上折叠并粘贴' },
  { id: 4, name: '折叠顶部', description: '将顶部封盖向下折叠' },
  { id: 5, name: '完成', description: '信封折叠完成，可打开封盖' }
]
