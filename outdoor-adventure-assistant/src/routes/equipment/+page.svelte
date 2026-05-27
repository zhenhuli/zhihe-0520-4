<script>
  import { activityTypes } from '../../lib/data/activityTypes.js';
  import {
    getEquipmentRecommendations,
    categoryLabels,
    clothingSubcategoryLabels
  } from '../../lib/utils/equipmentRecommender.js';
  import {
    getWeightAdvice,
    getCategoryWeightBreakdown,
    getLighteningTips,
    calculatePackWeightDistribution
  } from '../../lib/utils/weightCalculator.js';
  import { saveTrip } from '../../lib/utils/tripArchive.js';
  export const prerender = true;

  let showSaveModal = false;
  let saveName = '';
  let saveNotes = '';

  let activity = 'hiking';
  let duration = 8;
  let season = 'all';
  let temperature = 20;
  let altitude = 500;
  let groupSize = 'small';
  let experience = 'intermediate';
  let bodyWeight = 65;

  let activeTab = 'list';

  const seasons = [
    { id: 'all', name: '通用' },
    { id: 'warm', name: '温暖季节' },
    { id: 'cold', name: '寒冷季节' },
    { id: 'extreme_cold', name: '极寒' }
  ];

  $: params = { activity, duration, season, temperature, altitude, groupSize, experience };
  $: recommendation = getEquipmentRecommendations(params);
  $: weightBreakdown = getCategoryWeightBreakdown(recommendation.categories);
  $: weightAdvice = getWeightAdvice(weightBreakdown.totalWeight, weightBreakdown.totalWeight, bodyWeight);
  $: lighteningTips = getLighteningTips(weightBreakdown, bodyWeight);
  $: weightDistribution = calculatePackWeightDistribution(parseFloat(recommendation.summary.totalWeight), bodyWeight);

  $: isOvernight = recommendation.isOvernight;
  $: isCold = recommendation.isCold;
  $: isHighAltitude = recommendation.isHighAltitude;

  $: weightRatioPercent = Math.min(100, parseFloat(weightAdvice.weightRatio) * 3.33);

  function openSaveModal() {
    saveName = `装备推荐-${new Date().toLocaleDateString('zh-CN')}`;
    saveNotes = '';
    showSaveModal = true;
  }

  function handleSave() {
    if (!saveName.trim()) {
      alert('请输入方案名称');
      return;
    }
    
    saveTrip({
      type: 'equipment',
      name: saveName.trim(),
      notes: saveNotes.trim(),
      data: {
        activity,
        duration,
        season,
        temperature,
        altitude,
        groupSize,
        experience,
        bodyWeight,
        totalWeight: recommendation.summary.totalWeight,
        totalCount: recommendation.summary.totalCount,
        essentialCount: recommendation.summary.essentialCount,
        categories: recommendation.categories
      }
    });
    
    alert('方案已保存到存档！');
    showSaveModal = false;
  }
</script>

<div class="module-page">
  <header class="module-header">
    <div class="module-header-icon" style="background: #3b82f6">🎒</div>
    <div>
      <h1>装备清单与负重管理</h1>
      <p class="module-subtitle">智能装备推荐 · 负重测算 · 轻量化建议</p>
    </div>
  </header>

  <div class="tabs">
    <button class="tab-btn" class:active={activeTab === 'list'} on:click={() => activeTab = 'list'}>
      装备清单
    </button>
    <button class="tab-btn" class:active={activeTab === 'weight'} on:click={() => activeTab = 'weight'}>
      负重分析
    </button>
  </div>

  <div class="module-layout">
    <section class="input-panel">
      <h2 class="panel-title">行程信息</h2>

      <div class="form-group">
        <label class="form-label">活动类型</label>
        <div class="activity-selector">
          {#each activityTypes as at}
            <button
              class="activity-btn"
              class:active={activity === at.id}
              on:click={() => activity = at.id}
            >
              <span class="activity-btn-icon">{at.icon}</span>
              <span>{at.name}</span>
            </button>
          {/each}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">活动时长</label>
        <div class="range-input">
          <input type="range" bind:value={duration} min="1" max="72" step="1" />
          <span class="range-value">{duration} 小时</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">季节</label>
        <select class="form-select" bind:value={season}>
          {#each seasons as s}
            <option value={s.id}>{s.name}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">环境温度</label>
        <div class="range-input">
          <input type="range" bind:value={temperature} min="-20" max="45" step="1" />
          <span class="range-value">{temperature} °C</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">海拔高度</label>
        <div class="range-input">
          <input type="range" bind:value={altitude} min="0" max="6000" step="100" />
          <span class="range-value">{altitude} 米</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">户外经验</label>
        <select class="form-select" bind:value={experience}>
          <option value="beginner">新手</option>
          <option value="intermediate">中级</option>
          <option value="advanced">高级</option>
          <option value="expert">专家</option>
        </select>
      </div>

      {#if activeTab === 'weight'}
        <div class="form-group">
          <label class="form-label">自身体重</label>
          <div class="range-input">
            <input type="range" bind:value={bodyWeight} min="40" max="120" step="1" />
            <span class="range-value">{bodyWeight} 公斤</span>
          </div>
        </div>
      {/if}
    </section>

    <section class="result-panel">
      <div class="save-bar">
        <button class="save-btn" on:click={openSaveModal}>
          💾 保存此方案到存档
        </button>
      </div>

      {#if activeTab === 'list'}
        <div class="summary-cards">
          <div class="summary-card">
            <div class="summary-icon">⚖️</div>
            <div class="summary-content">
              <div class="summary-label">预估总重量</div>
              <div class="summary-value">{recommendation.summary.totalWeight} <span class="unit">kg</span></div>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon">📋</div>
            <div class="summary-content">
              <div class="summary-label">装备总数</div>
              <div class="summary-value">{recommendation.summary.totalCount} <span class="unit">件</span></div>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon">⭐</div>
            <div class="summary-content">
              <div class="summary-label">必备/可选</div>
              <div class="summary-value">{recommendation.summary.essentialCount} / {recommendation.summary.optionalCount}</div>
            </div>
          </div>
        </div>

        {#if recommendation.weatherExtra.length > 0}
          <div class="weather-extra">
            <div class="weather-extra-icon">🌤️</div>
            <div class="weather-extra-content">
              {#each recommendation.weatherExtra as extra}
                <p>{extra.name}</p>
              {/each}
            </div>
          </div>
        {/if}

        <div class="equipment-lists">
          {#each Object.entries(recommendation.categories) as [category, items]}
            {#if items.length > 0}
              <div class="equipment-category">
                <h3 class="category-title">
                  <span class="category-name">{categoryLabels[category] || category}</span>
                  <span class="category-count">{items.length} 件</span>
                </h3>
                <div class="equipment-list">
                  {#each items as item}
                    <div class="equipment-item" class:essential={item.essential}>
                      <div class="equipment-check">
                        {#if item.essential}
                          <span class="essential-mark">★</span>
                        {/if}
                      </div>
                      <div class="equipment-info">
                        <div class="equipment-name">{item.name}</div>
                        {#if item.reason}
                          <div class="equipment-reason">{item.reason}</div>
                        {/if}
                      </div>
                      <div class="equipment-meta">
                        {#if item.quantity > 1}
                          <span class="qty-badge">×{item.quantity}</span>
                        {/if}
                        <span class="weight-badge">{(item.weight / 1000).toFixed(2)} kg</span>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          {/each}
        </div>
      {:else if activeTab === 'weight'}
        <div class="weight-analysis">
          <div class="weight-main-card">
          <div class="weight-icon">⚖️</div>
          <div class="weight-content">
            <div class="weight-label">预估总负重</div>
            <div class="weight-value">{weightAdvice.totalWeightKg} <span class="unit">kg</span></div>
            <div class="weight-sub">占体重 {weightAdvice.weightRatio}%</div>
          </div>
        </div>

        <div class="weight-ratings">
          <div class="rating-card" style="border-left-color: {weightAdvice.totalWeightRating.color}">
            <div class="rating-label">负重评级</div>
            <div class="rating-value" style="color: {weightAdvice.totalWeightRating.color}">{weightAdvice.totalWeightRating.label}</div>
            <div class="rating-advice">{weightAdvice.totalWeightRating.advice}</div>
          </div>
        </div>

        <div class="weight-comparison">
          <h3>负重参考</h3>
          <div class="comparison-grid">
            <div class="comparison-item">
              <div class="comparison-label">理想负重 (20%)</div>
              <div class="comparison-bar">
                <div class="bar-fill ideal" style="width: 100%"></div>
              </div>
              <div class="comparison-value">{weightDistribution.idealWeight} kg</div>
            </div>
            <div class="comparison-item">
              <div class="comparison-label">安全上限 (30%)</div>
              <div class="comparison-bar">
                <div class="bar-fill safe" style="width: 100%"></div>
              </div>
              <div class="comparison-value">{weightDistribution.maxSafeWeight} kg</div>
            </div>
            <div class="comparison-item highlight">
              <div class="comparison-label">当前负重</div>
              <div class="comparison-bar">
                <div class="bar-fill current" style="width: {weightRatioPercent}%"></div>
              </div>
              <div class="comparison-value">{weightDistribution.currentWeight} kg</div>
            </div>
          </div>
          {#if parseFloat(weightDistribution.overWeight) > 0}
            <p class="overweight-warning">⚠️ 超出安全负重 {weightDistribution.overWeight} kg</p>
          {/if}
        </div>

        <div class="weight-breakdown">
          <h3>重量分布</h3>
          <div class="weight-category-list">
            {#each weightBreakdown.categories as cat}
              <div class="weight-category-item">
                <div class="weight-category-header">
                  <span class="weight-category-icon">{cat.icon}</span>
                  <span class="weight-category-name">{cat.name}</span>
                  <span class="weight-category-weight">{(cat.weight / 1000).toFixed(2)} kg</span>
                  <span class="weight-category-percent">{cat.percentage}%</span>
                </div>
                <div class="weight-category-bar">
                  <div class="bar-fill" style="width: {cat.percentage}%; background: {cat.priority === 'essential' ? '#3b82f6' : cat.priority === 'important' ? '#f97316' : '#94a3b8'}"></div>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <div class="weight-summary">
          <div class="summary-row">
            <span class="summary-label">必备装备</span>
            <span class="summary-value">{(weightBreakdown.totalEssential / 1000).toFixed(2)} kg</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">重要装备</span>
            <span class="summary-value">{(weightBreakdown.totalImportant / 1000).toFixed(2)} kg</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">可选装备</span>
            <span class="summary-value">{(weightBreakdown.totalOptional / 1000).toFixed(2)} kg</span>
          </div>
        </div>

        {#if lighteningTips.length > 0}
          <div class="lightening-tips">
            <h3>💡 轻量化建议</h3>
            {#each lighteningTips as tip}
              <div class="tip-card" class:high={tip.priority === 'high'} class:medium={tip.priority === 'medium'}>
                <h4>{tip.title}</h4>
                <ul>
                  {#each tip.items as item}
                    <li>{item}</li>
                  {/each}
                </ul>
              </div>
            {/each}
          </div>
        {/if}
        </div>
      {/if}

      <div class="equipment-tips">
        <h3>💡 装备建议</h3>
        <ul class="tips-list">
          {#if isOvernight}
            <li>过夜行程需携带露营装备，注意帐篷和睡袋的温标选择</li>
          {/if}
          {#if isCold}
            <li>寒冷环境建议采用"三层穿衣法"：排汗层+保暖层+防风层</li>
          {/if}
          {#if isHighAltitude}
            <li>高海拔地区紫外线强烈，务必做好防晒和眼部防护</li>
            <li>建议携带保暖装备，海拔每升高1000米温度下降约6°C</li>
          {/if}
          {#if temperature > 30}
            <li>高温天气建议选择速干透气面料，注意防暑降温</li>
          {/if}
          <li>装备打包遵循"上重下轻、常用易取"的原则</li>
          <li>出发前务必检查所有装备是否完好可用</li>
          {#if activeTab === 'weight'}
            <li>轻量化不等于牺牲安全，核心装备不能省</li>
            <li>循序渐进减重，一次不要减太多</li>
          {/if}
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
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  }

  .save-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
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
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .modal-btn.primary:hover {
    background: #2563eb;
  }

  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    background: #f1f5f9;
    padding: 0.5rem;
    border-radius: 0.75rem;
  }

  .tab-btn {
    flex: 1;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 0.5rem;
    background: transparent;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    color: #64748b;
    transition: all 0.2s;
  }

  .tab-btn.active {
    background: white;
    color: #1e293b;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .weight-main-card {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .weight-icon {
    font-size: 3rem;
  }

  .weight-label {
    font-size: 0.875rem;
    color: #475569;
    margin-bottom: 0.25rem;
  }

  .weight-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e40af;
    line-height: 1;
  }

  .weight-value .unit {
    font-size: 1rem;
    color: #64748b;
  }

  .weight-sub {
    font-size: 0.875rem;
    color: #64748b;
    margin-top: 0.25rem;
  }

  .weight-ratings {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .rating-card {
    background: #f8fafc;
    border-radius: 0.75rem;
    padding: 1rem;
    border-left: 4px solid;
  }

  .rating-label {
    font-size: 0.75rem;
    color: #64748b;
    margin-bottom: 0.25rem;
  }

  .rating-value {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  .rating-advice {
    font-size: 0.85rem;
    color: #475569;
  }

  .weight-comparison {
    background: #f8fafc;
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .weight-comparison h3 {
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
    color: #475569;
  }

  .comparison-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .comparison-item {
    display: grid;
    grid-template-columns: 100px 1fr 80px;
    align-items: center;
    gap: 0.75rem;
  }

  .comparison-item.highlight {
    background: #fef3c7;
    padding: 0.5rem;
    border-radius: 0.5rem;
    margin: 0 -0.5rem;
  }

  .comparison-label {
    font-size: 0.85rem;
    color: #475569;
  }

  .comparison-bar {
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
  }

  .bar-fill.ideal {
    background: #22c55e;
  }

  .bar-fill.safe {
    background: #eab308;
  }

  .bar-fill.current {
    background: #3b82f6;
  }

  .comparison-value {
    font-weight: 600;
    text-align: right;
  }

  .overweight-warning {
    margin: 0.75rem 0 0 0;
    padding: 0.5rem;
    background: #fef2f2;
    color: #dc2626;
    border-radius: 0.5rem;
    font-size: 0.85rem;
    text-align: center;
  }

  .weight-breakdown {
    margin-bottom: 1.5rem;
  }

  .weight-breakdown h3 {
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
    color: #475569;
  }

  .weight-category-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .weight-category-item {
    background: #f8fafc;
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
  }

  .weight-category-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .weight-category-icon {
    font-size: 1.25rem;
  }

  .weight-category-name {
    font-weight: 600;
    color: #1e293b;
    flex: 1;
  }

  .weight-category-weight {
    font-weight: 600;
    color: #3b82f6;
    margin-right: 0.5rem;
  }

  .weight-category-percent {
    font-size: 0.75rem;
    color: #64748b;
    min-width: 50px;
    text-align: right;
  }

  .weight-category-bar {
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    overflow: hidden;
  }

  .weight-summary {
    background: #f8fafc;
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e2e8f0;
  }

  .summary-row:last-child {
    border-bottom: none;
  }

  .summary-label {
    color: #64748b;
  }

  .summary-value {
    font-weight: 600;
    color: #1e293b;
  }

  .lightening-tips {
    margin-bottom: 1.5rem;
  }

  .lightening-tips h3 {
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
    color: #475569;
  }

  .tip-card {
    background: #f8fafc;
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 0.75rem;
  }

  .tip-card.high {
    border-left: 4px solid #ef4444;
  }

  .tip-card.medium {
    border-left: 4px solid #f97316;
  }

  .tip-card h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #1e293b;
  }

  .tip-card ul {
    margin: 0;
    padding-left: 1.25rem;
  }

  .tip-card li {
    font-size: 0.85rem;
    color: #475569;
    margin-bottom: 0.25rem;
  }
</style>
