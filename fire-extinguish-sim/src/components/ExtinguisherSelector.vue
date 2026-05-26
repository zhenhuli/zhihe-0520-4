<template>
  <div class="card h-100 shadow-lg">
    <div class="card-header bg-primary text-white">
      <h5 class="card-title mb-0">
        <span class="me-2">🧯</span>选择灭火器
      </h5>
    </div>
    <div class="card-body">
      <p class="text-muted small mb-3">选择合适的灭火器类型</p>
      <div class="row g-3">
        <div
          v-for="extinguisher in extinguishers"
          :key="extinguisher.id"
          class="col-12"
        >
          <div
            class="extinguisher-btn card border-2"
            :class="{ 'selected border-primary': selectedExtinguisher?.id === extinguisher.id }"
            @click="$emit('select', extinguisher)"
          >
            <div class="card-body p-3">
              <div class="d-flex align-items-center">
                <div
                  class="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style="width: 50px; height: 50px; font-size: 24px;"
                  :style="{ backgroundColor: extinguisher.color + '20' }"
                >
                  {{ extinguisher.icon }}
                </div>
                <div class="flex-grow-1">
                  <h6 class="mb-1 fw-bold">{{ extinguisher.name }}</h6>
                  <p class="text-muted small mb-1">{{ extinguisher.description }}</p>
                  <div class="d-flex flex-wrap gap-1">
                    <span
                      v-for="feature in extinguisher.features.slice(0, 2)"
                      :key="feature"
                      class="badge bg-light text-dark small"
                    >
                      {{ feature }}
                    </span>
                  </div>
                </div>
                <div v-if="selectedExtinguisher?.id === extinguisher.id" class="ms-2">
                  <span class="text-primary">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="selectedExtinguisher" class="mt-4 p-3 bg-light rounded">
        <h6 class="fw-bold mb-2">{{ selectedExtinguisher.name }}特点：</h6>
        <ul class="list-unstyled mb-0">
          <li v-for="(feature, index) in selectedExtinguisher.features" :key="index" class="mb-1">
            <span class="text-success me-2">✓</span>
            {{ feature }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  extinguishers: {
    type: Array,
    required: true
  },
  selectedExtinguisher: {
    type: Object,
    default: null
  },
  currentStep: {
    type: Number,
    default: 0
  }
});

defineEmits(['select']);
</script>
