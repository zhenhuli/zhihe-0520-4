<template>
  <div class="sorting-records">
    <h3 class="text-lg font-semibold mb-16">分拣流转记录</h3>
    
    <div class="records-list">
      <div v-for="(record, index) in records" :key="index" class="record-item animate-slide-in">
        <div class="record-timeline">
          <div class="timeline-dot"></div>
          <div v-if="index < records.length - 1" class="timeline-line"></div>
        </div>
        <div class="record-content">
          <div class="record-header">
            <span class="tracking-number">{{ record.trackingNumber }}</span>
            <span class="record-time">{{ formatTime(record.timestamp) }}</span>
          </div>
          <div class="record-path">
            <span class="from">{{ record.fromStation }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            <span class="to">{{ record.toStation }}</span>
          </div>
          <div v-if="record.duration > 0" class="record-duration">
            耗时: {{ record.duration.toFixed(1) }}秒
          </div>
        </div>
      </div>
      <div v-if="records.length === 0" class="empty-records">
        <p class="text-muted">暂无分拣记录</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SortingRecord } from '~/types'

defineProps<{
  records: SortingRecord[]
}>()

const formatTime = (date: Date) => {
  const d = new Date(date)
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
</script>

<style lang="scss" scoped>
.sorting-records {
  background: $card-bg;
  border-radius: $radius-lg;
  border: 1px solid $border-color;
  padding: 20px;
  height: 100%;
}

.records-list {
  max-height: 450px;
  overflow-y: auto;
}

.record-item {
  display: flex;
  gap: 12px;
  padding-bottom: 16px;
}

.record-timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20px;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: $primary-color;
  flex-shrink: 0;
}

.timeline-line {
  width: 2px;
  flex: 1;
  background: $border-color;
  margin-top: 4px;
}

.record-content {
  flex: 1;
  padding-bottom: 16px;
  border-bottom: 1px solid $border-color;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.tracking-number {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  font-weight: 600;
  color: $text-primary;
}

.record-time {
  font-size: 12px;
  color: $text-muted;
}

.record-path {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: $text-secondary;
  margin-bottom: 4px;

  .from {
    color: $text-muted;
  }

  .to {
    color: $primary-color;
    font-weight: 500;
  }

  svg {
    color: $text-muted;
  }
}

.record-duration {
  font-size: 11px;
  color: $success-color;
}

.empty-records {
  text-align: center;
  padding: 40px 20px;
}
</style>
