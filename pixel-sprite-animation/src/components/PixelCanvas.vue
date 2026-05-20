<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAnimationStore } from '../stores/animationStore'

const store = useAnimationStore()
const canvasRef = ref(null)
const isDrawing = ref(false)
const lastPixel = ref({ x: -1, y: -1 })

const canvasStyle = computed(() => ({
  width: `${store.canvasWidth * store.pixelSize}px`,
  height: `${store.canvasHeight * store.pixelSize}px`
}))

function drawPixel(x, y) {
  if (store.tool === 'pen') {
    store.setPixel(x, y, store.selectedColor)
  } else if (store.tool === 'eraser') {
    store.clearPixel(x, y)
  }
}

function getPixelPosition(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  const x = Math.floor((e.clientX - rect.left) / store.pixelSize)
  const y = Math.floor((e.clientY - rect.top) / store.pixelSize)
  return { x, y }
}

function handleMouseDown(e) {
  isDrawing.value = true
  const { x, y } = getPixelPosition(e)
  drawPixel(x, y)
  lastPixel.value = { x, y }
}

function handleMouseMove(e) {
  if (!isDrawing.value) return
  const { x, y } = getPixelPosition(e)
  if (x !== lastPixel.value.x || y !== lastPixel.value.y) {
    drawPixel(x, y)
    lastPixel.value = { x, y }
  }
}

function handleMouseUp() {
  isDrawing.value = false
  lastPixel.value = { x: -1, y: -1 }
}

function handleMouseLeave() {
  isDrawing.value = false
  lastPixel.value = { x: -1, y: -1 }
}

function handleTouchStart(e) {
  e.preventDefault()
  const touch = e.touches[0]
  const { x, y } = getPixelPosition(touch)
  drawPixel(x, y)
  lastPixel.value = { x, y }
}

function handleTouchMove(e) {
  e.preventDefault()
  const touch = e.touches[0]
  const { x, y } = getPixelPosition(touch)
  if (x !== lastPixel.value.x || y !== lastPixel.value.y) {
    drawPixel(x, y)
    lastPixel.value = { x, y }
  }
}

function handleTouchEnd() {
  lastPixel.value = { x: -1, y: -1 }
}

onMounted(() => {
  window.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <div class="pixel-canvas-wrapper">
    <div
      ref="canvasRef"
      class="pixel-canvas checkerboard"
      :style="canvasStyle"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div
        v-for="(row, y) in store.currentFrame?.pixels || []"
        :key="y"
        class="pixel-row"
      >
        <div
          v-for="(color, x) in row"
          :key="x"
          class="pixel"
          :style="{
            width: `${store.pixelSize}px`,
            height: `${store.pixelSize}px`,
            backgroundColor: color || 'transparent',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)'
          }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pixel-canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow: auto;
}

.pixel-canvas {
  display: flex;
  flex-direction: column;
  cursor: crosshair;
  user-select: none;
  border: 2px solid var(--border-color);
  border-radius: 4px;
}

.pixel-row {
  display: flex;
}

.pixel {
  flex-shrink: 0;
}
</style>
