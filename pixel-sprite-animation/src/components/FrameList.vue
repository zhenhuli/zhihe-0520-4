<script setup>
import { ref } from 'vue'
import { useAnimationStore } from '../stores/animationStore'

const store = useAnimationStore()
const dragIndex = ref(-1)

function getFrameThumbnail(frame) {
  const canvas = document.createElement('canvas')
  canvas.width = store.canvasWidth
  canvas.height = store.canvasHeight
  const ctx = canvas.getContext('2d')
  
  for (let y = 0; y < store.canvasHeight; y++) {
    for (let x = 0; x < store.canvasWidth; x++) {
      const color = frame.pixels[y][x]
      if (color) {
        ctx.fillStyle = color
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }
  
  return canvas.toDataURL('image/png')
}

function handleDragStart(e, index) {
  dragIndex.value = index
  e.dataTransfer.effectAllowed = 'move'
}

function handleDragOver(e) {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
}

function handleDrop(e, index) {
  e.preventDefault()
  if (dragIndex.value !== -1 && dragIndex.value !== index) {
    store.moveFrame(dragIndex.value, index)
  }
  dragIndex.value = -1
}

function handleDragEnd() {
  dragIndex.value = -1
}
</script>

<template>
  <div class="frame-list">
    <div class="frame-list-header">
      <h3 class="panel-title">帧列表</h3>
      <div class="frame-actions">
        <button class="btn btn-primary btn-sm" @click="store.addFrame">
          ➕ 添加帧
        </button>
      </div>
    </div>
    
    <div class="frames-container">
      <div
        v-for="(frame, index) in store.currentFrames"
        :key="frame.id"
        class="frame-item"
        :class="{ active: index === store.currentFrameIndex, dragging: dragIndex === index }"
        draggable="true"
        @dragstart="handleDragStart($event, index)"
        @dragover="handleDragOver"
        @drop="handleDrop($event, index)"
        @dragend="handleDragEnd"
        @click="store.currentFrameIndex = index"
      >
        <div class="frame-thumbnail checkerboard">
          <img :src="getFrameThumbnail(frame)" alt="帧预览" />
        </div>
        <div class="frame-info">
          <span class="frame-number">帧 {{ index + 1 }}</span>
          <div class="frame-controls">
            <button
              class="frame-control-btn"
              @click.stop="store.duplicateFrame(index)"
              title="复制帧"
            >
              📋
            </button>
            <button
              class="frame-control-btn"
              @click.stop="store.deleteFrame(index)"
              :disabled="store.currentFrames.length <= 1"
              title="删除帧"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="frame-list-footer">
      <span class="frame-count">共 {{ store.totalFrames }} 帧</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.frame-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--bg-secondary);
  border-left: 1px solid var(--border-color);
}

.frame-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

.frame-actions {
  display: flex;
  gap: 8px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.frames-container {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.frame-item {
  display: flex;
  gap: 12px;
  padding: 10px;
  background-color: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--accent-primary);
  }

  &.active {
    border-color: var(--accent-primary);
    background-color: rgba(233, 69, 96, 0.1);
  }

  &.dragging {
    opacity: 0.5;
  }
}

.frame-thumbnail {
  width: 64px;
  height: 64px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
  }
}

.frame-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.frame-number {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.frame-controls {
  display: flex;
  gap: 6px;
}

.frame-control-btn {
  width: 28px;
  height: 28px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-primary);
    border-color: var(--accent-primary);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.frame-list-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
}

.frame-count {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
