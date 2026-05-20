<template>
  <div class="container">
    <div class="level">
      <div class="level-left">
        <h1 class="title is-3">专项强化练习</h1>
      </div>
      <div class="level-right">
        <button v-if="wrongQuestions.length > 0 && !isPracticing && !showResult" 
                class="button is-primary" 
                @click="startPractice">
          <span class="icon"><i>🎯</i></span>
          <span>开始强化练习</span>
        </button>
        <button v-if="wrongQuestions.length > 0" 
                class="button is-danger ml-2" 
                @click="clearAllWrong">
          <span class="icon"><i>🗑️</i></span>
          <span>清空错题</span>
        </button>
      </div>
    </div>

    <div v-if="wrongQuestions.length === 0 && !isPracticing && !showResult" class="card">
      <div class="card-content has-text-centered py-6">
        <p class="is-size-1">🎉</p>
        <p class="is-size-4 mt-3">太棒了！没有错题记录</p>
        <p class="has-text-grey mt-2">完成考试后，答错的题目会自动添加到这里</p>
        <NuxtLink to="/exam" class="button is-primary mt-4">
          去参加考试
        </NuxtLink>
      </div>
    </div>

    <div v-else-if="!isPracticing && !showResult" class="card">
      <div class="card-content">
        <div class="content">
          <p class="is-size-5 mb-4">共有 <strong class="has-text-danger">{{ wrongQuestions.length }}</strong> 道错题需要强化练习</p>
          
          <div class="columns">
            <div class="column is-3">
              <div class="notification is-info">
                <p class="heading">初级</p>
                <p class="title">{{ countByLevel('elementary') }}</p>
              </div>
            </div>
            <div class="column is-3">
              <div class="notification is-warning">
                <p class="heading">中级</p>
                <p class="title">{{ countByLevel('intermediate') }}</p>
              </div>
            </div>
            <div class="column is-3">
              <div class="notification is-danger">
                <p class="heading">高级</p>
                <p class="title">{{ countByLevel('advanced') }}</p>
              </div>
            </div>
            <div class="column is-3">
              <div class="notification is-link">
                <p class="heading">专家级</p>
                <p class="title">{{ countByLevel('expert') }}</p>
              </div>
            </div>
          </div>

          <h3 class="title is-5 mt-5">错题列表</h3>
          <div class="space-y-3">
            <div v-for="question in wrongQuestions" :key="question.id" class="box">
              <div class="level">
                <div class="level-left">
                  <span class="tag" :class="question.type === 'multiple_choice' ? 'is-info' : 'is-warning'">
                    {{ questionTypeLabels[question.type] }}
                  </span>
                  <span class="level-badge ml-2" :class="`level-${question.level}`">
                    {{ skillLevelLabels[question.level] }}
                  </span>
                  <span class="tag is-light ml-2">{{ question.category }}</span>
                </div>
                <div class="level-right">
                  <button class="button is-small is-danger" @click="removeFromWrong(question.id)">
                    移除
                  </button>
                </div>
              </div>
              <p class="mt-2">{{ question.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="isPracticing && !showResult">
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
                  </div>
                </div>
                <div class="level-right">
                  <div class="level-item">
                    <span class="has-text-weight-bold">{{ currentIndex + 1 }} / {{ practiceQuestions.length }}</span>
                  </div>
                </div>
              </div>

              <div class="content mt-5">
                <p class="is-size-4 has-text-weight-semibold">{{ currentQuestion.title }}</p>
              </div>

              <div v-if="currentQuestion.type === 'multiple_choice' && currentQuestion.options" class="mt-5">
                <div v-for="option in currentQuestion.options" :key="option.key" 
                     class="box mb-3"
                     :class="getOptionClass(option.key)"
                     style="cursor: pointer;"
                     @click="selectOption(option.key)">
                  <div class="field">
                    <label class="radio is-large">
                      <input type="radio" :name="`question-${currentQuestion.id}`" :value="option.key" 
                             v-model="currentAnswer" :disabled="showAnswer">
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
                      rows="6" 
                      placeholder="请详细描述你的解答过程..."
                      :disabled="showAnswer"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div v-if="showAnswer" class="notification mt-4" :class="currentQuestion.type === 'multiple_choice' ? (isCorrect ? 'is-success' : 'is-danger') : 'is-info'">
                <p class="has-text-weight-bold" v-if="currentQuestion.type === 'multiple_choice'">
                  {{ isCorrect ? '✓ 回答正确！' : '✗ 回答错误' }}
                </p>
                <p class="has-text-weight-bold" v-else>
                  📝 学习模式 - 请对比以下参考答案自行评估
                </p>
                <p class="mt-2"><strong>参考答案：</strong>{{ currentQuestion.correctAnswer }}</p>
                <p class="mt-2"><strong>解析：</strong>{{ currentQuestion.explanation }}</p>
                <div class="buttons mt-3">
                  <button v-if="currentQuestion.type === 'multiple_choice' && !isCorrect" class="button is-small is-primary" @click="markAsMastered">
                    标记为已掌握
                  </button>
                  <button v-if="currentQuestion.type === 'practical_essay'" class="button is-small is-primary" @click="markAsMastered">
                    已掌握，移出错题本
                  </button>
                </div>
              </div>

              <div class="buttons are-medium is-centered mt-6">
                <button v-if="!showAnswer" class="button is-primary" @click="checkAnswer">
                  <span class="icon"><i>✓</i></span>
                  <span>查看答案</span>
                </button>
                <button v-if="showAnswer && currentIndex < practiceQuestions.length - 1" 
                        class="button is-primary" 
                        @click="nextQuestion">
                  <span>下一题</span>
                  <span class="icon"><i>→</i></span>
                </button>
                <button v-if="showAnswer && currentIndex === practiceQuestions.length - 1" 
                        class="button is-success" 
                        @click="finishPractice">
                  <span class="icon"><i>🏆</i></span>
                  <span>完成练习</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="column is-3">
          <div class="card is-sticky">
            <div class="card-content">
              <p class="heading">练习进度</p>
              <progress class="progress is-primary" :value="currentIndex + (showAnswer ? 1 : 0)" :max="practiceQuestions.length">
              </progress>
              <p class="has-text-centered has-text-grey is-size-7 mt-1">
                {{ currentIndex + 1 }} / {{ practiceQuestions.length }} 题
              </p>

              <hr>

              <p class="heading mb-3">答题卡</p>
              <div class="is-flex is-flex-wrap-wrap is-justify-content-center" style="gap: 8px;">
                <button 
                  v-for="(q, idx) in practiceQuestions" 
                  :key="q.id"
                  class="button is-small"
                  :class="[
                    currentIndex === idx ? 'is-primary' : '',
                    idx < currentIndex ? 'is-light has-text-success' : 'is-light'
                  ]"
                >
                  {{ idx + 1 }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="showResult" class="card">
      <div class="card-content has-text-centered py-6">
        <p class="is-size-1">🎯</p>
        <p class="title is-3 mt-3">练习完成！</p>
        <p class="subtitle">本次练习完成 {{ practiceQuestions.length }} 道题目</p>
        
        <div class="box mt-5" style="max-width: 400px; margin: 0 auto;">
          <div class="content">
            <p><strong>已掌握题目：</strong><span class="has-text-success">{{ masteredCount }}</span> 道</p>
            <p><strong>待继续强化：</strong><span class="has-text-danger">{{ wrongQuestions.length }}</span> 道</p>
          </div>
        </div>

        <div class="buttons are-large is-centered mt-5">
          <button v-if="wrongQuestions.length > 0" class="button is-primary" @click="restartPractice">
            <span class="icon"><i>🔄</i></span>
            <span>继续练习</span>
          </button>
          <NuxtLink to="/" class="button is-light">
            <span>返回首页</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { skillLevelLabels, questionTypeLabels } from '~/composables/types'
import type { Question } from '~/composables/types'

const store = useQuestionStore()

onMounted(() => {
  store.init()
})

const currentIndex = ref(0)
const isPracticing = ref(false)
const showAnswer = ref(false)
const showResult = ref(false)
const currentAnswer = ref('')
const masteredCount = ref(0)

const wrongQuestions = computed(() => store.getWrongQuestions)
const practiceQuestions = computed(() => store.currentExam.questions)
const currentQuestion = computed((): Question => {
  return practiceQuestions.value[currentIndex.value] || {} as Question
})

const isCorrect = computed(() => {
  if (!currentQuestion.value) return false
  if (currentQuestion.value.type === 'multiple_choice') {
    return currentAnswer.value.toUpperCase() === currentQuestion.value.correctAnswer.toUpperCase()
  }
  return false
})

const countByLevel = (level: string) => {
  return wrongQuestions.value.filter(q => q.level === level).length
}

const startPractice = () => {
  const success = store.startPractice()
  if (success) {
    isPracticing.value = true
    showAnswer.value = false
    showResult.value = false
    currentIndex.value = 0
    currentAnswer.value = ''
    masteredCount.value = 0
  }
}

const selectOption = (key: string) => {
  if (!showAnswer.value) {
    currentAnswer.value = key
  }
}

const checkAnswer = () => {
  if (!currentAnswer.value.trim()) {
    alert('请先输入答案')
    return
  }
  showAnswer.value = true
}

const getOptionClass = (key: string) => {
  if (!showAnswer.value) {
    return currentAnswer.value === key ? 'has-background-primary-light' : ''
  }
  if (key === currentQuestion.value.correctAnswer) {
    return 'correct-answer'
  }
  if (key === currentAnswer.value && key !== currentQuestion.value.correctAnswer) {
    return 'wrong-answer'
  }
  return ''
}

const markAsMastered = () => {
  if (currentQuestion.value) {
    store.removeFromWrongQuestions(currentQuestion.value.id)
    masteredCount.value++
  }
}

const nextQuestion = () => {
  if (currentIndex.value < practiceQuestions.value.length - 1) {
    currentIndex.value++
    currentAnswer.value = ''
    showAnswer.value = false
  }
}

const finishPractice = () => {
  store.currentExam.isActive = false
  isPracticing.value = false
  showResult.value = true
}

const restartPractice = () => {
  showResult.value = false
  masteredCount.value = 0
  startPractice()
}

const removeFromWrong = (id: string) => {
  if (confirm('确定要将这道题从错题本中移除吗？')) {
    store.removeFromWrongQuestions(id)
  }
}

const clearAllWrong = () => {
  if (confirm('确定要清空所有错题记录吗？')) {
    store.clearWrongQuestions()
  }
}
</script>

<style scoped>
.is-sticky {
  position: sticky;
  top: 1rem;
}
</style>
