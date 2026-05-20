<template>
  <div class="container">
    <div class="level">
      <div class="level-left">
        <h1 class="title is-3">人工审阅</h1>
      </div>
      <div class="level-right">
        <NuxtLink to="/" class="button is-light">
          <span class="icon"><i>←</i></span>
          <span>返回首页</span>
        </NuxtLink>
      </div>
    </div>

    <div v-if="pendingExams.length === 0 && !currentExam" class="card">
      <div class="card-content has-text-centered py-6">
        <p class="is-size-1">🎉</p>
        <p class="is-size-4 mt-3">没有待审阅的考试</p>
        <p class="has-text-grey mt-2">所有考试都已完成审阅</p>
      </div>
    </div>

    <div v-else-if="!currentExam" class="card">
      <header class="card-header">
        <p class="card-header-title">待审阅考试列表</p>
      </header>
      <div class="card-content">
        <div class="content">
          <table class="table is-fullwidth is-striped">
            <thead>
              <tr>
                <th>考试时间</th>
                <th>当前得分</th>
                <th>总分</th>
                <th>待审阅题数</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="exam in pendingExams" :key="exam.id">
                <td>{{ formatDate(exam.startTime) }}</td>
                <td><strong>{{ exam.totalScore }}</strong></td>
                <td>{{ exam.maxScore }}</td>
                <td>
                  <span class="tag is-warning">{{ exam.pendingReviewCount }} 题</span>
                </td>
                <td>
                  <button class="button is-primary is-small" @click="selectExam(exam.id)">
                    开始审阅
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="card mb-5">
        <div class="card-content">
          <div class="level">
            <div class="level-left">
              <div>
                <p class="heading">考试时间</p>
                <p class="has-text-weight-bold">{{ formatDate(currentExam.startTime) }}</p>
              </div>
            </div>
            <div class="level-item">
              <div>
                <p class="heading">当前得分</p>
                <p class="has-text-weight-bold is-size-4">{{ currentExam.totalScore }} / {{ currentExam.maxScore }}</p>
              </div>
            </div>
            <div class="level-item">
              <div>
                <p class="heading">待审阅</p>
                <p class="has-text-weight-bold is-size-4 has-text-warning">{{ pendingAnswers.length }} 题</p>
              </div>
            </div>
            <div class="level-right">
              <button class="button is-light" @click="backToList">
                返回列表
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="pendingAnswers.length === 0" class="card">
        <div class="card-content has-text-centered py-6">
          <p class="is-size-1">✅</p>
          <p class="is-size-4 mt-3">所有题目已审阅完成！</p>
          <p class="has-text-grey mt-2">最终得分：{{ currentExam.totalScore }} / {{ currentExam.maxScore }}</p>
          <p class="has-text-grey">
            结果：<span class="tag" :class="currentExam.isPassed ? 'is-success' : 'is-danger'">{{ currentExam.isPassed ? '通过' : '未通过' }}</span>
          </p>
          <div class="buttons are-medium is-centered mt-5">
            <NuxtLink :to="`/exam`" class="button is-primary">
              查看完整结果
            </NuxtLink>
            <button class="button is-light" @click="backToList">
              继续审阅其他考试
            </button>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="card mb-4">
          <div class="card-content">
            <div class="level">
              <div class="level-left">
                <div class="level-item">
                  <span class="tag is-warning">实操简答题</span>
                  <span class="level-badge ml-2" :class="`level-${currentQuestion.level}`">
                    {{ skillLevelLabels[currentQuestion.level] }}
                  </span>
                  <span class="tag is-light ml-2">{{ currentQuestion.category }}</span>
                  <span class="tag is-dark ml-2">{{ currentQuestion.points }} 分</span>
                </div>
              </div>
              <div class="level-right">
                <span class="has-text-weight-bold">{{ currentIndex + 1 }} / {{ pendingAnswers.length }}</span>
              </div>
            </div>

            <div class="content mt-5">
              <p class="is-size-4 has-text-weight-semibold">{{ currentQuestion.title }}</p>
            </div>

            <div class="mt-5">
              <div class="field">
                <label class="label">考生答案：</label>
                <div class="control">
                  <div class="box has-background-light" style="min-height: 150px; white-space: pre-wrap;">
                    {{ currentAnswer.answer || '(未作答)' }}
                  </div>
                </div>
              </div>

              <div class="field mt-4">
                <label class="label">参考答案：</label>
                <div class="control">
                  <div class="box has-background-info-light" style="min-height: 150px; white-space: pre-wrap;">
                    {{ currentQuestion.correctAnswer }}
                  </div>
                </div>
              </div>

              <div class="field mt-4">
                <label class="label">题目解析：</label>
                <div class="control">
                  <div class="box has-background-grey-lighter">
                    {{ currentQuestion.explanation }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-content">
            <h3 class="title is-5 mb-4">人工评分</h3>
            
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">给出得分：</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <p class="control">
                    <input 
                      class="input is-medium" 
                      type="number" 
                      v-model.number="manualScore" 
                      :min="0" 
                      :max="currentQuestion.points"
                      placeholder="请输入分数">
                  </p>
                  <p class="help">满分：{{ currentQuestion.points }} 分</p>
                </div>
              </div>
            </div>

            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">判定结果：</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <label class="radio">
                      <input type="radio" v-model="isCorrect" :value="true">
                      <span class="has-text-success">✓ 正确</span>
                    </label>
                    <label class="radio ml-4">
                      <input type="radio" v-model="isCorrect" :value="false">
                      <span class="has-text-danger">✗ 错误</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="field is-horizontal">
              <div class="field-label">
              </div>
              <div class="field-body">
                <div class="field is-grouped">
                  <p class="control">
                    <button class="button is-primary" @click="submitReview">
                      <span class="icon"><i>✓</i></span>
                      <span>提交评分</span>
                    </button>
                  </p>
                  <p class="control">
                    <button class="button" @click="skipQuestion">
                      跳过，稍后再评
                    </button>
                  </p>
                </div>
              </div>
            </div>

            <div class="buttons are-medium is-centered mt-6">
              <button class="button" :disabled="currentIndex === 0" @click="prevQuestion">
                <span class="icon"><i>←</i></span>
                <span>上一题</span>
              </button>
              <button v-if="currentIndex < pendingAnswers.length - 1" class="button" @click="nextQuestion">
                <span>下一题</span>
                <span class="icon"><i>→</i></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExamResult, Question } from '~/composables/types'
import { skillLevelLabels } from '~/composables/types'

const store = useQuestionStore()
const route = useRoute()

onMounted(() => {
  store.init()
  const examId = route.params.id as string
  if (examId) {
    selectExam(examId)
  }
})

const selectedExamId = ref<string | null>(null)
const currentIndex = ref(0)
const manualScore = ref(0)
const isCorrect = ref(true)

const pendingExams = computed(() => {
  return store.examHistory.filter(e => e.pendingReviewCount > 0)
})

const currentExam = computed((): ExamResult | null => {
  if (!selectedExamId.value) return null
  return store.examHistory.find(e => e.id === selectedExamId.value) || null
})

const pendingAnswers = computed(() => {
  if (!currentExam.value) return []
  return currentExam.value.answers.filter(a => a.needsReview && !a.isReviewed)
})

const currentAnswer = computed(() => {
  return pendingAnswers.value[currentIndex.value] || { questionId: '', answer: '' }
})

const currentQuestion = computed((): Question => {
  return store.questions.find(q => q.id === currentAnswer.value.questionId) || {} as Question
})

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

const selectExam = (examId: string) => {
  selectedExamId.value = examId
  currentIndex.value = 0
  resetForm()
}

const resetForm = () => {
  manualScore.value = 0
  isCorrect.value = true
}

const submitReview = () => {
  if (!selectedExamId.value || !currentAnswer.value.questionId) return
  
  if (manualScore.value < 0 || manualScore.value > currentQuestion.value.points) {
    alert(`请输入 0 到 ${currentQuestion.value.points} 之间的分数`)
    return
  }

  store.reviewAnswer(selectedExamId.value, currentAnswer.value.questionId, manualScore.value, isCorrect.value)
  
  if (pendingAnswers.value.length > 0) {
    if (currentIndex.value >= pendingAnswers.value.length) {
      currentIndex.value = pendingAnswers.value.length - 1
    }
    resetForm()
  }
}

const skipQuestion = () => {
  if (currentIndex.value < pendingAnswers.value.length - 1) {
    nextQuestion()
  }
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    resetForm()
  }
}

const nextQuestion = () => {
  if (currentIndex.value < pendingAnswers.value.length - 1) {
    currentIndex.value++
    resetForm()
  }
}

const backToList = () => {
  selectedExamId.value = null
  currentIndex.value = 0
  resetForm()
}
</script>
