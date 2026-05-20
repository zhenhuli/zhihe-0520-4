<template>
  <div class="sorting-system">
    <header class="system-header">
      <div class="header-content">
        <div class="flex-center gap-12">
          <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10a2 2 0 0 1-2 2h-7"/>
              <line x1="3" y1="7" x2="21" y2="7"/>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold">快递驿站分拣流程模拟系统</h1>
            <p class="text-muted text-sm">智能分拣 · 高效配送 · 实时监控</p>
          </div>
        </div>
        <div class="header-actions">
          <div class="simulation-control">
            <span class="text-sm text-secondary mr-8">模拟速度:</span>
            <select v-model="simulationSpeed" class="select speed-select">
              <option :value="2000">慢速</option>
              <option :value="1000">正常</option>
              <option :value="500">快速</option>
              <option :value="200">极速</option>
            </select>
          </div>
          <button 
            class="btn" 
            :class="isSimulating ? 'btn-danger' : 'btn-success'"
            @click="toggleSimulation"
          >
            <svg v-if="isSimulating" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            {{ isSimulating ? '停止模拟' : '开始模拟' }}
          </button>
        </div>
      </div>
    </header>

    <main class="container">
      <section class="stats-section mb-20">
        <div class="grid grid-auto">
          <StatsCard 
            label="快件总数" 
            :value="stats.totalPackages" 
            color="#3b82f6"
            subLabel="累计录入"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
            </template>
          </StatsCard>
          
          <StatsCard 
            label="已完成分拣" 
            :value="stats.sortedPackages" 
            color="#10b981"
            subLabel="分拣完成"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </template>
          </StatsCard>
          
          <StatsCard 
            label="待处理" 
            :value="stats.pendingPackages" 
            color="#f59e0b"
            subLabel="等待分拣"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </template>
          </StatsCard>
          
          <StatsCard 
            label="配送效率" 
            :value="stats.efficiencyRate" 
            suffix="%"
            color="#06b6d4"
            subLabel="完成率"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </template>
          </StatsCard>
        </div>
      </section>

      <section class="main-content">
        <div class="left-panel">
          <div class="mb-20">
            <PackageInput 
              @submit="handlePackageSubmit"
              @random="handleRandomPackage"
            />
          </div>
          
          <div class="mb-20">
            <AreaManager :areas="areas" :routes="routes" />
          </div>

          <div>
            <SortingRules :rules="rules" :areas="areas" @toggle="toggleRule" />
          </div>
        </div>

        <div class="right-panel">
          <div class="mb-20">
            <FlowVisualization 
              :nodes="flowNodes" 
              :connections="flowConnections" 
              :active="isSimulating"
            />
          </div>

          <div class="grid grid-2 gap-20 mb-20">
            <EfficiencyChart :stats="stats" :packages="packages" />
            <StuckAlert :packages="packages" />
          </div>

          <div class="mb-20">
            <PackageList 
              :packages="packages" 
              :limit="8"
              @scan="scanPackage"
              @sort="sortPackage"
              @assign="assignPackage"
              @deliver="deliverPackage"
            />
          </div>

          <div>
            <SortingRecords :records="recentRecords" />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useSortingSystem } from '~/composables/useSortingSystem'

const {
  packages,
  areas,
  routes,
  rules,
  isSimulating,
  simulationSpeed,
  stats,
  flowNodes,
  flowConnections,
  recentRecords,
  initializeData,
  createPackage,
  scanPackage,
  sortPackage,
  assignPackage,
  deliverPackage,
  startSimulation,
  stopSimulation
} = useSortingSystem()

onMounted(() => {
  initializeData()
  startSimulation(30)
})

const handlePackageSubmit = (data: any) => {
  createPackage(data)
}

const handleRandomPackage = () => {
  createPackage()
}

const toggleRule = (ruleId: string) => {
  const rule = rules.value.find(r => r.id === ruleId)
  if (rule) {
    rule.enabled = !rule.enabled
  }
}

const toggleSimulation = () => {
  if (isSimulating.value) {
    stopSimulation()
  } else {
    startSimulation(50)
  }
}
</script>

<style lang="scss" scoped>
.sorting-system {
  min-height: 100vh;
  background: $dark-bg;
}

.system-header {
  background: $card-bg;
  border-bottom: 1px solid $border-color;
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  color: $primary-color;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.simulation-control {
  display: flex;
  align-items: center;
}

.speed-select {
  width: 100px;
}

.main-content {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 20px;
}

.left-panel {
  display: flex;
  flex-direction: column;
}

.right-panel {
  display: flex;
  flex-direction: column;
}

.stats-section {
  animation: slideIn 0.5s ease-out;
}

@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}
</style>
