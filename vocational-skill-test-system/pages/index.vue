<template>
  <div class="container">
    <section class="hero is-primary is-bold mb-6">
      <div class="hero-body">
        <div class="container">
          <h1 class="title is-2">职业技能在线考评系统</h1>
          <h2 class="subtitle">自定义题库 · 智能评分 · 精准练习</h2>
        </div>
      </div>
    </section>

    <div class="columns">
      <div class="column is-3">
        <div class="card">
          <div class="card-content has-text-centered">
            <p class="title is-3">{{ statistics.total }}</p>
            <p class="subtitle">题目总数</p>
          </div>
        </div>
      </div>
      <div class="column is-3">
        <div class="card">
          <div class="card-content has-text-centered">
            <p class="title is-3">{{ statistics.mcq }}</p>
            <p class="subtitle">理论选择题</p>
          </div>
        </div>
      </div>
      <div class="column is-3">
        <div class="card">
          <div class="card-content has-text-centered">
            <p class="title is-3">{{ statistics.practical }}</p>
            <p class="subtitle">实操简答题</p>
          </div>
        </div>
      </div>
      <div class="column is-3">
        <div class="card">
          <div class="card-content has-text-centered">
            <p class="title is-3">{{ statistics.wrongCount }}</p>
            <p class="subtitle">待强化题目</p>
          </div>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column is-6">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">技能等级分布</p>
          </header>
          <div class="card-content">
            <div class="content">
              <div class="mb-3">
                <div class="level">
                  <span class="level-badge level-elementary">初级</span>
                  <span>{{ statistics.byLevel.elementary }} 题</span>
                </div>
                <progress class="progress is-success" :value="statistics.byLevel.elementary" :max="statistics.total || 1">
                  {{ statistics.byLevel.elementary }}%
                </progress>
              </div>
              <div class="mb-3">
                <div class="level">
                  <span class="level-badge level-intermediate">中级</span>
                  <span>{{ statistics.byLevel.intermediate }} 题</span>
                </div>
                <progress class="progress is-warning" :value="statistics.byLevel.intermediate" :max="statistics.total || 1">
                  {{ statistics.byLevel.intermediate }}%
                </progress>
              </div>
              <div class="mb-3">
                <div class="level">
                  <span class="level-badge level-advanced">高级</span>
                  <span>{{ statistics.byLevel.advanced }} 题</span>
                </div>
                <progress class="progress is-danger" :value="statistics.byLevel.advanced" :max="statistics.total || 1">
                  {{ statistics.byLevel.advanced }}%
                </progress>
              </div>
              <div>
                <div class="level">
                  <span class="level-badge level-expert">专家级</span>
                  <span>{{ statistics.byLevel.expert }} 题</span>
                </div>
                <progress class="progress is-info" :value="statistics.byLevel.expert" :max="statistics.total || 1">
                  {{ statistics.byLevel.expert }}%
                </progress>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="column is-6">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">快捷操作</p>
          </header>
          <div class="card-content">
            <div class="content">
              <div class="buttons are-medium is-fullwidth">
                <NuxtLink to="/questions" class="button is-info is-fullwidth mb-3">
                  <span class="icon"><i>📚</i></span>
                  <span>题库管理</span>
                </NuxtLink>
                <NuxtLink to="/settings" class="button is-warning is-fullwidth mb-3">
                  <span class="icon"><i>⚙️</i></span>
                  <span>考试设置</span>
                </NuxtLink>
                <NuxtLink to="/exam" class="button is-primary is-fullwidth mb-3">
                  <span class="icon"><i>✍️</i></span>
                  <span>开始考试</span>
                </NuxtLink>
                <NuxtLink to="/practice" class="button is-danger is-fullwidth mb-3">
                  <span class="icon"><i>🎯</i></span>
                  <span>强化练习 ({{ statistics.wrongCount }}题)</span>
                </NuxtLink>
                <NuxtLink to="/review" class="button is-warning is-fullwidth">
                  <span class="icon"><i>📝</i></span>
                  <span>人工审阅 ({{ pendingReviewCount }}份)</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card" v-if="examHistory.length > 0">
      <header class="card-header">
        <p class="card-header-title">最近考试记录</p>
      </header>
      <div class="card-content">
        <div class="content">
          <table class="table is-fullwidth is-striped">
            <thead>
              <tr>
                <th>考试时间</th>
                <th>得分</th>
                <th>总分</th>
                <th>正确率</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in recentExams" :key="record.id">
                <td>{{ formatDate(record.startTime) }}</td>
                <td><strong>{{ record.totalScore }}</strong></td>
                <td>{{ record.maxScore }}</td>
                <td>{{ Math.round(record.totalScore / record.maxScore * 100) }}%</td>
                <td>
                  <span v-if="record.pendingReviewCount > 0" class="tag is-warning">
                    待审阅 ({{ record.pendingReviewCount }}题)
                  </span>
                  <span v-else class="tag" :class="record.isPassed ? 'is-success' : 'is-danger'">
                    {{ record.isPassed ? '通过' : '未通过' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useQuestionStore()

onMounted(() => {
  store.init()
})

const statistics = computed(() => store.statistics)
const examHistory = computed(() => store.examHistory)
const recentExams = computed(() => store.examHistory.slice(0, 5))
const pendingReviewCount = computed(() => store.examHistory.filter(e => e.pendingReviewCount > 0).length)

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}
</script>
