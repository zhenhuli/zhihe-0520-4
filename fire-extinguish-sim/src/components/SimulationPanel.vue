<template>
  <div class="card h-100 shadow-lg">
    <div class="card-header bg-success text-white">
      <h5 class="card-title mb-0">
        <span class="me-2">🎮</span>模拟操作
      </h5>
    </div>
    <div class="card-body d-flex flex-column">
      <div class="simulation-area flex-grow-1 mb-3 p-4 rounded bg-dark text-center position-relative overflow-hidden">
        <div class="scene-preview">
          <template v-if="scene">
            <div class="fire-display mb-3">
              <span
                v-if="gameState !== 'success'"
                class="display-1 fire-animation fire-flicker d-inline-block"
              >
                🔥
              </span>
              <span
                v-else
                class="display-1 d-inline-block success-pulse"
              >
                ✅
              </span>
            </div>
            <h4 class="text-white mb-2">{{ scene.name }}</h4>
            <span class="badge bg-warning">{{ scene.category }}</span>
            <p class="text-white-50 mt-2">{{ scene.description }}</p>

            <div v-if="extinguisher && gameState !== 'idle'" class="mt-3">
              <div class="text-white-50 small">使用：{{ extinguisher.name }}</div>
            </div>

            <div v-if="gameState === 'risk'" class="risk-warning shake mt-4">
              <div class="alert alert-danger">
                <h5 class="alert-heading">⚠️ 危险警告！</h5>
                <p class="mb-0">{{ riskMessage }}</p>
              </div>
            </div>

            <div v-if="gameState === 'success'" class="mt-4">
              <div class="alert alert-success">
                <h5 class="alert-heading">🎉 灭火成功！</h5>
                <p class="mb-0">恭喜你成功完成了灭火操作！</p>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="text-white-50 py-5">
              <span class="display-3 mb-3 d-block">👆</span>
              <p>请先选择火情场景</p>
            </div>
          </template>
        </div>
      </div>

      <div class="control-buttons">
        <div v-if="gameState === 'idle'" class="d-grid gap-2">
          <button
            class="btn btn-danger btn-lg"
            :disabled="!scene || !extinguisher"
            @click="$emit('start')"
          >
            🔥 开始灭火
          </button>
          <p class="text-muted text-center small mb-0">
            {{ !scene ? '请选择火情场景' : !extinguisher ? '请选择灭火器' : '准备就绪，点击开始' }}
          </p>
        </div>

        <div v-else-if="gameState === 'risk'" class="d-grid gap-2">
          <button
            class="btn btn-warning btn-lg"
            @click="$emit('reset')"
          >
            🔄 重新选择
          </button>
        </div>

        <div v-else-if="gameState === 'playing'" class="d-grid gap-2">
          <button
            class="btn btn-primary btn-lg"
            @click="$emit('next-step')"
          >
            ▶️ 执行下一步
          </button>
          <div class="progress mt-2">
            <div
              class="progress-bar progress-bar-striped progress-bar-animated"
              :style="{ width: progressPercent + '%' }"
            ></div>
          </div>
          <p class="text-center small text-muted mb-0">
            步骤 {{ currentStep }} / {{ totalSteps }}
          </p>
        </div>

        <div v-else-if="gameState === 'success'" class="d-grid gap-2">
          <button
            class="btn btn-success btn-lg"
            @click="$emit('reset')"
          >
            🔄 再次练习
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  scene: {
    type: Object,
    default: null
  },
  extinguisher: {
    type: Object,
    default: null
  },
  currentStep: {
    type: Number,
    default: 0
  },
  gameState: {
    type: String,
    default: 'idle'
  },
  riskMessage: {
    type: String,
    default: ''
  }
});

defineEmits(['start', 'next-step', 'reset']);

const totalSteps = computed(() => {
  return props.extinguisher?.usage?.length || 4;
});

const progressPercent = computed(() => {
  return (props.currentStep / totalSteps.value) * 100;
});
</script>

<style scoped>
.simulation-area {
  min-height: 280px;
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%) !important;
}

.risk-warning {
  animation: shake 0.5s ease-in-out;
}
</style>
