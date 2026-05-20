<template>
  <div class="container">
    <div class="level">
      <div class="level-left">
        <h1 class="title is-3">人工审阅中心</h1>
      </div>
      <div class="level-right">
        <NuxtLink to="/" class="button is-light">
          <span class="icon"><i>←</i></span>
          <span>返回首页</span>
        </NuxtLink>
      </div>
    </div>

    <div class="columns mb-5">
      <div class="column is-4">
        <div class="card has-background-warning-light">
          <div class="card-content has-text-centered">
            <p class="title is-2 has-text-warning">{{ pendingExams.length }}</p>
            <p class="subtitle">待审阅考试</p>
          </div>
        </div>
      </div>
      <div class="column is-4">
        <div class="card has-background-success-light">
          <div class="card-content has-text-centered">
            <p class="title is-2 has-text-success">{{ completedExams.length }}</p>
            <p class="subtitle">已完成审阅</p>
          </div>
        </div>
      </div>
      <div class="column is-4">
        <div class="card has-background-info-light">
          <div class="card-content has-text-centered">
            <p class="title is-2 has-text-info">{{ store.examHistory.length }}</p>
            <p class="subtitle">总考试记录</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <header class="card-header">
        <p class="card-header-title">待审阅考试</p>
      </header>
      <div class="card-content">
        <div v-if="pendingExams.length === 0" class="has-text-centered py-6">
          <p class="is-size-4 has-text-grey">暂无待审阅的考试</p>
        </div>
        <div v-else class="content">
          <table class="table is-fullwidth is-striped">
            <thead>
              <tr>
                <th>考试时间</th>
                <th>技能等级</th>
                <th>当前得分</th>
                <th>总分</th>
                <th>待审阅题数</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="exam in pendingExams" :key="exam.id">
                <td>{{ formatDate(exam.startTime) }}</td>
                <td>
                  <span class="level-badge" :class="`level-${getExamLevel(exam)}`">
                    {{ skillLevelLabels[getExamLevel(exam)] }}
                  </span>
                </td>
                <td><strong>{{ exam.totalScore }}</strong></td>
                <td>{{ exam.maxScore }}</td>
                <td>
                  <span class="tag is-warning">{{ exam.pendingReviewCount }} 题</span>
                </td>
                <td>
                  <NuxtLink :to="`/review/${exam.id}`" class="button is-primary is-small">
                    开始审阅
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card mt-5">
      <header class="card-header">
        <p class="card-header-title">已完成审阅</p>
      </header>
      <div class="card-content">
        <div v-if="completedExams.length === 0" class="has-text-centered py-6">
          <p class="is-size-4 has-text-grey">暂无已完成审阅的考试</p>
        </div>
        <div v-else class="content">
          <table class="table is-fullwidth is-striped">
            <thead>
              <tr>
                <th>考试时间</th>
                <th>技能等级</th>
                <th>最终得分</th>
                <th>总分</th>
                <th>正确率</th>
                <th>结果</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="exam in completedExams" :key="exam.id">
                <td>{{ formatDate(exam.startTime) }}</td>
                <td>
                  <span class="level-badge" :class="`level-${getExamLevel(exam)}`">
                    {{ skillLevelLabels[getExamLevel(exam)] }}
                  </span>
                </td>
                <td><strong>{{ exam.totalScore }}</strong></td>
                <td>{{ exam.maxScore }}</td>
                <td>{{ Math.round(exam.totalScore / exam.maxScore * 100) }}%</td>
                <td>
                  <span class="tag" :class="exam.isPassed ? 'is-success' : 'is-danger'">
                    {{ exam.isPassed ? '通过' : '未通过' }}
                  </span>
                </td>
                <td>
                  <NuxtLink :to="`/review/${exam.id}`" class="button is-small">
                    查看详情
                  </NuxtLink>
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
import type { ExamResult, SkillLevel } from '~/composables/types'
import { skillLevelLabels } from '~/composables/types'

const store = useQuestionStore()

onMounted(() => {
  store.init()
})

const pendingExams = computed(() => {
  return store.examHistory
    .filter(e => e.pendingReviewCount > 0)
    .sort((a, b) => b.startTime - a.startTime)
})

const completedExams = computed(() => {
  return store.examHistory
    .filter(e => e.pendingReviewCount === 0)
    .sort((a, b) => b.startTime - a.startTime)
})

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

const getExamLevel = (exam: ExamResult): SkillLevel => {
  const firstAnswer = exam.answers[0]
  if (firstAnswer) {
    const question = store.questions.find(q => q.id === firstAnswer.questionId)
    if (question) return question.level
  }
  return 'intermediate'
}
</script>
