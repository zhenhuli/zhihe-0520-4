<template>
  <div class="card h-100 shadow-lg">
    <div class="card-header bg-danger text-white">
      <h5 class="card-title mb-0">
        <span class="me-2">📍</span>选择火情场景
      </h5>
    </div>
    <div class="card-body">
      <p class="text-muted small mb-3">点击选择一个火情场景进行模拟</p>
      <div class="row g-2">
        <div
          v-for="scene in scenes"
          :key="scene.id"
          class="col-12"
        >
          <div
            class="scene-card card border-2"
            :class="{ 'active border-danger': selectedScene?.id === scene.id }"
            :style="{ '--scene-bg': scene.background }"
            @click="$emit('select', scene)"
          >
            <div class="card-body p-3">
              <div class="d-flex align-items-center">
                <span class="display-5 me-3 fire-animation" v-if="selectedScene?.id === scene.id">
                  🔥
                </span>
                <span class="display-5 me-3" v-else>
                  {{ scene.icon }}
                </span>
                <div class="flex-grow-1">
                  <h6 class="mb-1 fw-bold">{{ scene.name }}</h6>
                  <span class="badge bg-secondary">{{ scene.category }}</span>
                  <p class="text-muted small mb-0 mt-1">{{ scene.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  scenes: {
    type: Array,
    required: true
  },
  selectedScene: {
    type: Object,
    default: null
  }
});

defineEmits(['select']);
</script>

<style scoped>
.scene-card {
  background: linear-gradient(135deg, var(--scene-bg, #f8f9fa) 0%, white 100%);
}
</style>
