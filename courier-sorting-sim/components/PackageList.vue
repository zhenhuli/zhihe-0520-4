<template>
  <div class="package-list">
    <div class="flex-between mb-16">
      <h3 class="text-lg font-semibold">快件列表</h3>
      <div class="flex gap-8">
        <span class="badge badge-primary">共 {{ packages.length }} 件</span>
      </div>
    </div>

    <div class="package-list-header">
      <div class="col-track">运单号</div>
      <div class="col-name">收件人</div>
      <div class="col-area">区域</div>
      <div class="col-size">规格</div>
      <div class="col-status">状态</div>
      <div class="col-action">操作</div>
    </div>

    <div class="package-list-body">
      <div v-for="pkg in displayPackages" :key="pkg.id" class="package-item animate-slide-in">
        <div class="col-track">
          <span class="tracking-number">{{ pkg.trackingNumber }}</span>
        </div>
        <div class="col-name">
          <div class="name">{{ pkg.receiverName }}</div>
          <div class="phone text-sm text-muted">{{ pkg.receiverPhone }}</div>
        </div>
        <div class="col-area">
          <span class="area-tag">{{ pkg.district }}</span>
        </div>
        <div class="col-size">
          <span class="size-tag" :class="pkg.size">{{ sizeLabel[pkg.size] }}</span>
        </div>
        <div class="col-status">
          <span class="status-badge" :class="pkg.status">{{ statusLabel[pkg.status] }}</span>
        </div>
        <div class="col-action">
          <button v-if="pkg.status === 'pending'" class="action-btn scan" @click="$emit('scan', pkg.id)" title="扫描">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
              <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
              <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
              <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
              <line x1="7" y1="7" x2="17" y2="17"/>
            </svg>
          </button>
          <button v-if="pkg.status === 'scanned'" class="action-btn sort" @click="$emit('sort', pkg.id)" title="分拣">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="7" y1="10" x2="3" y2="10"/>
              <line x1="7" y1="6" x2="3" y2="6"/>
              <line x1="7" y1="14" x2="3" y2="14"/>
              <line x1="7" y1="18" x2="3" y2="18"/>
              <line x1="11" y1="10" x2="21" y2="10"/>
              <line x1="11" y1="6" x2="21" y2="6"/>
              <line x1="11" y1="14" x2="21" y2="14"/>
              <line x1="11" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <button v-if="pkg.status === 'sorted'" class="action-btn assign" @click="$emit('assign', pkg.id)" title="分配线路">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
          </button>
          <button v-if="pkg.status === 'assigned'" class="action-btn deliver" @click="$emit('deliver', pkg.id)" title="送达">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </button>
        </div>
      </div>
      <div v-if="packages.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="9" y1="21" x2="9" y2="9"/>
        </svg>
        <p class="text-muted mt-8">暂无快件数据</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Package } from '~/types'

const props = defineProps<{
  packages: Package[]
  limit?: number
}>()

defineEmits<{
  (e: 'scan', id: string): void
  (e: 'sort', id: string): void
  (e: 'assign', id: string): void
  (e: 'deliver', id: string): void
}>()

const displayPackages = computed(() => {
  if (props.limit) {
    return props.packages.slice(0, props.limit)
  }
  return props.packages
})

const sizeLabel: Record<string, string> = {
  small: '小件',
  medium: '中件',
  large: '大件'
}

const statusLabel: Record<string, string> = {
  pending: '待入库',
  scanned: '已扫描',
  sorted: '已分拣',
  assigned: '已分配',
  delivered: '已送达'
}
</script>

<style lang="scss" scoped>
.package-list {
  background: $card-bg;
  border-radius: $radius-lg;
  border: 1px solid $border-color;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.package-list-header {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 0.8fr 1fr 0.8fr;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: $radius-md;
  font-size: 12px;
  color: $text-secondary;
  font-weight: 500;
  margin-bottom: 8px;
}

.package-list-body {
  flex: 1;
  overflow-y: auto;
  max-height: 500px;
}

.package-item {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 0.8fr 1fr 0.8fr;
  gap: 12px;
  padding: 14px 16px;
  align-items: center;
  border-bottom: 1px solid $border-color;
  transition: background $transition-fast;

  &:hover {
    background: rgba(37, 99, 235, 0.05);
  }

  &:last-child {
    border-bottom: none;
  }
}

.tracking-number {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: $text-primary;
  font-weight: 500;
}

.name {
  font-size: 14px;
  color: $text-primary;
}

.area-tag {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(6, 182, 212, 0.15);
  color: #06b6d4;
  border-radius: 12px;
  font-size: 12px;
}

.size-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;

  &.small {
    background: rgba(16, 185, 129, 0.15);
    color: $success-color;
  }

  &.medium {
    background: rgba(245, 158, 11, 0.15);
    color: $warning-color;
  }

  &.large {
    background: rgba(239, 68, 68, 0.15);
    color: $danger-color;
  }
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;

  &.pending {
    background: rgba(100, 116, 139, 0.2);
    color: #94a3b8;
  }

  &.scanned {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
  }

  &.sorted {
    background: rgba(245, 158, 11, 0.15);
    color: $warning-color;
  }

  &.assigned {
    background: rgba(6, 182, 212, 0.15);
    color: #06b6d4;
  }

  &.delivered {
    background: rgba(16, 185, 129, 0.15);
    color: $success-color;
  }
}

.col-action {
  display: flex;
  gap: 6px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: $radius-md;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all $transition-fast;

  &.scan {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;

    &:hover {
      background: rgba(59, 130, 246, 0.3);
    }
  }

  &.sort {
    background: rgba(245, 158, 11, 0.15);
    color: $warning-color;

    &:hover {
      background: rgba(245, 158, 11, 0.3);
    }
  }

  &.assign {
    background: rgba(6, 182, 212, 0.15);
    color: #06b6d4;

    &:hover {
      background: rgba(6, 182, 212, 0.3);
    }
  }

  &.deliver {
    background: rgba(16, 185, 129, 0.15);
    color: $success-color;

    &:hover {
      background: rgba(16, 185, 129, 0.3);
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: $text-muted;
}
</style>
