<script setup>
import { useAnimationStore } from '../stores/animationStore'

const store = useAnimationStore()

const actionList = [
  { key: 'idle', name: '待机', icon: '🧍' },
  { key: 'walk', name: '行走', icon: '🚶' },
  { key: 'jump', name: '跳跃', icon: '🦘' }
]
</script>

<template>
  <div class="action-tabs">
    <button
      v-for="action in actionList"
      :key="action.key"
      class="action-tab"
      :class="{ active: store.currentAction === action.key }"
      @click="store.switchAction(action.key)"
    >
      <span class="action-icon">{{ action.icon }}</span>
      <span class="action-name">{{ action.name }}</span>
      <span class="action-count">{{ store.actions[action.key].frames.length }}帧</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.action-tabs {
  display: flex;
  gap: 8px;
  padding: 12px 20px;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
}

.action-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid var(--border-color);
  background-color: var(--bg-secondary);
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--accent-primary);
    background-color: rgba(233, 69, 96, 0.1);
  }

  &.active {
    border-color: var(--accent-primary);
    background-color: var(--accent-primary);
  }
}

.action-icon {
  font-size: 18px;
}

.action-name {
  font-weight: 600;
}

.action-count {
  font-size: 12px;
  padding: 2px 8px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  color: var(--text-secondary);

  .active & {
    color: rgba(255, 255, 255, 0.9);
  }
}
</style>
