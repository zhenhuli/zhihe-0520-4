<script setup>
import { ref } from 'vue'
import { useAnimationStore } from '../stores/animationStore'

const store = useAnimationStore()
const showSizeModal = ref(false)
const tempWidth = ref(32)
const tempHeight = ref(32)

const colors = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ff6600', '#9900ff',
  '#663300', '#808080', '#800000', '#808000', '#008000',
  '#800080', '#008080', '#000080', '#ffa500', '#ffc0cb'
]

function openSizeModal() {
  tempWidth.value = store.canvasWidth
  tempHeight.value = store.canvasHeight
  showSizeModal.value = true
}

function applySize() {
  store.setCanvasSize(tempWidth.value, tempHeight.value)
  showSizeModal.value = false
}

function zoomIn() {
  if (store.pixelSize < 32) {
    store.pixelSize += 4
  }
}

function zoomOut() {
  if (store.pixelSize > 4) {
    store.pixelSize -= 4
  }
}
</script>

<template>
  <div class="toolbar">
    <div class="toolbar-section">
      <div class="toolbar-label">🎨 绘制工具</div>
      <div class="toolbar-buttons">
        <button
          class="tool-btn"
          :class="{ active: store.tool === 'pen' }"
          @click="store.tool = 'pen'"
          title="画笔"
        >
          <span class="btn-icon">✏️</span>
          <span class="btn-text">画笔</span>
        </button>
        <button
          class="tool-btn"
          :class="{ active: store.tool === 'eraser' }"
          @click="store.tool = 'eraser'"
          title="橡皮擦"
        >
          <span class="btn-icon">🧹</span>
          <span class="btn-text">橡皮擦</span>
        </button>
        <button
          class="tool-btn"
          @click="store.clearCurrentFrame"
          title="清空画布"
        >
          <span class="btn-icon">🗑️</span>
          <span class="btn-text">清空</span>
        </button>
      </div>
    </div>

    <div class="toolbar-section">
      <div class="toolbar-label">🎨 颜色选择</div>
      <div class="color-picker-wrapper">
        <div class="color-input-row">
          <input
            type="color"
            v-model="store.selectedColor"
            class="input color-input"
          />
          <span class="color-value">{{ store.selectedColor }}</span>
        </div>
        <div class="color-palette">
          <button
            v-for="color in colors"
            :key="color"
            class="color-swatch"
            :style="{ backgroundColor: color }"
            :class="{ active: store.selectedColor === color }"
            @click="store.selectedColor = color"
          />
        </div>
      </div>
    </div>

    <div class="toolbar-section">
      <div class="toolbar-label">🔍 画布缩放</div>
      <div class="zoom-controls">
        <button class="tool-btn zoom-btn" @click="zoomOut" title="缩小">
          ➖
        </button>
        <span class="zoom-level">{{ store.pixelSize }}x</span>
        <button class="tool-btn zoom-btn" @click="zoomIn" title="放大">
          ➕
        </button>
      </div>
      <button class="tool-btn size-btn" @click="openSizeModal" title="设置尺寸">
        <span class="btn-icon">📐</span>
        <span class="btn-text">设置画布尺寸</span>
      </button>
    </div>

    <div class="modal-overlay" v-if="showSizeModal" @click.self="showSizeModal = false">
      <div class="modal">
        <h3 class="modal-title">设置画布尺寸</h3>
        <div class="modal-body">
          <div class="form-group">
            <label>宽度 (像素)</label>
            <input type="number" v-model.number="tempWidth" min="8" max="128" class="input" />
          </div>
          <div class="form-group">
            <label>高度 (像素)</label>
            <input type="number" v-model.number="tempHeight" min="8" max="128" class="input" />
          </div>
          <div class="size-presets">
            <span class="preset-label">预设:</span>
            <button class="btn btn-secondary btn-sm" @click="tempWidth = 16; tempHeight = 16">16x16</button>
            <button class="btn btn-secondary btn-sm" @click="tempWidth = 32; tempHeight = 32">32x32</button>
            <button class="btn btn-secondary btn-sm" @click="tempWidth = 64; tempHeight = 64">64x64</button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showSizeModal = false">取消</button>
          <button class="btn btn-primary" @click="applySize">应用</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.toolbar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
  background-color: var(--bg-secondary);
  height: 100%;
  overflow-y: auto;
}

.toolbar-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);

  &:last-of-type {
    border-bottom: none;
  }
}

.toolbar-label {
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 4px;
}

.toolbar-buttons {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tool-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-tertiary);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-primary);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-primary);
    border-color: var(--accent-primary);
  }

  &.active {
    background-color: var(--accent-primary);
    border-color: var(--accent-primary);
  }
}

.btn-icon {
  font-size: 16px;
}

.btn-text {
  font-size: 13px;
}

.zoom-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.zoom-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  justify-content: center;
}

.zoom-level {
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 600;
  min-width: 50px;
  text-align: center;
}

.size-btn {
  margin-top: 8px;
  width: 100%;
  justify-content: center;
}

.color-picker-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.color-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-input {
  width: 40px;
  height: 40px;
  padding: 2px;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-tertiary);
  cursor: pointer;
}

.color-value {
  font-size: 12px;
  color: var(--text-secondary);
  font-family: monospace;
}

.color-palette {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}

.color-swatch {
  width: 100%;
  aspect-ratio: 1;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  &.active {
    border-color: var(--accent-primary);
    transform: scale(1.15);
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  min-width: 320px;
  max-width: 90vw;
}

.modal-title {
  font-size: 18px;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.modal-body {
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;

  label {
    font-size: 14px;
    color: var(--text-secondary);
  }
}

.size-presets {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 12px;
}

.preset-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.btn-sm {
  padding: 4px 10px;
  font-size: 12px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
