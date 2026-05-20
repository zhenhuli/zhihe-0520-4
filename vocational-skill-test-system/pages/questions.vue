<template>
  <div class="container">
    <div class="level">
      <div class="level-left">
        <h1 class="title is-3">题库管理</h1>
      </div>
      <div class="level-right">
        <button class="button is-primary" @click="showAddModal = true">
          <span class="icon"><i>+</i></span>
          <span>添加题目</span>
        </button>
      </div>
    </div>

    <div class="card mb-5">
      <div class="card-content">
        <div class="field is-grouped is-multiline">
          <p class="control">
            <span class="select">
              <select v-model="filterLevel">
                <option value="">全部等级</option>
                <option value="elementary">初级</option>
                <option value="intermediate">中级</option>
                <option value="advanced">高级</option>
                <option value="expert">专家级</option>
              </select>
            </span>
          </p>
          <p class="control">
            <span class="select">
              <select v-model="filterType">
                <option value="">全部题型</option>
                <option value="multiple_choice">理论选择题</option>
                <option value="practical_essay">实操简答题</option>
              </select>
            </span>
          </p>
          <p class="control is-expanded">
            <input class="input" type="text" v-model="searchKeyword" placeholder="搜索题目内容...">
          </p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-content">
        <div v-if="filteredQuestions.length === 0" class="has-text-centered py-6">
          <p class="is-size-5 has-text-grey">暂无题目数据</p>
          <p class="has-text-grey-light mt-2">点击"添加题目"按钮创建新题目</p>
        </div>
        <div v-else class="space-y-4">
          <div v-for="question in filteredQuestions" :key="question.id" class="question-card box">
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item">
                  <span class="tag mr-2" :class="question.type === 'multiple_choice' ? 'is-info' : 'is-warning'">
                    {{ questionTypeLabels[question.type] }}
                  </span>
                  <span class="level-badge" :class="`level-${question.level}`">
                    {{ skillLevelLabels[question.level] }}
                  </span>
                  <span class="tag is-light ml-2">{{ question.category }}</span>
                  <span class="tag is-dark ml-2">{{ question.points }}分</span>
                </div>
              </div>
              <div class="level-right">
                <div class="buttons are-small">
                  <button class="button is-info" @click="editQuestion(question)">编辑</button>
                  <button class="button is-danger" @click="deleteQuestion(question.id)">删除</button>
                </div>
              </div>
            </div>
            <p class="is-size-5 mt-3 mb-3">{{ question.title }}</p>
            <div v-if="question.type === 'multiple_choice' && question.options" class="ml-4">
              <div v-for="option in question.options" :key="option.key" class="mb-1">
                <span :class="option.key === question.correctAnswer ? 'has-text-weight-bold has-text-success' : ''">
                  {{ option.key }}. {{ option.text }}
                  <span v-if="option.key === question.correctAnswer" class="tag is-success is-small ml-2">正确答案</span>
                </span>
              </div>
            </div>
            <div v-else class="ml-4">
              <p class="has-text-grey">参考答案：{{ question.correctAnswer.substring(0, 100) }}...</p>
            </div>
            <p class="has-text-grey-light mt-2 is-size-7">解析：{{ question.explanation }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" :class="{ 'is-active': showAddModal }">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-card" style="width: 90%; max-height: 90vh; overflow-y: auto;">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ editingId ? '编辑题目' : '添加题目' }}</p>
          <button class="delete" aria-label="close" @click="closeModal"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">题目类型</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="form.type">
                  <option value="multiple_choice">理论选择题</option>
                  <option value="practical_essay">实操简答题</option>
                </select>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label">技能等级</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="form.level">
                  <option value="elementary">初级</option>
                  <option value="intermediate">中级</option>
                  <option value="advanced">高级</option>
                  <option value="expert">专家级</option>
                </select>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label">分类</label>
            <div class="control">
              <input class="input" type="text" v-model="form.category" placeholder="例如：JavaScript、CSS基础">
            </div>
          </div>

          <div class="field">
            <label class="label">题目内容</label>
            <div class="control">
              <textarea class="textarea" v-model="form.title" rows="3" placeholder="请输入题目内容"></textarea>
            </div>
          </div>

          <div class="field">
            <label class="label">分值</label>
            <div class="control">
              <input class="input" type="number" v-model.number="form.points" min="1" max="100">
            </div>
          </div>

          <div v-if="form.type === 'multiple_choice'">
            <label class="label">选项设置</label>
            <div v-for="(option, index) in form.options" :key="index" class="field is-grouped mb-2">
              <p class="control">
                <input class="input" type="text" :value="option.key" disabled style="width: 50px;">
              </p>
              <p class="control is-expanded">
                <input class="input" type="text" v-model="option.text" :placeholder="`选项 ${option.key} 内容`">
              </p>
              <p class="control">
                <button 
                  class="button" 
                  :class="form.correctAnswer === option.key ? 'is-success' : ''"
                  @click="form.correctAnswer = option.key"
                >
                  {{ form.correctAnswer === option.key ? '✓ 正确' : '设为正确' }}
                </button>
              </p>
            </div>
          </div>

          <div v-else>
            <div class="field">
              <label class="label">参考答案</label>
              <div class="control">
                <textarea class="textarea" v-model="form.correctAnswer" rows="6" placeholder="请输入参考答案，用于自动评分对比"></textarea>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label">题目解析</label>
            <div class="control">
              <textarea class="textarea" v-model="form.explanation" rows="3" placeholder="请输入题目解析，用于错题回顾"></textarea>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary" @click="saveQuestion">保存</button>
          <button class="button" @click="closeModal">取消</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Question, QuestionType, SkillLevel, QuestionOption } from '~/composables/types'
import { questionTypeLabels, skillLevelLabels } from '~/composables/types'

const store = useQuestionStore()

onMounted(() => {
  store.init()
})

const filterLevel = ref('')
const filterType = ref('')
const searchKeyword = ref('')
const showAddModal = ref(false)
const editingId = ref<string | null>(null)

const defaultForm = () => ({
  type: 'multiple_choice' as QuestionType,
  level: 'intermediate' as SkillLevel,
  category: '',
  title: '',
  options: [
    { key: 'A', text: '' },
    { key: 'B', text: '' },
    { key: 'C', text: '' },
    { key: 'D', text: '' }
  ] as QuestionOption[],
  correctAnswer: 'A',
  explanation: '',
  points: 10
})

const form = ref(defaultForm())

const filteredQuestions = computed(() => {
  let questions = [...store.questions]
  
  if (filterLevel.value) {
    questions = questions.filter(q => q.level === filterLevel.value)
  }
  
  if (filterType.value) {
    questions = questions.filter(q => q.type === filterType.value)
  }
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    questions = questions.filter(q => 
      q.title.toLowerCase().includes(keyword) || 
      q.category.toLowerCase().includes(keyword)
    )
  }
  
  return questions.sort((a, b) => b.createdAt - a.createdAt)
})

const editQuestion = (question: Question) => {
  editingId.value = question.id
  form.value = {
    type: question.type,
    level: question.level,
    category: question.category,
    title: question.title,
    options: question.options ? [...question.options] : [],
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    points: question.points
  }
  showAddModal.value = true
}

const deleteQuestion = (id: string) => {
  if (confirm('确定要删除这道题目吗？')) {
    store.deleteQuestion(id)
  }
}

const saveQuestion = () => {
  if (!form.value.title.trim()) {
    alert('请输入题目内容')
    return
  }
  
  if (form.value.type === 'multiple_choice') {
    const emptyOptions = form.value.options.filter(o => !o.text.trim())
    if (emptyOptions.length > 0) {
      alert('请填写所有选项内容')
      return
    }
  } else {
    if (!form.value.correctAnswer.trim()) {
      alert('请输入参考答案')
      return
    }
  }

  if (editingId.value) {
    store.updateQuestion(editingId.value, {
      ...form.value,
      options: form.value.type === 'multiple_choice' ? form.value.options : undefined
    })
  } else {
    store.addQuestion({
      ...form.value,
      options: form.value.type === 'multiple_choice' ? form.value.options : undefined
    })
  }
  
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  editingId.value = null
  form.value = defaultForm()
}
</script>
