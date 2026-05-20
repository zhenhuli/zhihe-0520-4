<template>
  <div class="stuck-alert">
    <h3 class="text-lg font-semibold mb-16">滞留快件监控</h3>
    
    <div v-if="stuckPackages.length === 0" class="no-stuck">
      <div class="success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <p class="text-success mt-8">暂无滞留快件</p>
      <p class="text-muted text-sm mt-4">所有快件处理正常</p>
    </div>

    <div v-else class="stuck-list">
      <div class="stuck-warning mb-16">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span>发现 {{ stuckPackages.length }} 件滞留快件，超过3小时未处理</span>
      </div>
      
      <div class="stuck-items">
        <div v-for="pkg in stuckPackages" :key="pkg.id" class="stuck-item">
          <div class="stuck-package-info">
            <div class="tracking-number">{{ pkg.trackingNumber }}</div>
            <div class="package-details">
              <span class="receiver">{{ pkg.receiverName }}</span>
              <span class="district">{{ pkg.district }}</span>
            </div>
          </div>
          <div class="stuck-status">
            <span class="status-badge" :class="pkg.status">{{ statusLabel[pkg.status] }}</span>
            <span class="stuck-time">已滞留 {{ getStuckTime(pkg) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Package } from '~/types'

const props = defineProps<{
  packages: Package[]
}>()

const stuckPackages = computed(() => {
  const threeHoursAgo = new Date(Date.now() - 10800000)
  return props.packages.filter(p => 
    (p.status === 'pending' || p.status === 'scanned') && 
    new Date(p.createdAt) < threeHoursAgo
  )
})

const statusLabel: Record<string, string> = {
  pending: '待入库',
  scanned: '已扫描',
  sorted: '已分拣',
  assigned: '已分配',
  delivered: '已送达'
}

const getStuckTime = (pkg: Package) => {
  const diff = Date.now() - new Date(pkg.createdAt).getTime()
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  return `${hours}小时${minutes}分钟`
}
</script>

<style lang="scss" scoped>
.stuck-alert {
  background: $card-bg;
  border-radius: $radius-lg;
  border: 1px solid $border-color;
  padding: 20px;
}

.no-stuck {
  text-align: center;
  padding: 40px 20px;
}

.success-icon {
  color: $success-color;
  opacity: 0.8;
}

.stuck-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: $radius-md;
  color: $danger-color;
  font-size: 13px;
}

.stuck-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.stuck-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: $radius-md;
  border: 1px solid $border-color;
}

.stuck-package-info {
  flex: 1;
}

.tracking-number {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 4px;
}

.package-details {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.receiver {
  color: $text-secondary;
}

.district {
  color: $text-muted;
}

.stuck-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.status-badge {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;

  &.pending {
    background: rgba(100, 116, 139, 0.2);
    color: #94a3b8;
  }

  &.scanned {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
  }
}

.stuck-time {
  font-size: 11px;
  color: $danger-color;
}
</style>
