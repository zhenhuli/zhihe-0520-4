<template>
  <div class="stats-card" :style="{ '--card-color': color }">
    <div class="stats-icon">
      <slot name="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="9" y1="21" x2="9" y2="9"/>
        </svg>
      </slot>
    </div>
    <div class="stats-content">
      <div class="stats-label">{{ label }}</div>
      <div class="stats-value">{{ formattedValue }}</div>
      <div v-if="subLabel" class="stats-sub">{{ subLabel }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  value: number | string
  subLabel?: string
  color?: string
  suffix?: string
}>()

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString() + (props.suffix || '')
  }
  return props.value + (props.suffix || '')
})
</script>

<style lang="scss" scoped>
.stats-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: $card-bg;
  border-radius: $radius-lg;
  border: 1px solid $border-color;
  transition: all $transition-normal;

  &:hover {
    border-color: var(--card-color, $primary-color);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  }
}

.stats-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-lg;
  background: color-mix(in srgb, var(--card-color, $primary-color) 15%, transparent);
  color: var(--card-color, $primary-color);
}

.stats-content {
  flex: 1;
}

.stats-label {
  font-size: 13px;
  color: $text-secondary;
  margin-bottom: 4px;
}

.stats-value {
  font-size: 28px;
  font-weight: 700;
  color: $text-primary;
  line-height: 1.2;
}

.stats-sub {
  font-size: 12px;
  color: $text-muted;
  margin-top: 4px;
}
</style>
