<template>
  <div class="package-input">
    <h3 class="text-lg font-semibold mb-16">快件录入</h3>
    
    <div class="form-group">
      <label>收件人姓名</label>
      <input v-model="formData.receiverName" class="input" placeholder="请输入收件人姓名" />
    </div>

    <div class="form-group">
      <label>联系电话</label>
      <input v-model="formData.receiverPhone" class="input" placeholder="请输入联系电话" />
    </div>

    <div class="form-group">
      <label>所在区域</label>
      <select v-model="formData.district" class="select">
        <option value="">请选择区域</option>
        <option v-for="district in districts" :key="district" :value="district">{{ district }}</option>
      </select>
    </div>

    <div class="form-group">
      <label>详细地址</label>
      <input v-model="formData.address" class="input" placeholder="请输入详细地址" />
    </div>

    <div class="grid grid-2 gap-12">
      <div class="form-group">
        <label>重量 (kg)</label>
        <input v-model.number="formData.weight" type="number" step="0.1" class="input" placeholder="0.0" />
      </div>

      <div class="form-group">
        <label>包裹大小</label>
        <select v-model="formData.size" class="select">
          <option value="small">小件</option>
          <option value="medium">中件</option>
          <option value="large">大件</option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label>优先级</label>
      <div class="priority-options">
        <label class="priority-option" :class="{ active: formData.priority === 'normal' }">
          <input type="radio" v-model="formData.priority" value="normal" />
          <span>普通</span>
        </label>
        <label class="priority-option" :class="{ active: formData.priority === 'express' }">
          <input type="radio" v-model="formData.priority" value="express" />
          <span>加急</span>
        </label>
        <label class="priority-option" :class="{ active: formData.priority === 'fragile' }">
          <input type="radio" v-model="formData.priority" value="fragile" />
          <span>易碎</span>
        </label>
      </div>
    </div>

    <div class="flex gap-12 mt-20">
      <button class="btn btn-primary flex-1" @click="handleSubmit">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="8.5" cy="7" r="4"/>
          <line x1="20" y1="8" x2="20" y2="14"/>
          <line x1="23" y1="11" x2="17" y2="11"/>
        </svg>
        录入快件
      </button>
      <button class="btn btn-success flex-1" @click="handleRandom">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
        随机生成
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Package } from '~/types'

const emit = defineEmits<{
  (e: 'submit', data: Partial<Package>): void
  (e: 'random'): void
}>()

const districts = ['朝阳区', '海淀区', '东城区', '西城区', '丰台区', '通州区', '昌平区', '大兴区']

const formData = ref({
  receiverName: '',
  receiverPhone: '',
  district: '',
  address: '',
  weight: 1.0,
  size: 'medium' as 'small' | 'medium' | 'large',
  priority: 'normal' as 'normal' | 'express' | 'fragile'
})

const handleSubmit = () => {
  if (!formData.value.receiverName || !formData.value.district) {
    alert('请填写收件人姓名和选择区域')
    return
  }
  emit('submit', { ...formData.value })
  formData.value = {
    receiverName: '',
    receiverPhone: '',
    district: '',
    address: '',
    weight: 1.0,
    size: 'medium',
    priority: 'normal'
  }
}

const handleRandom = () => {
  emit('random')
}
</script>

<style lang="scss" scoped>
.package-input {
  background: $card-bg;
  border-radius: $radius-lg;
  border: 1px solid $border-color;
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;

  label {
    display: block;
    font-size: 13px;
    color: $text-secondary;
    margin-bottom: 6px;
  }
}

.priority-options {
  display: flex;
  gap: 8px;
}

.priority-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border-radius: $radius-md;
  border: 1px solid $border-color;
  cursor: pointer;
  transition: all $transition-fast;
  font-size: 13px;

  input {
    display: none;
  }

  &:hover {
    border-color: $primary-color;
  }

  &.active {
    background: rgba(37, 99, 235, 0.15);
    border-color: $primary-color;
    color: $secondary-color;
  }
}
</style>
