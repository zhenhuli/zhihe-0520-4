import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAnimationStore = defineStore('animation', () => {
  const canvasWidth = ref(32)
  const canvasHeight = ref(32)
  const pixelSize = ref(16)
  const currentFrameIndex = ref(0)
  const currentAction = ref('idle')
  const fps = ref(8)
  const loopMode = ref('loop')
  const isPlaying = ref(false)
  const selectedColor = ref('#000000')
  const tool = ref('pen')

  const actions = ref({
    idle: {
      name: '待机',
      frames: []
    },
    walk: {
      name: '行走',
      frames: []
    },
    jump: {
      name: '跳跃',
      frames: []
    }
  })

  const currentFrames = computed(() => actions.value[currentAction.value]?.frames || [])
  const currentFrame = computed(() => currentFrames.value[currentFrameIndex.value] || null)
  const totalFrames = computed(() => currentFrames.value.length)

  function createEmptyFrame() {
    const pixels = []
    for (let y = 0; y < canvasHeight.value; y++) {
      const row = []
      for (let x = 0; x < canvasWidth.value; x++) {
        row.push(null)
      }
      pixels.push(row)
    }
    return {
      id: Date.now() + Math.random(),
      pixels,
      duration: 1000 / fps.value
    }
  }

  function addFrame() {
    const newFrame = createEmptyFrame()
    if (currentFrame.value) {
      newFrame.pixels = JSON.parse(JSON.stringify(currentFrame.value.pixels))
    }
    actions.value[currentAction.value].frames.splice(currentFrameIndex.value + 1, 0, newFrame)
    currentFrameIndex.value++
  }

  function deleteFrame(index) {
    if (currentFrames.value.length <= 1) return
    actions.value[currentAction.value].frames.splice(index, 1)
    if (currentFrameIndex.value >= currentFrames.value.length) {
      currentFrameIndex.value = currentFrames.value.length - 1
    }
  }

  function duplicateFrame(index) {
    const frame = currentFrames.value[index]
    const newFrame = {
      id: Date.now() + Math.random(),
      pixels: JSON.parse(JSON.stringify(frame.pixels)),
      duration: frame.duration
    }
    actions.value[currentAction.value].frames.splice(index + 1, 0, newFrame)
  }

  function moveFrame(fromIndex, toIndex) {
    const frames = actions.value[currentAction.value].frames
    const [removed] = frames.splice(fromIndex, 1)
    frames.splice(toIndex, 0, removed)
    if (currentFrameIndex.value === fromIndex) {
      currentFrameIndex.value = toIndex
    } else if (fromIndex < currentFrameIndex.value && toIndex >= currentFrameIndex.value) {
      currentFrameIndex.value--
    } else if (fromIndex > currentFrameIndex.value && toIndex <= currentFrameIndex.value) {
      currentFrameIndex.value++
    }
  }

  function setPixel(x, y, color) {
    if (!currentFrame.value) return
    if (x >= 0 && x < canvasWidth.value && y >= 0 && y < canvasHeight.value) {
      currentFrame.value.pixels[y][x] = color
    }
  }

  function clearPixel(x, y) {
    if (!currentFrame.value) return
    if (x >= 0 && x < canvasWidth.value && y >= 0 && y < canvasHeight.value) {
      currentFrame.value.pixels[y][x] = null
    }
  }

  function clearCurrentFrame() {
    if (!currentFrame.value) return
    for (let y = 0; y < canvasHeight.value; y++) {
      for (let x = 0; x < canvasWidth.value; x++) {
        currentFrame.value.pixels[y][x] = null
      }
    }
  }

  function setCanvasSize(width, height) {
    canvasWidth.value = width
    canvasHeight.value = height
    Object.keys(actions.value).forEach(actionKey => {
      actions.value[actionKey].frames.forEach(frame => {
        const newPixels = []
        for (let y = 0; y < height; y++) {
          const row = []
          for (let x = 0; x < width; x++) {
            if (frame.pixels[y] && frame.pixels[y][x] !== undefined) {
              row.push(frame.pixels[y][x])
            } else {
              row.push(null)
            }
          }
          newPixels.push(row)
        }
        frame.pixels = newPixels
      })
    })
  }

  function switchAction(actionName) {
    currentAction.value = actionName
    currentFrameIndex.value = 0
    if (currentFrames.value.length === 0) {
      actions.value[actionName].frames.push(createEmptyFrame())
    }
  }

  function initializeFrames() {
    Object.keys(actions.value).forEach(actionKey => {
      if (actions.value[actionKey].frames.length === 0) {
        actions.value[actionKey].frames.push(createEmptyFrame())
      }
    })
  }

  function generateSpriteSheet() {
    const canvas = document.createElement('canvas')
    const totalWidth = canvasWidth.value * totalFrames.value
    canvas.width = totalWidth
    canvas.height = canvasHeight.value
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false

    currentFrames.value.forEach((frame, frameIndex) => {
      for (let y = 0; y < canvasHeight.value; y++) {
        for (let x = 0; x < canvasWidth.value; x++) {
          const color = frame.pixels[y][x]
          if (color) {
            ctx.fillStyle = color
            ctx.fillRect(frameIndex * canvasWidth.value + x, y, 1, 1)
          }
        }
      }
    })

    return canvas.toDataURL('image/png')
  }

  function generateAnimationConfig() {
    return {
      version: '1.0',
      canvasSize: {
        width: canvasWidth.value,
        height: canvasHeight.value
      },
      fps: fps.value,
      loopMode: loopMode.value,
      actions: Object.entries(actions.value).map(([key, action]) => ({
        name: key,
        displayName: action.name,
        frameCount: action.frames.length,
        frames: action.frames.map((frame, index) => ({
          index,
          duration: frame.duration
        }))
      }))
    }
  }

  return {
    canvasWidth,
    canvasHeight,
    pixelSize,
    currentFrameIndex,
    currentAction,
    fps,
    loopMode,
    isPlaying,
    selectedColor,
    tool,
    actions,
    currentFrames,
    currentFrame,
    totalFrames,
    createEmptyFrame,
    addFrame,
    deleteFrame,
    duplicateFrame,
    moveFrame,
    setPixel,
    clearPixel,
    clearCurrentFrame,
    setCanvasSize,
    switchAction,
    initializeFrames,
    generateSpriteSheet,
    generateAnimationConfig
  }
})
