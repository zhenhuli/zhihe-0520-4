<template>
  <div class="container">
    <div v-if="!isExamStarted && !examResult">
      <div class="card">
        <div class="card-content has-text-centered py-6">
          <p class="title is-3">准备开始考试</p>
          <p class="subtitle mt-3">请确认以下考试信息</p>
          
          <div class="box mt-5" style="max-width: 500px; margin: 0 auto; text-align: left;">
            <div class="content">
              <p><strong>考试等级：</strong><span class="level-badge" :class="`level-${settings.level}`">{{ skillLevelLabels[settings.level] }}</span></p>
              <p><strong>考试时长：</strong>{{ settings.duration }} 分钟</p>
              <p><strong>题目数量：</strong>{{ settings.questionCount }} 题</p>
              <p><strong>及格分数：</strong>{{ settings.passScore }}%</p>
              <p><strong>包含实操题：</strong>{{ settings.includePractical ? '是' : '否' }}</p>
            </div>
          </div>

          <div class="buttons are-large is-centered mt-5">
            <button class="button is-primary" @click="startExam">
              <span class="icon"><i>✍️</i></span>
              <span>开始考试</span>
            </button>
            <NuxtLink to="/settings" class="button is-light">
              <span>修改设置</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="isExamStarted && !examResult">
      <div class="columns">
        <div class="column is-9">
          <div class="card">
            <div class="card-content">
              <div class="level">
                <div class="level-left">
                  <div class="level-item">
                    <span class="tag is-info">{{ questionTypeLabels[currentQuestion.type] }}</span>
                    <span class="level-badge ml-2" :class="`level-${currentQuestion.level}`">
                      {{ skillLevelLabels[currentQuestion.level] }}
                    </span>
                    <span class="tag is-light ml-2">{{ currentQuestion.category }}</span>
                    <span class="tag is-dark ml-2">{{ currentQuestion.points }}分</span>
                  </div>
                </div>
                <div class="level-right">
                  <div class="level-item">
                    <span class="has-text-weight-bold">{{ currentIndex + 1 }} / {{ questions.length }}</span>
                  </div>
                </div>
              </div>

              <div class="content mt-5">
                <p class="is-size-4 has-text-weight-semibold">{{ currentQuestion.title }}</p>
              </div>

              <div v-if="currentQuestion.type === 'multiple_choice' && currentQuestion.options" class="mt-5">
                <div v-for="option in currentQuestion.options" :key="option.key" 
                     class="box mb-3"
                     :class="{ 'has-background-primary-light': currentAnswer === option.key }"
                     style="cursor: pointer;"
                     @click="selectOption(option.key)">
                  <div class="field">
                    <label class="radio is-large">
                      <input type="radio" :name="`question-${currentQuestion.id}`" :value="option.key" v-model="currentAnswer">
                      <span class="ml-2"><strong>{{ option.key }}.</strong> {{ option.text }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div v-else class="mt-5">
                <div class="field">
                  <label class="label">请输入你的答案：</label>
                  <div class="control">
                    <textarea 
                      class="textarea is-medium" 
                      v-model="currentAnswer" 
                      rows="8" 
                      placeholder="请详细描述你的解答过程..."
                    ></textarea>
                  </div>
                  <p class="help">{{ currentAnswer.length }} 字</p>
                </div>
              </div>

              <div class="buttons are-medium is-centered mt-6">
                <button class="button" :disabled="currentIndex === 0" @click="prevQuestion">
                  <span class="icon"><i>←</i></span>
                  <span>上一题</span>
                </button>
                <button v-if="currentIndex < questions.length - 1" class="button is-primary" @click="nextQuestion">
                  <span>下一题</span>
                  <span class="icon"><i>→</i></span>
                </button>
                <button v-else class="button is-success" @click="confirmSubmit">
                  <span class="icon"><i>✓</i></span>
                  <span>提交试卷</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="column is-3">
          <div class="card is-sticky">
            <div class="card-content">
              <div class="has-text-centered">
                <p class="heading">剩余时间</p>
                <p class="timer-display" :class="{ 'has-text-danger': remainingTime < 300 }">
                  {{ formatTime(remainingTime) }}
                </p>
              </div>
              
              <hr>

              <p class="heading mb-3">答题进度</p>
              <progress class="progress is-primary" :value="answeredCount" :max="questions.length">
                {{ answeredCount }}/{{ questions.length }}
              </progress>
              <p class="has-text-centered has-text-grey is-size-7 mt-1">
                已答 {{ answeredCount }} / {{ questions.length }} 题
              </p>

              <hr>

              <p class="heading mb-3">答题卡</p>
              <div class="is-flex is-flex-wrap-wrap is-justify-content-center" style="gap: 8px;">
                <button 
                  v-for="(q, idx) in questions" 
                  :key="q.id"
                  class="button is-small"
                  :class="[
                    currentIndex === idx ? 'is-primary' : '',
                    getAnswer(q.id) ? 'is-light has-text-success' : 'is-light'
                  ]"
                  @click="goToQuestion(idx)"
                >
                  {{ idx + 1 }}
                </button>
              </div>

              <hr>

              <button class="button is-danger is-fullwidth" @click="confirmSubmit">
                <span class="icon"><i>📤</i></span>
                <span>提前交卷</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="examResult">
      <div class="card">
        <div class="card-content has-text-centered py-6">
          <div v-if="examResult.pendingReviewCount > 0" class="notification is-warning mb-5">
            <p class="is-size-5">⏳ 待人工审阅</p>
            <p class="mt-2">本次考试包含 <strong>{{ examResult.pendingReviewCount }}</strong> 道实操简答题，需要人工审阅后才能得出最终成绩</p>
          </div>
          
          <div class="score-display" :class="examResult.isReviewed ? (examResult.isPassed ? 'has-text-success' : 'has-text-danger') : 'has-text-warning'">
            {{ examResult.totalScore }} / {{ examResult.maxScore }}
          </div>
          <p class="is-size-4 mt-3">
            <span class="tag is-large" :class="!examResult.isReviewed ? 'is-warning' : (examResult.isPassed ? 'is-success' : 'is-danger')">
              {{ !examResult.isReviewed ? '⏳ 待审阅' : (examResult.isPassed ? '🎉 考试通过！' : '😢 未通过') }}
            </span>
          </p>
          <p class="has-text-grey mt-2">
            <span v-if="examResult.isReviewed">
              正确率：{{ Math.round(examResult.totalScore / examResult.maxScore * 100) }}% 
              （及格线：{{ settings.passScore }}%）
            </span>
            <span v-else>
              此为选择题得分，最终成绩需等简答题审阅完成后公布
            </span>
          </p>
          <p class="has-text-grey">
            用时：{{ formatTime(Math.round((examResult.endTime - examResult.startTime) / 1000)) }}
          </p>

          <div class="buttons are-large is-centered mt-5">
            <button class="button is-primary" @click="resetExam">
              <span class="icon"><i>🔄</i></span>
              <span>再考一次</span>
            </button>
            <NuxtLink v-if="examResult.pendingReviewCount > 0" :to="`/review/${examResult.id}`" class="button is-warning">
              <span class="icon"><i>📝</i></span>
              <span>人工审阅 ({{ examResult.pendingReviewCount }}题)</span>
            </NuxtLink>
            <NuxtLink v-else to="/practice" class="button is-warning">
              <span class="icon"><i>📖</i></span>
              <span>查看错题 ({{ examResult.wrongAnswers.length }}题)</span>
            </NuxtLink>
            <NuxtLink to="/" class="button is-light">
              <span>返回首页</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="card mt-5">
        <header class="card-header">
          <p class="card-header-title">答题详情</p>
        </header>
        <div class="card-content">
          <div v-for="(answer, idx) in examResult.answers" :key="answer.questionId" class="box mb-4">
            <div class="level">
              <div class="level-left">
                <span v-if="answer.needsReview && !answer.isReviewed" class="tag is-warning">
                  ⏳ 待审阅
                </span>
                <span v-else class="tag" :class="answer.isCorrect ? 'is-success' : 'is-danger'">
                  {{ answer.isCorrect ? '✓ 正确' : '✗ 错误' }}
                </span>
                <span class="ml-2">第 {{ idx + 1 }} 题</span>
                <span class="tag is-light ml-2">{{ answer.score }} 分</span>
                <span v-if="answer.manualScore !== undefined" class="tag is-info ml-2">人工评分</span>
              </div>
            </div>
            <p class="mt-3 has-text-weight-semibold">{{ getQuestion(answer.questionId)?.title }}</p>
            <div v-if="getQuestion(answer.questionId)?.type === 'multiple_choice'" class="mt-2 ml-4">
              <p v-for="opt in getQuestion(answer.questionId)?.options" :key="opt.key" 
                 :class="[
                   opt.key === getQuestion(answer.questionId)?.correctAnswer ? 'has-text-success' : '',
                   opt.key === answer.answer && opt.key !== getQuestion(answer.questionId)?.correctAnswer ? 'has-text-danger' : ''
                 ]">
                {{ opt.key }}. {{ opt.text }}
                <span v-if="opt.key === getQuestion(answer.questionId)?.correctAnswer" class="tag is-success is-small ml-2">正确答案</span>
                <span v-if="opt.key === answer.answer && opt.key !== getQuestion(answer.questionId)?.correctAnswer" class="tag is-danger is-small ml-2">你的选择</span>
              </p>
            </div>
            <div v-else class="mt-2 ml-4">
              <p><strong>你的答案：</strong>{{ answer.answer || '(未作答)' }}</p>
              <p class="mt-2"><strong>参考答案：</strong>{{ getQuestion(answer.questionId)?.correctAnswer }}</p>
              <p v-if="answer.needsReview && !answer.isReviewed" class="mt-3 notification is-warning">
                ⏳ 此题为实操简答题，需要人工审阅后才能给出最终得分
              </p>
            </div>
            <p class="mt-3 has-text-grey is-size-7">
              <strong>解析：</strong>{{ getQuestion(answer.questionId)?.explanation }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExamResult, Question } from '~/composables/types'
import { skillLevelLabels, questionTypeLabels } from '~/composables/types'

const store = useQuestionStore()

onMounted(() => {
  store.init()
})

const settings = computed(() => store.settings)
const questions = computed(() => store.currentExam.questions)
const currentIndex = ref(0)
const remainingTime = ref(0)
const examResult = ref<ExamResult | null>(null)
let timerInterval: ReturnType<typeof setInterval> | null = null

const isExamStarted = computed(() => store.currentExam.isActive)

const currentQuestion = computed((): Question => {
  return questions.value[currentIndex.value] || {} as Question
})

const currentAnswer = computed({
  get: () => store.currentExam.answers[currentIndex.value]?.answer || '',
  set: (val: string) => {
    if (questions.value[currentIndex.value]) {
      store.submitAnswer(questions.value[currentIndex.value].id, val)
    }
  }
})

const answeredCount = computed(() => {
  return store.currentExam.answers.filter(a => a.answer.trim()).length
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const getAnswer = (questionId: string) => {
  return store.currentExam.answers.find(a => a.questionId === questionId)?.answer
}

const getQuestion = (questionId: string) => {
  return store.questions.find(q => q.id === questionId)
}

const selectOption = (key: string) => {
  currentAnswer.value = key
}

const startExam = () => {
  store.startExam()
  currentIndex.value = 0
  remainingTime.value = store.settings.duration * 60
  examResult.value = null
  startTimer()
}

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    remainingTime.value--
    if (remainingTime.value <= 0) {
      submitExam()
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  }
}

const goToQuestion = (idx: number) => {
  currentIndex.value = idx
}

const confirmSubmit = () => {
  const unanswered = questions.value.length - answeredCount.value
  let message = `确定要提交试卷吗？`
  if (unanswered > 0) {
    message += `\n还有 ${unanswered} 道题未作答。`
  }
  if (confirm(message)) {
    submitExam()
  }
}

const submitExam = () => {
  stopTimer()
  examResult.value = store.finishExam()
}

const resetExam = () => {
  examResult.value = null
  currentIndex.value = 0
}

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.is-sticky {
  position: sticky;
  top: 1rem;
}
</style>
