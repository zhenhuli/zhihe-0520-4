<template>
  <div class="area-manager">
    <h3 class="text-lg font-semibold mb-16">配送片区管理</h3>
    
    <div class="areas-grid">
      <div v-for="area in areas" :key="area.id" class="area-card" :style="{ '--area-color': area.color }">
        <div class="area-header">
          <div class="area-color-indicator"></div>
          <div class="area-info">
            <div class="area-name">{{ area.name }}</div>
            <div class="area-code">{{ area.code }}</div>
          </div>
          <div class="area-count">{{ area.packageCount }}件</div>
        </div>
        
        <div class="area-details">
          <div class="detail-row">
            <span class="detail-label">覆盖区域:</span>
            <span class="detail-value">{{ area.districts.join('、') }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">快递员:</span>
            <span class="detail-value">{{ area.courierName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">联系电话:</span>
            <span class="detail-value">{{ area.courierPhone }}</span>
          </div>
        </div>

        <div class="area-route">
          <div class="route-label">关联线路</div>
          <div class="route-tag" :style="{ '--route-color': getRouteByArea(area.id)?.color }">
            {{ getRouteByArea(area.id)?.name || '未分配' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeliveryArea, Route } from '~/types'

const props = defineProps<{
  areas: DeliveryArea[]
  routes: Route[]
}>()

const getRouteByArea = (areaId: string) => {
  return props.routes.find(r => r.areaIds.includes(areaId))
}
</script>

<style lang="scss" scoped>
.area-manager {
  background: $card-bg;
  border-radius: $radius-lg;
  border: 1px solid $border-color;
  padding: 20px;
}

.areas-grid {
  display: grid;
  gap: 12px;
}

.area-card {
  padding: 16px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: $radius-md;
  border: 1px solid $border-color;
  transition: all $transition-fast;
  border-left: 3px solid var(--area-color);

  &:hover {
    border-color: var(--area-color);
    background: rgba(15, 23, 42, 0.8);
  }
}

.area-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.area-color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--area-color);
  flex-shrink: 0;
}

.area-info {
  flex: 1;
}

.area-name {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
}

.area-code {
  font-size: 12px;
  color: $text-muted;
}

.area-count {
  font-size: 18px;
  font-weight: 700;
  color: var(--area-color);
}

.area-details {
  margin-bottom: 12px;
}

.detail-row {
  display: flex;
  gap: 8px;
  font-size: 12px;
  margin-bottom: 4px;
}

.detail-label {
  color: $text-muted;
  flex-shrink: 0;
}

.detail-value {
  color: $text-secondary;
}

.area-route {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid $border-color;
}

.route-label {
  font-size: 12px;
  color: $text-muted;
}

.route-tag {
  padding: 3px 10px;
  background: color-mix(in srgb, var(--route-color, $primary-color) 20%, transparent);
  color: var(--route-color, $primary-color);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}
</style>
