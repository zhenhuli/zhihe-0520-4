<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useAnimationStore } from '../stores/animationStore'

const store = useAnimationStore()
const previewFrameIndex = ref(0)
const animationInterval = ref(null)
const isPreviewPlaying = ref(false)
const previewAction = ref('all')

const actionList = computed(() => [
  { key: 'all', name: '全部动作' },
  ...Object.entries(store.actions).map(([key, action]) => ({
    key,
    name: action.name
  }))
])

const allFrames = computed(() => {
  if (previewAction.value === 'all') {
    const frames = []
    Object.entries(store.actions).forEach(([actionKey, action]) => {
      action.frames.forEach(frame => {
        frames.push({ ...frame, action: actionKey })
      })
    })
    return frames
  }
  return store.actions[previewAction.value]?.frames || []
})

const currentPreviewFrame = computed(() => allFrames.value[previewFrameIndex.value] || null)

function startPreview() {
  if (allFrames.value.length === 0) return
  
  isPreviewPlaying.value = true
  store.isPlaying = true
  previewFrameIndex.value = 0
  
  const frameDuration = 1000 / store.fps
  animationInterval.value = setInterval(() => {
    previewFrameIndex.value++
    if (previewFrameIndex.value >= allFrames.value.length) {
      if (store.loopMode === 'loop') {
        previewFrameIndex.value = 0
      } else if (store.loopMode === 'once') {
        stopPreview()
      } else if (store.loopMode === 'pingpong') {
        previewFrameIndex.value = allFrames.value.length - 2
      }
    }
  }, frameDuration)
}

function stopPreview() {
  isPreviewPlaying.value = false
  store.isPlaying = false
  if (animationInterval.value) {
    clearInterval(animationInterval.value)
    animationInterval.value = null
  }
}

function togglePreview() {
  if (isPreviewPlaying.value) {
    stopPreview()
  } else {
    startPreview()
  }
}

function prevFrame() {
  stopPreview()
  if (previewFrameIndex.value > 0) {
    previewFrameIndex.value--
  } else {
    previewFrameIndex.value = allFrames.value.length - 1
  }
}

function nextFrame() {
  stopPreview()
  if (previewFrameIndex.value < allFrames.value.length - 1) {
    previewFrameIndex.value++
  } else {
    previewFrameIndex.value = 0
  }
}

function getFrameThumbnail(frame) {
  if (!frame) return ''
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

watch(previewAction, () => {
  stopPreview()
  previewFrameIndex.value = 0
})

watch(() => store.fps, () => {
  if (isPreviewPlaying.value) {
    stopPreview()
    startPreview()
  }
})

onUnmounted(() => {
  stopPreview()
})
</script>

<template>
  <div class="animation-player">
    <div class="player-header">
      <h3 class="panel-title">动画预览</h3>
      <select v-model="previewAction" class="input action-select">
        <option v-for="action in actionList" :key="action.key" :value="action.key">
          {{ action.name }}
        </option>
      </select>
    </div>
    
    <div class="preview-container">
      <div class="preview-canvas-wrapper checkerboard">
        <img
          v-if="currentPreviewFrame"
          :src="getFrameThumbnail(currentPreviewFrame)"
          alt="预览帧"
          class="preview-image"
        />
        <div v-else class="empty-preview">
          <span>暂无帧数据</span>
        </div>
      </div>
      
      <div class="frame-indicator">
        {{ previewFrameIndex + 1 }} / {{ allFrames.length }}
      </div>
    </div>
    
    <div class="player-controls">
      <button class="control-btn" @click="prevFrame" title="上一帧">
        ⏮️
      </button>
      <button class="control-btn play-btn" @click="togglePreview">
        {{ isPreviewPlaying ? '⏸️' : '▶️' }}
      </button>
      <button class="control-btn" @click="nextFrame" title="下一帧">
        ⏭️
      </button>
    </div>
    
    <div class="player-settings">
      <div class="setting-group">
        <label class="setting-label">播放速度 (FPS)</label>
        <input
          type="range"
          v-model.number="store.fps"
          min="1"
          max="30"
          class="slider"
        />
        <span class="setting-value">{{ store.fps }} FPS</span>
      </div>
      
      <div class="setting-group">
        <label class="setting-label">循环模式</label>
        <div class="loop-modes">
          <button
            class="loop-btn"
            :class="{ active: store.loopMode === 'loop' }"
            @click="store.loopMode = 'loop'"
            title="循环播放"
          >
            🔁 循环
          </button>
          <button
            class="loop-btn"
            :class="{ active: store.loopMode === 'once' }"
            @click="store.loopMode = 'once'"
            title="播放一次"
          >
            ⏹️ 单次
          </button>
          <button
            class="loop-btn"
            :class="{ active: store.loopMode === 'pingpong' }"
            @click="store.loopMode = 'pingpong'"
            title="往返播放"
          >
            🔃 往返
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.animation-player {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-select {
  padding: 6px 10px;
  font-size: 13px;
}

.preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.preview-canvas-wrapper {
  width: 128px;
  height: 128px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
}

.empty-preview {
  color: var(--text-secondary);
  font-size: 12px;
}

.frame-indicator {
  font-size: 13px;
  color: var(--text-secondary);
}

.player-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.control-btn {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-tertiary);
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--accent-primary);
    border-color: var(--accent-primary);
  }

  &.play-btn {
    width: 48px;
    height: 48px;
    font-size: 20px;
    background-color: var(--accent-primary);
    border-color: var(--accent-primary);

    &:hover {
      background-color: #ff6b8a;
    }
  }
}

.player-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--bg-tertiary);
  border-radius: 3px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--accent-primary);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--accent-primary);
    cursor: pointer;
    border: none;
  }
}

.setting-value {
  font-size: 12px;
  color: var(--text-primary);
  text-align: center;
}

.loop-modes {
  display: flex;
  gap: 6px;
}

.loop-btn {
  flex: 1;
  padding: 6px 8px;
  font-size: 12px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-tertiary);
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-primary);
  }

  &.active {
    background-color: var(--accent-primary);
    border-color: var(--accent-primary);
  }
}
</style>
