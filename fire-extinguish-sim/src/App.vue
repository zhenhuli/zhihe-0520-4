<template>
  <div class="min-vh-100 py-4">
    <div class="container">
      <header class="text-center mb-5">
        <h1 class="display-4 text-white fw-bold mb-2">
          🔥 火情处置模拟系统
        </h1>
        <p class="text-white-50 lead">Fire Extinguish Simulation System</p>
        <p class="text-white-50">学习正确使用灭火器，提高消防安全意识</p>
      </header>

      <div class="row g-4">
        <div class="col-lg-4">
          <SceneSelector
            :scenes="fireScenes"
            :selectedScene="selectedScene"
            @select="selectScene"
          />
        </div>

        <div class="col-lg-4">
          <ExtinguisherSelector
            :extinguishers="extinguishers"
            :selectedExtinguisher="selectedExtinguisher"
            :currentStep="currentStep"
            @select="selectExtinguisher"
          />
        </div>

        <div class="col-lg-4">
          <SimulationPanel
            :scene="selectedScene"
            :extinguisher="selectedExtinguisher"
            :currentStep="currentStep"
            :gameState="gameState"
            :riskMessage="riskMessage"
            @start="startSimulation"
            @next-step="nextStep"
            @reset="resetSimulation"
          />
        </div>
      </div>

      <div class="row mt-4" v-if="selectedExtinguisher">
        <div class="col-12">
          <StepGuide
            :steps="selectedExtinguisher.usage"
            :currentStep="currentStep"
          />
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-12">
          <KnowledgePanel />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>import { ref } from 'vue';
import { fireScenes, extinguishers } from './data/fireScenes.js';
import SceneSelector from './components/SceneSelector.vue';
import ExtinguisherSelector from './components/ExtinguisherSelector.vue';
import SimulationPanel from './components/SimulationPanel.vue';
import StepGuide from './components/StepGuide.vue';
import KnowledgePanel from './components/KnowledgePanel.vue';
const selectedScene = ref(null);
const selectedExtinguisher = ref(null);
const currentStep = ref(0);
const gameState = ref('idle');
const riskMessage = ref('');
const selectScene = (scene) => {
 selectedScene.value = scene;
 resetSimulation();
};
const selectExtinguisher = (extinguisher) => {
 selectedExtinguisher.value = extinguisher;
 currentStep.value = 0;
};
const startSimulation = () => {
 if (!selectedScene.value || !selectedExtinguisher.value) {
 return;
 }
 const isSuitable = selectedScene.value.suitableExtinguishers.includes(selectedExtinguisher.value.id);
 if (!isSuitable) {
 gameState.value = 'risk';
 riskMessage.value = selectedScene.value.riskIfWrong[selectedExtinguisher.value.id] ||
 '灭火器选择不当，存在安全风险！';
 }
 else {
 gameState.value = 'playing';
 currentStep.value = 1;
 }
};
const nextStep = () => {
 if (!selectedExtinguisher.value)
 return;
 const totalSteps = selectedExtinguisher.value.usage.length;
 if (currentStep.value < totalSteps) {
 currentStep.value++;
 }
 if (currentStep.value >= totalSteps) {
 gameState.value = 'success';
 }
};
const resetSimulation = () => {
 currentStep.value = 0;
 gameState.value = 'idle';
 riskMessage.value = '';
};
</script>
