<script>
  import { calculateCalories } from './lib/calorieCalculator.js';
  import { getFoodRecommendations } from './lib/foodData.js';
  import { planRestStops } from './lib/restPlanner.js';
  import './app.css';

  let distance = 10;
  let elevation = 300;
  let weight = 65;
  let packWeight = 10;
  let speed = 4;
  let temperature = 20;

  let result = null;
  let foodPlan = null;
  let restPlan = null;
  let activeTab = 'result';

  $: formData = { distance, elevation, weight, packWeight, speed, temperature };

  $: {
    result = calculateCalories(formData);
    foodPlan = getFoodRecommendations(result.totalCalories, parseFloat(result.durationHours), temperature);
    restPlan = planRestStops({
      distance,
      elevation,
      durationHours: parseFloat(result.durationHours),
      temperature,
      packWeight
    });
  }

  const inputFields = [
    { key: 'distance', label: '徒步里程', unit: '公里', min: 1, max: 100, step: 1, value: distance },
    { key: 'elevation', label: '海拔落差', unit: '米', min: 0, max: 3000, step: 50, value: elevation },
    { key: 'weight', label: '自身体重', unit: '公斤', min: 40, max: 120, step: 1, value: weight },
    { key: 'packWeight', label: '负重重量', unit: '公斤', min: 0, max: 40, step: 1, value: packWeight },
    { key: 'speed', label: '行进速度', unit: '公里/小时', min: 2, max: 8, step: 0.5, value: speed },
    { key: 'temperature', label: '环境温度', unit: '°C', min: -20, max: 45, step: 1, value: temperature }
  ];
</script>

<div class="app">
  <header class="header">
    <h1>🏔️ 户外徒步体能消耗精准计算器</h1>
    <p class="subtitle">智能计算热量消耗 · 匹配补给方案 · 规划休息节点</p>
  </header>

  <main class="main">
    <section class="input-section">
      <h2>📝 徒步参数设置</h2>
      <div class="form-grid">
        <div class="form-group">
          <label>徒步里程</label>
          <div class="input-wrapper">
            <input type="range" bind:value={distance} min="1" max="100" step="1" />
            <div class="value-display">
              <span class="value">{distance}</span>
              <span class="unit">公里</span>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>海拔落差</label>
          <div class="input-wrapper">
            <input type="range" bind:value={elevation} min="0" max="3000" step="50" />
            <div class="value-display">
              <span class="value">{elevation}</span>
              <span class="unit">米</span>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>自身体重</label>
          <div class="input-wrapper">
            <input type="range" bind:value={weight} min="40" max="120" step="1" />
            <div class="value-display">
              <span class="value">{weight}</span>
              <span class="unit">公斤</span>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>负重重量</label>
          <div class="input-wrapper">
            <input type="range" bind:value={packWeight} min="0" max="40" step="1" />
            <div class="value-display">
              <span class="value">{packWeight}</span>
              <span class="unit">公斤</span>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>行进速度</label>
          <div class="input-wrapper">
            <input type="range" bind:value={speed} min="2" max="8" step="0.5" />
            <div class="value-display">
              <span class="value">{speed}</span>
              <span class="unit">公里/小时</span>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>环境温度</label>
          <div class="input-wrapper">
            <input type="range" bind:value={temperature} min="-20" max="45" step="1" />
            <div class="value-display">
              <span class="value">{temperature}</span>
              <span class="unit">°C</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {#if result}
      <section class="tabs">
        <button class:active={activeTab === 'result'} on:click={() => activeTab = 'result'}>
          📊 消耗分析
        </button>
        <button class:active={activeTab === 'food'} on:click={() => activeTab = 'food'}>
          🍎 补给方案
        </button>
        <button class:active={activeTab === 'rest'} on:click={() => activeTab = 'rest'}>
          ⏸️ 休息规划
        </button>
      </section>

      {#if activeTab === 'result'}
        <section class="result-section">
          <div class="result-card main-result">
            <div class="result-icon">🔥</div>
            <div class="result-content">
              <div class="result-label">预计总热量消耗</div>
              <div class="result-value">{result.totalCalories} <span class="unit">千卡</span></div>
              <div class="result-sub">约等于 {(result.totalCalories / 300).toFixed(1)} 碗米饭</div>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">徒步时长</div>
              <div class="stat-value">{result.durationHours} <span class="unit">小时</span></div>
            </div>
            <div class="stat-card">
              <div class="stat-label">每小时消耗</div>
              <div class="stat-value">{result.caloriesPerHour} <span class="unit">千卡</span></div>
            </div>
            <div class="stat-card">
              <div class="stat-label">平地消耗</div>
              <div class="stat-value">{result.flatCalories} <span class="unit">千卡</span></div>
            </div>
            <div class="stat-card">
              <div class="stat-label">海拔消耗</div>
              <div class="stat-value">{result.elevationCalories} <span class="unit">千卡</span></div>
            </div>
          </div>

          <div class="factors">
            <h3>📈 影响因素</h3>
            <div class="factor-list">
              <div class="factor-item">
                <span class="factor-label">速度系数</span>
                <span class="factor-value">{result.speedFactor}x</span>
              </div>
              <div class="factor-item">
                <span class="factor-label">温度系数</span>
                <span class="factor-value">{result.tempFactor}x</span>
              </div>
            </div>
          </div>
        </section>
      {/if}

      {#if activeTab === 'food' && foodPlan}
        <section class="food-section">
          <div class="food-summary">
            <div class="summary-item">
              <span class="summary-label">建议摄入热量</span>
              <span class="summary-value">{foodPlan.targetCalories} 千卡</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">计划提供热量</span>
              <span class="summary-value">{foodPlan.totalFoodCalories} 千卡</span>
            </div>
          </div>

          <div class="recommendation-banner">
            💡 {foodPlan.recommendation}
          </div>

          <h3>🍽️ 正餐安排</h3>
          <div class="meal-list">
            {#each foodPlan.meals as meal}
              <div class="meal-card">
                <div class="meal-header">
                  <span class="meal-name">{meal.name}</span>
                  <span class="meal-time">{meal.time}</span>
                </div>
                <div class="meal-items">
                  {#each meal.items as item}
                    <div class="food-item">
                      <span class="food-name">{item.name}</span>
                      <span class="food-amount">{item.amount}g</span>
                      <span class="food-cal">{Math.round(item.calories * item.amount / 100)} 千卡</span>
                    </div>
                  {/each}
                </div>
                <div class="meal-total">小计: {meal.totalCalories} 千卡</div>
              </div>
            {/each}
          </div>

          <h3>🥨 途中补给</h3>
          <div class="snack-list">
            {#each foodPlan.snacks as snack}
              <div class="snack-card">
                <div class="snack-header">
                  <span class="snack-name">{snack.name}</span>
                  <span class="snack-time">{snack.time}</span>
                </div>
                <div class="snack-items">
                  {#each snack.items as item}
                    <div class="food-item">
                      <span class="food-name">{item.name}</span>
                      <span class="food-amount">{item.amount}g</span>
                    </div>
                  {/each}
                </div>
                <div class="snack-total">约 {snack.totalCalories} 千卡</div>
              </div>
            {/each}
          </div>

          <h3>💧 补水建议</h3>
          <div class="hydration-list">
            {#each foodPlan.hydration as item}
              <div class="hydration-item">
                <span class="hydration-name">{item.name}</span>
                <span class="hydration-amount">{item.amount}</span>
                <span class="hydration-note">{item.note}</span>
              </div>
            {/each}
          </div>
        </section>
      {/if}

      {#if activeTab === 'rest' && restPlan}
        <section class="rest-section">
          <div class="rest-summary">
            <div class="summary-item">
              <span class="summary-label">预计总休息时间</span>
              <span class="summary-value">{restPlan.totalRestMinutes} 分钟</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">包含休息总时长</span>
              <span class="summary-value">{restPlan.totalTime} 小时</span>
            </div>
          </div>

          <div class="recommendation-banner">
            🧭 {restPlan.recommendation}
          </div>

          <h3>📍 休息节点安排</h3>
          <div class="rest-list">
            {#each restPlan.restStops as stop}
              <div class="rest-card">
                <div class="rest-header">
                  <span class="rest-index">休息点 {stop.index}</span>
                  <span class="rest-type">{stop.type}</span>
                </div>
                <div class="rest-info">
                  <div class="rest-info-item">
                    <span class="info-label">到达时间</span>
                    <span class="info-value">{stop.time}</span>
                  </div>
                  <div class="rest-info-item">
                    <span class="info-label">行进距离</span>
                    <span class="info-value">{stop.distance} 公里</span>
                  </div>
                  <div class="rest-info-item">
                    <span class="info-label">休息时长</span>
                    <span class="info-value">{stop.duration} 分钟</span>
                  </div>
                </div>
                <div class="rest-tips">
                  {#each stop.tips as tip}
                    <span class="tip-tag">{tip}</span>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        </section>
      {/if}
    {/if}
  </main>

  <footer class="footer">
    <p>⚠️ 计算结果仅供参考，实际消耗受个人体质、天气、路况等因素影响</p>
  </footer>
</div>
