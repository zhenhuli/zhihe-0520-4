<script>
  import {
    calculateCalories,
    calculateFitnessIndex,
    getFitnessLevel,
    estimateMaxSafeDuration
  } from '../../lib/utils/calorieCalculator.js';
  import {
    intensityLevels,
    calculateWaterIntake,
    calculateFoodIntake,
    calculateElectrolyteIntake,
    getHydrationTips,
    getNutritionTips
  } from '../../lib/utils/nutritionCalculator.js';
  import { saveTrip } from '../../lib/utils/tripArchive.js';
  export const prerender = true;

  let showSaveModal = false;
  let saveName = '';
  let saveNotes = '';

  let distance = 10;
  let elevation = 300;
  let weight = 65;
  let packWeight = 10;
  let speed = 4;
  let temperature = 20;
  let restingHeartRate = 65;
  let vo2max = 40;
  let weeklyExerciseHours = 5;
  let activityFrequency = 2;
  let intensity = 'moderate';

  $: formData = { distance, elevation, weight, packWeight, speed, temperature };
  $: fitnessData = { restingHeartRate, vo2max, weeklyExerciseHours, activityFrequency };
  $: hydrationData = { duration: parseFloat(result.durationHours), temperature, elevation, intensity, weight, packWeight };
  $: altitude = elevation;

  $: result = calculateCalories(formData);
  $: fitnessIndex = calculateFitnessIndex(fitnessData);
  $: fitnessLevel = getFitnessLevel(fitnessIndex);
  $: maxSafeDuration = estimateMaxSafeDuration({
    fitnessIndex, distance, elevation, packWeight
  });

  $: waterIntake = calculateWaterIntake(hydrationData);
  $: foodIntake = calculateFoodIntake({
    duration: parseFloat(result.durationHours),
    caloriesPerHour: result.caloriesPerHour,
    intensity
  });
  $: electrolytes = calculateElectrolyteIntake({
    duration: parseFloat(result.durationHours),
    temperature,
    intensity
  });
  $: hydrationTips = getHydrationTips({ temperature, elevation, duration: parseFloat(result.durationHours) });
  $: nutritionTips = getNutritionTips({ intensity, duration: parseFloat(result.durationHours) });

  $: isStrenuous = elevation / Math.max(distance, 1) > 50 || packWeight > 18;
  $: isLongDistance = distance > 20;
  $: isHighElevation = elevation > 1000;

  function openSaveModal() {
    saveName = `体能测算-${new Date().toLocaleDateString('zh-CN')}`;
    saveNotes = '';
    showSaveModal = true;
  }

  function handleSave() {
    if (!saveName.trim()) {
      alert('请输入方案名称');
      return;
    }
    
    saveTrip({
      type: 'fitness',
      name: saveName.trim(),
      notes: saveNotes.trim(),
      data: {
        distance,
        elevation,
        weight,
        packWeight,
        speed,
        temperature,
        intensity,
        restingHeartRate,
        vo2max,
        weeklyExerciseHours,
        activityFrequency,
        result: {
          totalCalories: result.totalCalories,
          durationHours: result.durationHours,
          caloriesPerHour: result.caloriesPerHour
        },
        fitnessIndex,
        fitnessLevel: fitnessLevel.label,
        waterIntake: {
          totalLiters: waterIntake.totalLiters,
          waterPerHour: waterIntake.waterPerHour
        },
        foodIntake: {
          totalCalories: foodIntake.totalCalories,
          totalGrams: foodIntake.totalGrams
        }
      }
    });
    
    alert('方案已保存到存档！');
    showSaveModal = false;
  }
</script>

<div class="module-page">
  <header class="module-header">
    <div class="module-header-icon" style="background: #f97316">🔥</div>
    <div>
      <h1>体能与营养规划</h1>
      <p class="module-subtitle">体能消耗测算 · 饮水计划 · 食物配比 · 完整补给方案</p>
    </div>
  </header>

  <div class="module-layout">
    <section class="input-panel">
      <h2 class="panel-title">行程参数</h2>
      <div class="form-single-column">
        <div class="form-group">
          <label class="form-label">徒步里程</label>
          <div class="range-input">
            <input type="range" bind:value={distance} min="1" max="100" step="1" />
            <span class="range-value">{distance} 公里</span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">海拔落差</label>
          <div class="range-input">
            <input type="range" bind:value={elevation} min="0" max="3000" step="50" />
            <span class="range-value">{elevation} 米</span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">自身体重</label>
          <div class="range-input">
            <input type="range" bind:value={weight} min="40" max="120" step="1" />
            <span class="range-value">{weight} 公斤</span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">负重重量</label>
          <div class="range-input">
            <input type="range" bind:value={packWeight} min="0" max="40" step="1" />
            <span class="range-value">{packWeight} 公斤</span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">行进速度</label>
          <div class="range-input">
            <input type="range" bind:value={speed} min="2" max="8" step="0.5" />
            <span class="range-value">{speed} km/h</span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">环境温度</label>
          <div class="range-input">
            <input type="range" bind:value={temperature} min="-20" max="45" step="1" />
            <span class="range-value">{temperature} °C</span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">运动强度</label>
          <div class="intensity-selector">
            {#each intensityLevels as level}
              <button
                class="intensity-btn"
                class:active={intensity === level.id}
                on:click={() => intensity = level.id}
              >
                <span class="intensity-name">{level.name}</span>
                <span class="intensity-desc">{level.description}</span>
              </button>
            {/each}
          </div>
        </div>
      </div>

      <h2 class="panel-title" style="margin-top: 2rem;">体能参数</h2>
      <div class="form-single-column">
        <div class="form-group">
          <label class="form-label">静息心率</label>
          <div class="range-input">
            <input type="range" bind:value={restingHeartRate} min="40" max="100" step="1" />
            <span class="range-value">{restingHeartRate} bpm</span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">最大摄氧量</label>
          <div class="range-input">
            <input type="range" bind:value={vo2max} min="20" max="80" step="1" />
            <span class="range-value">{vo2max}</span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">每周运动时长</label>
          <div class="range-input">
            <input type="range" bind:value={weeklyExerciseHours} min="0" max="20" step="1" />
            <span class="range-value">{weeklyExerciseHours} 小时</span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">每周运动次数</label>
          <div class="range-input">
            <input type="range" bind:value={activityFrequency} min="0" max="7" step="1" />
            <span class="range-value">{activityFrequency} 次</span>
          </div>
        </div>
      </div>
    </section>

    <section class="result-panel">
      <div class="save-bar">
        <button class="save-btn" on:click={openSaveModal}>
          💾 保存此方案到存档
        </button>
      </div>

      <div class="result-section">
        <h3 class="section-title">🔥 体能消耗</h3>
        <div class="result-grid">
          <div class="result-card main-result">
            <div class="result-icon">🔥</div>
            <div class="result-content">
              <div class="result-label">预计总热量消耗</div>
              <div class="result-value">{result.totalCalories} <span class="unit">千卡</span></div>
              <div class="result-sub">约等于 {(result.totalCalories / 300).toFixed(1)} 碗米饭</div>
            </div>
          </div>

          <div class="result-card">
            <div class="result-icon">⏱️</div>
            <div class="result-content">
              <div class="result-label">徒步时长</div>
              <div class="result-value">{result.durationHours} <span class="unit">小时</span></div>
              <div class="result-sub">{result.durationMinutes} 分钟</div>
            </div>
          </div>

          <div class="result-card">
            <div class="result-icon">📊</div>
            <div class="result-content">
              <div class="result-label">每小时消耗</div>
              <div class="result-value">{result.caloriesPerHour} <span class="unit">千卡</span></div>
            </div>
          </div>

          <div class="result-card">
            <div class="result-icon">⛰️</div>
            <div class="result-content">
              <div class="result-label">海拔消耗</div>
              <div class="result-value">{result.elevationCalories} <span class="unit">千卡</span></div>
              <div class="result-sub">平地消耗: {result.flatCalories}</div>
            </div>
          </div>
        </div>

        <div class="fitness-assessment">
          <h4>💪 体能评估</h4>
          <div class="fitness-score-row">
            <div class="fitness-score-circle" style="border-color: {fitnessLevel.color}">
              <div class="fitness-score-value" style="color: {fitnessLevel.color}">{fitnessIndex}</div>
            </div>
            <div class="fitness-info">
              <div class="fitness-level" style="color: {fitnessLevel.color}">{fitnessLevel.label}</div>
              <div class="fitness-recommendation">{fitnessLevel.recommendation}</div>
            </div>
          </div>

          <div class="fitness-breakdown">
            <div class="fitness-bar-item">
              <span class="fitness-bar-label">静息心率</span>
              <div class="fitness-bar">
                <div class="bar-fill" style="width: {Math.min(100, (100 - restingHeartRate) * 2)}%; background: #22c55e"></div>
              </div>
              <span class="fitness-bar-value">{restingHeartRate} bpm</span>
            </div>
            <div class="fitness-bar-item">
              <span class="fitness-bar-label">最大摄氧量</span>
              <div class="fitness-bar">
                <div class="bar-fill" style="width: {Math.min(100, vo2max * 1.5)}%; background: #3b82f6"></div>
              </div>
              <span class="fitness-bar-value">{vo2max}</span>
            </div>
            <div class="fitness-bar-item">
              <span class="fitness-bar-label">每周运动</span>
              <div class="fitness-bar">
                <div class="bar-fill" style="width: {Math.min(100, weeklyExerciseHours * 7)}%; background: #f97316"></div>
              </div>
              <span class="fitness-bar-value">{weeklyExerciseHours}h / {activityFrequency}次</span>
            </div>
          </div>
        </div>

        <div class="safety-box">
          <div class="safety-icon">🛡️</div>
          <div class="safety-content">
            <strong>建议最大安全时长: {maxSafeDuration} 小时</strong>
            {#if parseFloat(result.durationHours) > parseFloat(maxSafeDuration)}
              <p class="warning-text">⚠️ 当前计划时长超过建议安全时长，建议降低强度或增加同伴</p>
            {/if}
            {#if isStrenuous}
              <p>⚠️ 本次行程强度较大，建议充分热身，注意休息节奏</p>
            {/if}
            {#if isHighElevation}
              <p>🗻 高海拔行程，注意高原反应和温度变化</p>
            {/if}
            {#if isLongDistance}
              <p>🥾 长距离徒步，建议携带头灯，合理安排返程</p>
            {/if}
          </div>
        </div>

        <div class="factors">
          <h4>影响因素</h4>
          <div class="factor-list">
            <div class="factor-item">
              <span class="factor-label">速度系数</span>
              <span class="factor-value">{result.speedFactor}x</span>
            </div>
            <div class="factor-item">
              <span class="factor-label">温度系数</span>
              <span class="factor-value">{result.tempFactor}x</span>
            </div>
            <div class="factor-item">
              <span class="factor-label">总负重</span>
              <span class="factor-value">{weight + packWeight} kg</span>
            </div>
          </div>
        </div>
      </div>

      <div class="result-section">
        <h3 class="section-title">💧 饮水计划</h3>
        <div class="water-result">
          <div class="water-main-card">
            <div class="water-icon">💧</div>
            <div class="water-content">
              <div class="water-label">建议总饮水量</div>
              <div class="water-value">{waterIntake.totalLiters} <span class="unit">升</span></div>
              <div class="water-sub">每小时约 {waterIntake.waterPerHour} 升</div>
            </div>
          </div>

          <div class="water-stats">
            <div class="stat-card">
              <div class="stat-icon">⏰</div>
              <div class="stat-content">
                <div class="stat-label">每小时饮水</div>
                <div class="stat-value">{waterIntake.waterPerHour} L</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🧂</div>
              <div class="stat-content">
                <div class="stat-label">电解质补充</div>
                <div class="stat-value">{electrolytes.totalMg} mg</div>
              </div>
            </div>
          </div>

          <div class="electrolyte-box">
            <h4>电解质建议</h4>
            <p>每小时约 {electrolytes.mgPerHour} mg</p>
            <p class="electrolyte-advice">{electrolytes.supplementAdvice}</p>
          </div>

          <div class="hourly-water">
            <h4>每小时饮水分布</h4>
            <div class="hourly-list">
              {#each waterIntake.hourlyBreakdown.slice(0, 8) as hour}
                <div class="hourly-item">
                  <span class="hour-label">第{hour.hour}小时</span>
                  <div class="hourly-bar">
                    <div class="bar-fill" style="width: {Math.min(100, hour.water / 10)}%; background: #3b82f6"></div>
                  </div>
                  <span class="hour-value">{hour.water} ml</span>
                </div>
              {/each}
              {#if waterIntake.hourlyBreakdown.length > 8}
                <p class="more-hours">... 还有 {waterIntake.hourlyBreakdown.length - 8} 小时</p>
              {/if}
            </div>
          </div>

          <div class="water-factors" style="margin-top: 1rem;">
            <h4>影响因素</h4>
            <div class="factor-list">
              <div class="factor-item">
                <span class="factor-label">活动时长</span>
                <span class="factor-value">{result.durationHours} 小时</span>
              </div>
              <div class="factor-item">
                <span class="factor-label">环境温度</span>
                <span class="factor-value">{temperature} °C</span>
              </div>
              <div class="factor-item">
                <span class="factor-label">海拔高度</span>
                <span class="factor-value">{elevation} 米</span>
              </div>
              <div class="factor-item">
                <span class="factor-label">总负重</span>
                <span class="factor-value">{weight + packWeight} kg</span>
              </div>
              <div class="factor-item">
                <span class="factor-label">温度系数</span>
                <span class="factor-value">{waterIntake.tempFactor}x</span>
              </div>
              <div class="factor-item">
                <span class="factor-label">海拔系数</span>
                <span class="factor-value">{waterIntake.elevationFactor}x</span>
              </div>
              <div class="factor-item">
                <span class="factor-label">强度系数</span>
                <span class="factor-value">{waterIntake.intensityFactor}x</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="result-section">
        <h3 class="section-title">🍽️ 食物配比</h3>
        <div class="food-result">
          <div class="food-main-card">
            <div class="food-icon">🍽️</div>
            <div class="food-content">
              <div class="food-label">建议总热量摄入</div>
              <div class="food-value">{foodIntake.totalCalories} <span class="unit">千卡</span></div>
              <div class="food-sub">约 {foodIntake.totalGrams} 克食物</div>
            </div>
          </div>

          <div class="food-summary" style="margin-bottom: 1rem;">
            <h4>基础数据</h4>
            <div class="factor-list">
              <div class="factor-item">
                <span class="factor-label">活动时长</span>
                <span class="factor-value">{result.durationHours} 小时</span>
              </div>
              <div class="factor-item">
                <span class="factor-label">每小时消耗</span>
                <span class="factor-value">{result.caloriesPerHour} 千卡</span>
              </div>
              <div class="factor-item">
                <span class="factor-label">强度系数</span>
                <span class="factor-value">{foodIntake.intensityMultiplier}x</span>
              </div>
              <div class="factor-item">
                <span class="factor-label">调整后小时消耗</span>
                <span class="factor-value">{foodIntake.adjustedCaloriesPerHour} 千卡</span>
              </div>
            </div>
          </div>

          <div class="macro-breakdown">
            <h4>营养配比</h4>
            <div class="macro-list">
              {#each foodIntake.breakdown as macro}
                <div class="macro-item">
                  <div class="macro-header">
                    <span class="macro-icon">{macro.icon}</span>
                    <span class="macro-name">{macro.name}</span>
                    <span class="macro-percent">{macro.percentage}%</span>
                  </div>
                  <div class="macro-bar">
                    <div class="bar-fill" style="width: {macro.percentage}%; background: {macro.id === 'carbohydrate' ? '#eab308' : macro.id === 'protein' ? '#ef4444' : '#8b5cf6'}"></div>
                  </div>
                  <div class="macro-details">
                    <span>{macro.calories} 千卡</span>
                    <span>{macro.grams} 克</span>
                  </div>
                  <div class="macro-examples">
                    <small>推荐: {macro.examples}</small>
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <div class="meal-plan">
            <h4>📋 建议餐单</h4>
            <div class="meal-list">
              {#each foodIntake.mealPlan as meal}
                <div class="meal-item">
                  <div class="meal-header">
                    <span class="meal-type">{meal.type === 'breakfast' ? '🌅' : meal.type === 'lunch' ? '☀️' : meal.type === 'dinner' ? '🌙' : '🍎'}</span>
                    <span class="meal-name">{meal.name}</span>
                    <span class="meal-calories">{meal.calories} 千卡</span>
                  </div>
                  <div class="meal-items">
                    {#each meal.items as item}
                      <span class="meal-tag">{item}</span>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>

      <div class="safety-tips">
        <h3>💡 补给建议</h3>
        <ul class="tips-list">
          {#each hydrationTips as tip}
            <li>{tip}</li>
          {/each}
          {#each nutritionTips as tip}
            <li>{tip}</li>
          {/each}
          <li>建议每小时补充 200-300 千卡能量，避免血糖大幅波动</li>
          <li>活动前 1-2 小时进食，活动中每 45-60 分钟补充一次</li>
          <li>活动后 30 分钟内补充蛋白质和碳水，帮助恢复</li>
        </ul>
      </div>
    </section>
  </div>

  {#if showSaveModal}
    <div class="modal-overlay" on:click={() => showSaveModal = false}>
      <div class="modal-content" on:click|stopPropagation>
        <h3>保存方案到存档</h3>
        <div class="modal-form">
          <div class="form-group">
            <label class="form-label">方案名称 *</label>
            <input type="text" class="form-input" bind:value={saveName} placeholder="输入方案名称" />
          </div>
          <div class="form-group">
            <label class="form-label">备注（可选）</label>
            <textarea class="form-input" bind:value={saveNotes} placeholder="添加备注信息..." rows="3"></textarea>
          </div>
        </div>
        <div class="modal-actions">
          <button class="modal-btn" on:click={() => showSaveModal = false}>取消</button>
          <button class="modal-btn primary" on:click={handleSave}>确认保存</button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .save-bar {
    margin-bottom: 1rem;
  }

  .save-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, #f97316, #ea580c);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(249, 115, 22, 0.3);
  }

  .save-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(249, 115, 22, 0.4);
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal-content {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    max-width: 500px;
    width: 100%;
  }

  .modal-content h3 {
    margin: 0 0 1rem 0;
    color: #1e293b;
  }

  .modal-form {
    margin-bottom: 1rem;
  }

  .form-input {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    box-sizing: border-box;
  }

  .form-input:focus {
    outline: none;
    border-color: #f97316;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
  }

  textarea.form-input {
    resize: vertical;
    min-height: 80px;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }

  .modal-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .modal-btn.primary {
    background: #f97316;
    color: white;
    border-color: #f97316;
  }

  .modal-btn.primary:hover {
    background: #ea580c;
  }

  .form-single-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .result-section {
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .result-section:last-of-type {
    border-bottom: none;
    margin-bottom: 1.5rem;
    padding-bottom: 0;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 1.25rem 0;
  }

  .result-section > * + * {
    margin-top: 1rem;
  }

  .panel-desc {
    color: #64748b;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    margin-top: -0.5rem;
  }

  .intensity-selector {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .intensity-btn {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .intensity-btn:hover {
    border-color: #f97316;
  }

  .intensity-btn.active {
    border-color: #f97316;
    background: #fff7ed;
  }

  .intensity-name {
    font-weight: 600;
    color: #1e293b;
  }

  .intensity-desc {
    font-size: 0.75rem;
    color: #64748b;
  }

  .water-factors, .food-summary {
    background: #f8fafc;
    border-radius: 0.75rem;
    padding: 1rem;
  }

  .water-factors h4, .food-summary h4 {
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
    color: #475569;
  }

  .water-main-card, .food-main-card {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .food-main-card {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
  }

  .water-icon, .food-icon {
    font-size: 3rem;
  }

  .water-label, .food-label {
    font-size: 0.875rem;
    color: #475569;
    margin-bottom: 0.25rem;
  }

  .water-value, .food-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e40af;
    line-height: 1;
  }

  .food-value {
    color: #92400e;
  }

  .water-value .unit, .food-value .unit {
    font-size: 1rem;
    color: #64748b;
  }

  .water-sub, .food-sub {
    font-size: 0.875rem;
    color: #64748b;
    margin-top: 0.25rem;
  }

  .water-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: #f8fafc;
    border-radius: 0.75rem;
    padding: 1rem;
  }

  .stat-icon {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.75rem;
    color: #64748b;
  }

  .stat-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
  }

  .electrolyte-box {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .electrolyte-box h4 {
    margin: 0 0 0.5rem 0;
    color: #166534;
  }

  .electrolyte-box p {
    margin: 0.25rem 0;
    color: #14532d;
  }

  .electrolyte-advice {
    font-size: 0.85rem;
    color: #166534;
    font-weight: 500;
  }

  .hourly-water {
    margin-bottom: 1.5rem;
  }

  .hourly-water h4 {
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
    color: #475569;
  }

  .hourly-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .hourly-item {
    display: grid;
    grid-template-columns: 70px 1fr 80px;
    align-items: center;
    gap: 0.75rem;
  }

  .hour-label {
    font-size: 0.85rem;
    color: #64748b;
  }

  .hourly-bar {
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
  }

  .hour-value {
    font-size: 0.85rem;
    font-weight: 500;
    text-align: right;
  }

  .more-hours {
    text-align: center;
    color: #94a3b8;
    font-size: 0.85rem;
    margin: 0.5rem 0 0 0;
  }

  .macro-breakdown {
    margin-bottom: 1.5rem;
  }

  .macro-breakdown h4 {
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
    color: #475569;
  }

  .macro-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .macro-item {
    background: #f8fafc;
    border-radius: 0.75rem;
    padding: 1rem;
  }

  .macro-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .macro-icon {
    font-size: 1.25rem;
  }

  .macro-name {
    font-weight: 600;
    color: #1e293b;
    flex: 1;
  }

  .macro-percent {
    font-weight: 700;
    color: #475569;
  }

  .macro-bar {
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .macro-details {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    color: #64748b;
  }

  .macro-examples {
    margin-top: 0.5rem;
    color: #94a3b8;
  }

  .meal-plan h4 {
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
    color: #475569;
  }

  .meal-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .meal-item {
    background: #f8fafc;
    border-radius: 0.75rem;
    padding: 1rem;
  }

  .meal-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .meal-type {
    font-size: 1.25rem;
  }

  .meal-name {
    font-weight: 600;
    color: #1e293b;
    flex: 1;
  }

  .meal-calories {
    font-size: 0.85rem;
    font-weight: 600;
    color: #f97316;
  }

  .meal-items {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .meal-tag {
    background: #e2e8f0;
    color: #475569;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
  }
</style>
