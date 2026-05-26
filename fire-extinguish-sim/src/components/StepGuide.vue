<template>
  <div class="card shadow-lg">
    <div class="card-header bg-info text-white">
      <h5 class="card-title mb-0">
        <span class="me-2">📋</span>操作步骤指南
      </h5>
    </div>
    <div class="card-body">
      <div class="row">
        <div
          v-for="(step, index) in steps"
          :key="step.step"
          class="col-md-3 mb-3 mb-md-0"
        >
          <div
            class="step-card h-100 p-3 rounded border-2"
            :class="getStepClass(index + 1)"
          >
            <div class="d-flex align-items-start">
              <div
                class="step-indicator rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                style="width: 40px; height: 40px; font-weight: bold;"
                :class="getStepBadgeClass(index + 1)"
              >
                <span v-if="currentStep > index + 1">✓</span>
                <span v-else>{{ step.step }}</span>
              </div>
              <div class="flex-grow-1">
                <h6 class="fw-bold mb-1">{{ step.text }}</h6>
                <p class="small text-muted mb-0">{{ step.detail }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  steps: {
    type: Array,
    required: true
  },
  currentStep: {
    type: Number,
    default: 0
  }
});

const getStepClass = (step) => {
  if (props.currentStep > step) {
    return 'bg-success bg-opacity-10 border-success';
  }
  if (props.currentStep === step) {
    return 'bg-primary bg-opacity-10 border-primary';
  }
  return 'bg-light border-secondary';
};

const getStepBadgeClass = (step) => {
  if (props.currentStep > step) {
    return 'bg-success text-white completed';
  }
  if (props.currentStep === step) {
    return 'bg-primary text-white current';
  }
  return 'bg-secondary text-white';
};
</script>

<style scoped>
.step-card {
  transition: all 0.3s ease;
}
</style>
