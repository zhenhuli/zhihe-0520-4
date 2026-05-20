<template>
  <div class="container">
    <h1 class="title is-3 mb-6">考试设置</h1>

    <div class="columns">
      <div class="column is-8">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <div class="field">
                <label class="label">考试技能等级</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="form.level">
                      <option value="elementary">初级 ({{ statistics.byLevel.elementary }}题)</option>
                      <option value="intermediate">中级 ({{ statistics.byLevel.intermediate }}题)</option>
                      <option value="advanced">高级 ({{ statistics.byLevel.advanced }}题)</option>
                      <option value="expert">专家级 ({{ statistics.byLevel.expert }}题)</option>
                    </select>
                  </div>
                </div>
                <p class="help">选择本次考试要考核的技能等级</p>
              </div>

              <div class="field">
                <label class="label">考试时长（分钟）</label>
                <div class="control">
                  <input class="input" type="number" v-model.number="form.duration" min="5" max="180">
                </div>
                <p class="help">设置考试总时长，范围 5-180 分钟</p>
              </div>

              <div class="field">
                <label class="label">题目数量</label>
                <div class="control">
                  <input class="input" type="number" v-model.number="form.questionCount" min="1" :max="availableQuestionCount">
                </div>
                <p class="help">当前等级可用题目：{{ availableQuestionCount }} 题</p>
              </div>

              <div class="field">
                <label class="label">及格分数（%）</label>
                <div class="control">
                  <input class="input" type="number" v-model.number="form.passScore" min="0" max="100">
                </div>
                <p class="help">设置考试及格线，达到该分数百分比即为通过</p>
              </div>

              <div class="field">
                <label class="checkbox">
                  <input type="checkbox" v-model="form.includePractical">
                  包含实操简答题
                </label>
                <p class="help">勾选后将随机包含实操简答题（如该等级有此类题目）</p>
              </div>

              <div class="field">
                <label class="label">实操题分值占比</label>
                <div class="control">
                  <input class="input" type="range" v-model.number="form.practicalPoints" min="10" max="100">
                </div>
                <p class="help">实操题单题分值：{{ form.practicalPoints }} 分</p>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <div class="card-footer-item">
              <button class="button is-primary" @click="saveSettings">保存设置</button>
            </div>
            <div class="card-footer-item">
              <button class="button is-danger" @click="resetAllData">重置所有数据</button>
            </div>
          </footer>
        </div>
      </div>

      <div class="column is-4">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">设置预览</p>
          </header>
          <div class="card-content">
            <div class="content">
              <ul>
                <li><strong>考试等级：</strong>{{ skillLevelLabels[form.level] }}</li>
                <li><strong>考试时长：</strong>{{ form.duration }} 分钟</li>
                <li><strong>题目数量：</strong>{{ form.questionCount }} 题</li>
                <li><strong>及格分数：</strong>{{ form.passScore }}%</li>
                <li><strong>包含实操：</strong>{{ form.includePractical ? '是' : '否' }}</li>
                <li><strong>实操单题分值：</strong>{{ form.practicalPoints }} 分</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="card mt-4">
          <header class="card-header">
            <p class="card-header-title">当前题库统计</p>
          </header>
          <div class="card-content">
            <div class="content">
              <p><strong>总题目数：</strong>{{ statistics.total }}</p>
              <p><strong>理论选择题：</strong>{{ statistics.mcq }}</p>
              <p><strong>实操简答题：</strong>{{ statistics.practical }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { skillLevelLabels } from '~/composables/types'

const store = useQuestionStore()

onMounted(() => {
  store.init()
})

const form = ref({ ...store.settings })

const statistics = computed(() => store.statistics)

const availableQuestionCount = computed(() => {
  const levelQuestions = store.questions.filter(q => q.level === form.value.level)
  if (!form.value.includePractical) {
    return levelQuestions.filter(q => q.type === 'multiple_choice').length
  }
  return levelQuestions.length
})

const saveSettings = () => {
  store.settings = { ...form.value }
  store.saveSettings()
  alert('设置已保存！')
}

const resetAllData = () => {
  if (confirm('确定要重置所有数据吗？这将恢复默认题库、设置和历史记录！')) {
    store.resetAllData()
    form.value = { ...store.settings }
    alert('数据已重置！')
  }
}
</script>
