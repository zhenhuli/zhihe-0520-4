<script setup>
import { ref, computed } from 'vue'
import { useAnimationStore } from '../stores/animationStore'

const store = useAnimationStore()
const exportScale = ref(4)
const isExporting = ref(false)

const spriteSheetPreview = computed(() => {
  const canvas = document.createElement('canvas')
  const totalWidth = store.canvasWidth * store.totalFrames * exportScale.value
  canvas.width = totalWidth
  canvas.height = store.canvasHeight * exportScale.value
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  store.currentFrames.forEach((frame, frameIndex) => {
    for (let y = 0; y < store.canvasHeight; y++) {
      for (let x = 0; x < store.canvasWidth; x++) {
        const color = frame.pixels[y][x]
        if (color) {
          ctx.fillStyle = color
          ctx.fillRect(
            frameIndex * store.canvasWidth * exportScale.value + x * exportScale.value,
            y * exportScale.value,
            exportScale.value,
            exportScale.value
          )
        }
      }
    }
  })

  return canvas.toDataURL('image/png')
})

function exportSpriteSheet() {
  isExporting.value = true
  
  setTimeout(() => {
    const link = document.createElement('a')
    link.download = `spritesheet_${store.currentAction}_${store.canvasWidth}x${store.canvasHeight}.png`
    link.href = spriteSheetPreview.value
    link.click()
    isExporting.value = false
  }, 100)
}

function exportAnimationConfig() {
  const config = store.generateAnimationConfig()
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.download = `animation_config.json`
  link.href = url
  link.click()
  URL.revokeObjectURL(url)
}

function exportAll() {
  isExporting.value = true
  
  Object.entries(store.actions).forEach(([actionKey, action], index) => {
    setTimeout(() => {
      const canvas = document.createElement('canvas')
      const totalWidth = store.canvasWidth * action.frames.length * exportScale.value
      canvas.width = totalWidth
      canvas.height = store.canvasHeight * exportScale.value
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false

      action.frames.forEach((frame, frameIndex) => {
        for (let y = 0; y < store.canvasHeight; y++) {
          for (let x = 0; x < store.canvasWidth; x++) {
            const color = frame.pixels[y][x]
            if (color) {
              ctx.fillStyle = color
              ctx.fillRect(
                frameIndex * store.canvasWidth * exportScale.value + x * exportScale.value,
                y * exportScale.value,
                exportScale.value,
                exportScale.value
              )
            }
          }
        }
      })

      const link = document.createElement('a')
      link.download = `spritesheet_${actionKey}_${store.canvasWidth}x${store.canvasHeight}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }, index * 500)
  })

  setTimeout(() => {
    exportAnimationConfig()
    isExporting.value = false
  }, Object.keys(store.actions).length * 500 + 200)
}
</script>

<template>
  <div class="export-panel">
    <h3 class="panel-title">导出</h3>
    
    <div class="export-preview">
      <div class="preview-label">精灵图预览 (当前动作)</div>
      <div class="spritesheet-preview-wrapper checkerboard">
        <img :src="spriteSheetPreview" alt="精灵图预览" class="spritesheet-image" />
      </div>
    </div>
    
    <div class="export-settings">
      <div class="setting-row">
        <label class="setting-label">导出缩放</label>
        <select v-model.number="exportScale" class="input">
          <option :value="1">1x (原始)</option>
          <option :value="2">2x</option>
          <option :value="4">4x</option>
          <option :value="8">8x</option>
        </select>
      </div>
      <div class="setting-info">
        原始尺寸: {{ store.canvasWidth }} x {{ store.canvasHeight }} 像素
        <br />
        导出尺寸: {{ store.canvasWidth * exportScale }} x {{ store.canvasHeight * exportScale }} 像素
      </div>
    </div>
    
    <div class="export-buttons">
      <button
        class="btn btn-secondary"
        @click="exportSpriteSheet"
        :disabled="isExporting"
      >
        📥 导出当前精灵图
      </button>
      <button
        class="btn btn-success"
        @click="exportAnimationConfig"
        :disabled="isExporting"
      >
        📄 导出动画配置
      </button>
      <button
        class="btn btn-primary"
        @click="exportAll"
        :disabled="isExporting"
      >
        📦 一键导出全部
      </button>
    </div>
    
    <div class="export-info">
      <div class="info-title">导出内容说明:</div>
      <ul class="info-list">
        <li><strong>精灵图集:</strong> PNG格式，包含所有帧的横向排列</li>
        <li><strong>动画配置:</strong> JSON格式，包含帧率、循环模式、动作列表等信息</li>
        <li><strong>一键导出:</strong> 导出所有动作的精灵图 + 完整配置文件</li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.export-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background-color: var(--bg-secondary);
}

.export-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.spritesheet-preview-wrapper {
  max-height: 120px;
  overflow-x: auto;
  overflow-y: hidden;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 8px;
}

.spritesheet-image {
  display: block;
  image-rendering: pixelated;
  max-height: 100px;
}

.export-settings {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.setting-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.setting-info {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.export-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.export-info {
  padding: 12px;
  background-color: var(--bg-tertiary);
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.info-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.8;

  li {
    padding-left: 16px;
    position: relative;

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--accent-primary);
    }

    strong {
      color: var(--text-primary);
    }
  }
}
</style>
