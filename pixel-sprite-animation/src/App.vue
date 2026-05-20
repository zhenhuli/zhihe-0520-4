<script setup>
import { onMounted } from 'vue'
import { useAnimationStore } from './stores/animationStore'
import Toolbar from './components/Toolbar.vue'
import ActionTabs from './components/ActionTabs.vue'
import PixelCanvas from './components/PixelCanvas.vue'
import FrameList from './components/FrameList.vue'
import AnimationPlayer from './components/AnimationPlayer.vue'
import ExportPanel from './components/ExportPanel.vue'

const store = useAnimationStore()

onMounted(() => {
  store.initializeFrames()
})
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">🎮 像素角色动画编辑器</h1>
        <div class="header-info">
          <span class="canvas-size">画布: {{ store.canvasWidth }} x {{ store.canvasHeight }} 像素</span>
        </div>
      </div>
    </header>

    <ActionTabs />

    <div class="main-content">
      <div class="left-sidebar">
        <Toolbar />
      </div>

      <div class="canvas-area">
        <div class="canvas-container">
          <div class="canvas-header">
            <span class="canvas-title">绘制区域 - 帧 {{ store.currentFrameIndex + 1 }} / {{ store.totalFrames }}</span>
          </div>
          <div class="canvas-wrapper">
            <PixelCanvas />
          </div>
        </div>
      </div>

      <div class="right-sidebar">
        <AnimationPlayer />
        <ExportPanel />
      </div>

      <FrameList />
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.app-header {
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
}

.app-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.canvas-size {
  font-size: 13px;
  color: var(--text-secondary);
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.canvas-area {
  flex: 1;
  display: flex;
  overflow: auto;
  background-color: var(--bg-primary);
}

.canvas-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.canvas-header {
  padding: 12px 20px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
}

.canvas-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.canvas-wrapper {
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-sidebar {
  width: 280px;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-secondary);
  border-left: 1px solid var(--border-color);
  overflow-y: auto;
}

.left-sidebar {
  width: 240px;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
}

.frame-list {
  width: 280px;
}
</style>
