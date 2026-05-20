<template>
  <div class="efficiency-chart">
    <h3 class="text-lg font-semibold mb-16">分拣效率监控</h3>
    
    <div class="chart-container">
      <div class="progress-bar">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${stats.efficiencyRate}%` }">
            <span class="progress-label">{{ stats.efficiencyRate }}%</span>
          </div>
        </div>
        <div class="progress-info">
          <span>配送完成率</span>
          <span class="text-muted">{{ stats.deliveredPackages }} / {{ stats.totalPackages }}</span>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value text-primary">{{ stats.packagesPerHour }}</div>
          <div class="stat-label">近1小时处理</div>
        </div>
        <div class="stat-item">
          <div class="stat-value text-success">{{ stats.avgSortingTime }}s</div>
          <div class="stat-label">平均分拣耗时</div>
        </div>
        <div class="stat-item">
          <div class="stat-value text-warning">{{ stats.todaySorted }}</div>
          <div class="stat-label">今日已分拣</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" :class="stats.stuckPackages > 0 ? 'text-danger' : 'text-success'">{{ stats.stuckPackages }}</div>
          <div class="stat-label">滞留快件</div>
        </div>
      </div>

      <div class="status-breakdown">
        <div class="breakdown-title">状态分布</div>
        <div class="breakdown-bars">
          <div class="breakdown-item">
            <div class="breakdown-bar">
              <div class="breakdown-fill pending" :style="{ width: getPercentage('pending') }"></div>
            </div>
            <div class="breakdown-label">待入库 {{ getStatusCount('pending') }}</div>
          </div>
          <div class="breakdown-item">
            <div class="breakdown-bar">
              <div class="breakdown-fill scanned" :style="{ width: getPercentage('scanned') }"></div>
            </div>
            <div class="breakdown-label">已扫描 {{ getStatusCount('scanned') }}</div>
          </div>
          <div class="breakdown-item">
            <div class="breakdown-bar">
              <div class="breakdown-fill sorted" :style="{ width: getPercentage('sorted') }"></div>
            </div>
            <div class="breakdown-label">已分拣 {{ getStatusCount('sorted') }}</div>
          </div>
          <div class="breakdown-item">
            <div class="breakdown-bar">
              <div class="breakdown-fill assigned" :style="{ width: getPercentage('assigned') }"></div>
            </div>
            <div class="breakdown-label">已分配 {{ getStatusCount('assigned') }}</div>
          </div>
          <div class="breakdown-item">
            <div class="breakdown-bar">
              <div class="breakdown-fill delivered" :style="{ width: getPercentage('delivered') }"></div>
            </div>
            <div class="breakdown-label">已送达 {{ getStatusCount('delivered') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SortingStats, Package } from '~/types'

const props = defineProps<{
  stats: SortingStats
  packages: Package[]
}>()

const getStatusCount = (status: string) => {
  return props.packages.filter(p => p.status === status).length
}

const getPercentage = (status: string) => {
  if (props.packages.length === 0) return '0%'
  return `${(getStatusCount(status) / props.packages.length) * 100}%`
}
</script>

<style lang="scss" scoped>
.efficiency-chart {
  background: $card-bg;
  border-radius: $radius-lg;
  border: 1px solid $border-color;
  padding: 20px;
}

.progress-bar {
  margin-bottom: 20px;
}

.progress-track {
  height: 32px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $primary-color, $secondary-color);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
  transition: width $transition-slow ease;
  min-width: 60px;
}

.progress-label {
  font-size: 13px;
  font-weight: 600;
  color: white;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: $text-secondary;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: $radius-md;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: $text-muted;
}

.status-breakdown {
  padding-top: 16px;
  border-top: 1px solid $border-color;
}

.breakdown-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: $text-primary;
}

.breakdown-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.breakdown-item {
  display: grid;
  grid-template-columns: 1fr 120px;
  gap: 12px;
  align-items: center;
}

.breakdown-bar {
  height: 8px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 4px;
  overflow: hidden;
}

.breakdown-fill {
  height: 100%;
  border-radius: 4px;
  transition: width $transition-slow ease;

  &.pending { background: #64748b; }
  &.scanned { background: #3b82f6; }
  &.sorted { background: #f59e0b; }
  &.assigned { background: #06b6d4; }
  &.delivered { background: #10b981; }
}

.breakdown-label {
  font-size: 12px;
  color: $text-secondary;
}
</style>
