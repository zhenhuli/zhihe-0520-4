<template>
  <div class="sorting-rules">
    <h3 class="text-lg font-semibold mb-16">分拣规则配置</h3>
    
    <div class="rules-list">
      <div v-for="rule in rules" :key="rule.id" class="rule-item" :class="{ disabled: !rule.enabled }">
        <div class="rule-header">
          <div class="rule-toggle" @click="$emit('toggle', rule.id)">
            <div class="toggle-track">
              <div class="toggle-thumb" :class="{ active: rule.enabled }"></div>
            </div>
          </div>
          <div class="rule-info">
            <div class="rule-name">{{ rule.name }}</div>
            <div class="rule-type">{{ typeLabel[rule.type] }}</div>
          </div>
          <div class="rule-target">
            → {{ getAreaName(rule.targetAreaId) }}
          </div>
        </div>
        <div class="rule-condition">
          <span class="condition-label">条件:</span>
          <span class="condition-value">{{ rule.condition }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SortingRule, DeliveryArea } from '~/types'

const props = defineProps<{
  rules: SortingRule[]
  areas: DeliveryArea[]
}>()

defineEmits<{
  (e: 'toggle', id: string): void
}>()

const typeLabel: Record<string, string> = {
  district: '按区域划分',
  weight: '按重量划分',
  size: '按尺寸划分',
  priority: '按优先级划分'
}

const getAreaName = (areaId: string) => {
  return props.areas.find(a => a.id === areaId)?.name || '未知区域'
}
</script>

<style lang="scss" scoped>
.sorting-rules {
  background: $card-bg;
  border-radius: $radius-lg;
  border: 1px solid $border-color;
  padding: 20px;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rule-item {
  padding: 16px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: $radius-md;
  border: 1px solid $border-color;
  transition: all $transition-fast;

  &:hover {
    border-color: $primary-color;
  }

  &.disabled {
    opacity: 0.5;
  }
}

.rule-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.rule-toggle {
  cursor: pointer;
}

.toggle-track {
  width: 44px;
  height: 24px;
  background: $border-color;
  border-radius: 12px;
  position: relative;
  transition: all $transition-fast;
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: $text-muted;
  border-radius: 50%;
  transition: all $transition-fast;

  &.active {
    left: 22px;
    background: $success-color;
  }
}

.rule-toggle:hover .toggle-track:has(.active) {
  background: rgba(16, 185, 129, 0.3);
}

.rule-info {
  flex: 1;
}

.rule-name {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
}

.rule-type {
  font-size: 12px;
  color: $text-muted;
}

.rule-target {
  font-size: 13px;
  color: $primary-color;
  font-weight: 500;
}

.rule-condition {
  display: flex;
  gap: 8px;
  font-size: 12px;
  padding-top: 8px;
  border-top: 1px solid $border-color;
}

.condition-label {
  color: $text-muted;
}

.condition-value {
  color: $text-secondary;
}
</style>
