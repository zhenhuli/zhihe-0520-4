<template>
  <div>
    <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <NuxtLink to="/" class="navbar-item has-text-weight-bold is-size-5">
          🔧 职业技能考评系统
        </NuxtLink>
        <a
          role="button"
          class="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          :class="{ 'is-active': isMenuOpen }"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
        <div class="navbar-start">
          <NuxtLink to="/" class="navbar-item">首页</NuxtLink>
          <NuxtLink to="/questions" class="navbar-item">题库管理</NuxtLink>
          <NuxtLink to="/settings" class="navbar-item">考试设置</NuxtLink>
          <NuxtLink to="/exam" class="navbar-item">开始考试</NuxtLink>
          <NuxtLink to="/practice" class="navbar-item">强化练习</NuxtLink>
          <NuxtLink to="/review" class="navbar-item">人工审阅</NuxtLink>
        </div>
      </div>
    </nav>
    <main class="main-container">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const isMenuOpen = ref(false)
</script>
