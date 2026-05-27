<script>
  import {
    weatherConditions,
    terrainTypes,
    experienceLevels,
    groupSizes,
    physicalConditions,
    calculateRiskScore,
    getRiskLevel
  } from '../../lib/data/riskData.js';
  import {
    difficultyLevels,
    technicalFactors,
    calculateRouteDifficulty,
    calculateWeatherRiskOverlay,
    getDifficultyAdvice
  } from '../../lib/data/routeDifficulty.js';
  import { saveTrip } from '../../lib/utils/tripArchive.js';
  export const prerender = true;

  let showSaveModal = false;
  let saveName = '';
  let saveNotes = '';

  let weather = 'sunny';
  let terrain = 'trail';
  let experience = 'intermediate';
  let groupSize = 'small';
  let physical = 'good';
  let altitude = 500;
  let duration = 4;
  let temperature = 20;
  let hasEmergencyPlan = false;
  let hasFirstAid = false;
  let hasNavigation = true;
  let hasCommunication = true;

  let routeParams = {
    trail_condition: 1,
    slope: 1,
    elevation_gain: 1,
    max_altitude: 1,
    distance: 1,
    water_crossing: 1,
    exposure: 1,
    navigation: 1,
    rescue: 1
  };

  $: params = {
    weather, terrain, experience, groupSize, physical,
    altitude, duration, temperature,
    hasEmergencyPlan, hasFirstAid, hasNavigation, hasCommunication
  };

  $: riskScore = calculateRiskScore(params);
  $: riskLevel = getRiskLevel(riskScore);
  $: routeDifficulty = calculateRouteDifficulty(routeParams);
  $: weatherOverlay = calculateWeatherRiskOverlay(riskScore, weather, routeDifficulty);
  $: difficultyAdvice = getDifficultyAdvice(routeDifficulty.score);

  function openSaveModal() {
    saveName = `风险评估-${new Date().toLocaleDateString('zh-CN')}`;
    saveNotes = '';
    showSaveModal = true;
  }

  function handleSave() {
    if (!saveName.trim()) {
      alert('请输入方案名称');
      return;
    }
    
    saveTrip({
      type: 'risk',
      name: saveName.trim(),
      notes: saveNotes.trim(),
      data: {
        riskScore: weatherOverlay.overlayedScore,
        riskLevel: weatherOverlay.riskLevel.label,
        routeDifficulty: routeDifficulty.difficulty.name,
        routeDifficultyScore: routeDifficulty.score,
        weather,
        terrain,
        experience,
        groupSize,
        altitude,
        duration,
        temperature,
        hasEmergencyPlan,
        hasFirstAid,
        hasNavigation,
        hasCommunication,
        routeParams: { ...routeParams }
      }
    });
    
    alert('方案已保存到存档！');
    showSaveModal = false;
  }
</script>

<div class="module-page">
  <header class="module-header">
    <div class="module-header-icon">⚠️</div>
    <div>
      <h1>综合风险评估</h1>
      <p class="module-subtitle">多维度风险评估 · 路线难度评级 · 天气风险叠加</p>
    </div>
  </header>

  <div class="module-layout">
    <section class="input-panel">
      <div class="input-section">
        <h2 class="panel-title">🎯 基础出行参数</h2>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">天气状况</label>
            <select class="form-select" bind:value={weather}>
              {#each weatherConditions as opt}
                <option value={opt.id}>{opt.icon} {opt.name}</option>
              {/each}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">地形类型</label>
            <select class="form-select" bind:value={terrain}>
              {#each terrainTypes as opt}
                <option value={opt.id}>{opt.icon} {opt.name}</option>
              {/each}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">户外经验</label>
            <select class="form-select" bind:value={experience}>
              {#each experienceLevels as opt}
                <option value={opt.id}>{opt.icon} {opt.name}</option>
              {/each}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">团队规模</label>
            <select class="form-select" bind:value={groupSize}>
              {#each groupSizes as opt}
                <option value={opt.id}>{opt.icon} {opt.name}</option>
              {/each}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">身体状况</label>
            <select class="form-select" bind:value={physical}>
              {#each physicalConditions as opt}
                <option value={opt.id}>{opt.icon} {opt.name}</option>
              {/each}
            </select>
          </div>
        </div>

        <div class="form-grid form-grid-single" style="margin-top: 1rem;">
          <div class="form-group">
            <label class="form-label">海拔高度</label>
            <div class="range-input">
              <input type="range" bind:value={altitude} min="0" max="6000" step="100" />
              <span class="range-value">{altitude} 米</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">活动时长</label>
            <div class="range-input">
              <input type="range" bind:value={duration} min="1" max="48" step="1" />
              <span class="range-value">{duration} 小时</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">环境温度</label>
            <div class="range-input">
              <input type="range" bind:value={temperature} min="-20" max="45" step="1" />
              <span class="range-value">{temperature} °C</span>
            </div>
          </div>
        </div>

        <h2 class="panel-title" style="margin-top: 1.5rem;">📋 应急预案</h2>
        <div class="checkbox-grid">
          <label class="checkbox-item">
            <input type="checkbox" bind:checked={hasEmergencyPlan} />
            <span>有应急预案</span>
          </label>
          <label class="checkbox-item">
            <input type="checkbox" bind:checked={hasFirstAid} />
            <span>⛑️ 携带急救包</span>
          </label>
          <label class="checkbox-item">
            <input type="checkbox" bind:checked={hasNavigation} />
            <span>🧭 携带导航设备</span>
          </label>
          <label class="checkbox-item">
            <input type="checkbox" bind:checked={hasCommunication} />
            <span>📱 带通讯设备</span>
          </label>
        </div>
      </div>

      <div class="input-section" style="margin-top: 1.5rem;">
        <h2 class="panel-title">⛰️ 路线技术参数</h2>
        <p class="panel-desc">请根据实际路线情况选择，系统将自动计算难度等级</p>

        <div class="route-factors">
          {#each technicalFactors as factor}
            <div class="factor-group">
              <div class="factor-header">
                <span class="factor-name">{factor.name}</span>
                <span class="factor-weight">权重 {Math.round(factor.weight * 100)}%</span>
              </div>
              <div class="factor-options">
                {#each factor.options as opt}
                  <label class="factor-option">
                    <input
                      type="radio"
                      name={factor.id}
                      value={opt.value}
                      bind:group={routeParams[factor.id]}
                    />
                    <span class="option-label">{opt.label}</span>
                  </label>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section class="result-panel">
      <div class="save-bar">
        <button class="save-btn" on:click={openSaveModal}>
          💾 保存此方案到存档
        </button>
      </div>

      <div class="results-container">
        <div class="result-card main-result">
          <div class="result-card-header">
            <span class="result-card-icon">🎯</span>
            <h3>综合风险评估</h3>
          </div>
          <div class="overlay-gauge">
            <div class="overlay-score-circle" style="border-color: {weatherOverlay.riskLevel.color}">
              <div class="overlay-score-value" style="color: {weatherOverlay.riskLevel.color}">
                {weatherOverlay.overlayedScore}
              </div>
              <div class="overlay-score-label">综合风险指数</div>
            </div>
            <div class="overlay-level-badge" style="background: {weatherOverlay.riskLevel.color}">
              {weatherOverlay.riskLevel.label}
            </div>
          </div>

          <div class="overlay-formula">
            <h4>风险计算公式</h4>
            <div class="formula-box">
              <code>基础风险 {riskScore} × 天气系数 {weatherOverlay.weatherMultiplier} × 难度系数 {weatherOverlay.routeFactor} = <strong>{weatherOverlay.overlayedScore}</strong></code>
            </div>
          </div>
        </div>

        <div class="result-cards-row">
          <div class="result-card">
            <div class="result-card-header">
              <span class="result-card-icon">📊</span>
              <h3>基础风险</h3>
            </div>
            <div class="mini-gauge">
              <div class="mini-score" style="color: {riskLevel.color}">{riskScore}</div>
              <div class="mini-badge" style="background: {riskLevel.color}">{riskLevel.label}</div>
            </div>
          </div>

          <div class="result-card">
            <div class="result-card-header">
              <span class="result-card-icon">⛰️</span>
              <h3>路线难度</h3>
            </div>
            <div class="mini-gauge">
              <div class="mini-icon">{routeDifficulty.difficulty.icon}</div>
              <div class="mini-score" style="color: {routeDifficulty.difficulty.color}">{routeDifficulty.score}/5</div>
              <div class="mini-badge" style="background: {routeDifficulty.difficulty.color}">{routeDifficulty.difficulty.name}</div>
            </div>
          </div>

          <div class="result-card">
            <div class="result-card-header">
              <span class="result-card-icon">🌤️</span>
              <h3>天气叠加</h3>
            </div>
            <div class="mini-gauge">
              <div class="mini-score">{weatherOverlay.weatherMultiplier}x</div>
              <div class="mini-label">{weatherOverlay.weatherInfo.label}</div>
            </div>
          </div>
        </div>

        {#if weatherOverlay.overlayedScore >= 8}
          <div class="warning-box severe">
            <div class="warning-icon">🚨</div>
            <div class="warning-content">
              <strong>严重警告</strong>
              <p>综合风险极高，强烈建议重新评估出行计划，考虑改期或由专业团队带领</p>
            </div>
          </div>
        {:else if weatherOverlay.overlayedScore >= 5}
          <div class="warning-box moderate">
            <div class="warning-icon">⚠️</div>
            <div class="warning-content">
              <strong>风险提示</strong>
              <p>综合风险较高，请确保做好充分准备，建议有经验者陪同</p>
            </div>
          </div>
        {:else}
          <div class="warning-box safe">
            <div class="warning-icon">✅</div>
            <div class="warning-content">
              <strong>风险可控</strong>
              <p>综合风险在可接受范围内，按常规准备即可，保持警惕</p>
            </div>
          </div>
        {/if}

        <div class="result-card">
          <div class="result-card-header">
            <span class="result-card-icon">📈</span>
            <h3>风险构成分析</h3>
          </div>
          <div class="breakdown-list">
            <div class="breakdown-item">
              <span class="breakdown-label">天气</span>
              <div class="breakdown-bar">
                <div class="bar-fill" style="width: {weatherConditions.find(w=>w.id===weather).riskLevel * 20}%; background: #ef4444"></div>
              </div>
              <span class="breakdown-value">{weatherConditions.find(w=>w.id===weather).riskLevel}</span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">地形</span>
              <div class="breakdown-bar">
                <div class="bar-fill" style="width: {terrainTypes.find(t=>t.id===terrain).riskLevel * 20}%; background: #f97316"></div>
              </div>
              <span class="breakdown-value">{terrainTypes.find(t=>t.id===terrain).riskLevel}</span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">经验</span>
              <div class="breakdown-bar">
                <div class="bar-fill" style="width: {Math.max(0, experienceLevels.find(e=>e.id===experience).riskModifier + 2) * 25}%; background: #eab308"></div>
              </div>
              <span class="breakdown-value">{experienceLevels.find(e=>e.id===experience).riskModifier > 0 ? '+' : ''}{experienceLevels.find(e=>e.id===experience).riskModifier}</span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">团队</span>
              <div class="breakdown-bar">
                <div class="bar-fill" style="width: {Math.max(0, groupSizes.find(g=>g.id===groupSize).riskModifier + 2) * 25}%; background: #3b82f6"></div>
              </div>
              <span class="breakdown-value">{groupSizes.find(g=>g.id===groupSize).riskModifier > 0 ? '+' : ''}{groupSizes.find(g=>g.id===groupSize).riskModifier}</span>
            </div>
          </div>
        </div>

        <div class="result-card">
          <div class="result-card-header">
            <span class="result-card-icon">🗺️</span>
            <h3>路线难度构成</h3>
          </div>
          <div class="breakdown-list">
            {#each routeDifficulty.breakdown as item}
              <div class="breakdown-item">
                <span class="breakdown-label">{item.factorName}</span>
                <div class="breakdown-bar">
                  <div class="bar-fill" style="width: {item.value * 20}%; background: {routeDifficulty.difficulty.color}"></div>
                </div>
                <span class="breakdown-value">{item.value}</span>
              </div>
            {/each}
          </div>
        </div>

        <div class="result-card">
          <div class="result-card-header">
            <span class="result-card-icon">💡</span>
            <h3>路线建议</h3>
          </div>
          <div class="difficulty-advice-card">
            <h4>🎯 {difficultyAdvice.title}</h4>
            <div class="advice-grid">
              <div class="advice-point">
                <span class="advice-label">适合人群:</span>
                <span>{difficultyAdvice.suitable}</span>
              </div>
              <div class="advice-point">
                <span class="advice-label">装备准备:</span>
                <span>{difficultyAdvice.preparation}</span>
              </div>
              <div class="advice-point">
                <span class="advice-label">预计时长:</span>
                <span>{difficultyAdvice.time}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="safety-tips">
          <h3>🧭 安全建议</h3>
          <ul class="tips-list">
            {#if riskScore >= 5 || weatherOverlay.overlayedScore >= 5}
              <li>建议有经验者陪同出行，切勿独自前往</li>
              <li>出发前务必告知他人行程计划和返回时间</li>
              <li>严格遵守"下撤原则"，遇到危险及时撤退</li>
            {/if}
            {#if altitude > 2000 || routeParams.max_altitude >= 3}
              <li>高海拔地区注意高原反应，上升速度不宜过快</li>
              <li>建议提前适应海拔，至少在低海拔地区停留1-2天</li>
            {/if}
            {#if temperature < 0}
              <li>低温环境注意保暖，防止冻伤，定期检查手脚温度</li>
              <li>携带高热量食物和保温热水</li>
            {/if}
            {#if temperature > 30}
              <li>高温天气注意防暑降温，及时补充水分和电解质</li>
              <li>建议利用清晨和傍晚时段行进</li>
            {/if}
            {#if duration > 8}
              <li>长时间活动建议携带头灯，预留充足返程时间</li>
              <li>合理安排休息和补给，避免过度疲劳</li>
            {/if}
            {#if routeDifficulty.score >= 4}
              <li>高难度路线需专业装备和技能，建议进行专项训练</li>
              <li>提前了解救援联系方式和路线</li>
            {/if}
            {#if riskScore < 5 && weatherOverlay.overlayedScore < 5}
              <li>风险可控，按常规准备即可</li>
              <li>保持通讯畅通，随时关注天气变化</li>
            {/if}
          </ul>
        </div>
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
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
  }

  .save-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
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
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
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
    background: #10b981;
    color: white;
    border-color: #10b981;
  }

  .modal-btn.primary:hover {
    background: #059669;
  }
  .input-panel {
    max-height: 80vh;
    overflow-y: auto;
    padding-right: 0.5rem;
    overflow-x: hidden;
  }

  .form-grid-single {
    grid-template-columns: 1fr;
  }

  .form-grid-single .range-input {
    gap: 0.5rem;
  }

  .form-grid-single .range-value {
    min-width: 60px;
    font-size: 0.8rem;
  }

  .input-section {
    background: #f8fafc;
    border-radius: 0.75rem;
    padding: 1rem;
  }

  .panel-desc {
    color: #64748b;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    margin-top: -0.5rem;
  }

  .route-factors {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .factor-group {
    background: white;
    border-radius: 0.5rem;
    padding: 0.75rem;
  }

  .factor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .factor-name {
    font-weight: 600;
    color: #1e293b;
    font-size: 0.875rem;
  }

  .factor-weight {
    font-size: 0.7rem;
    color: #64748b;
    background: #e2e8f0;
    padding: 0.2rem 0.4rem;
    border-radius: 0.375rem;
  }

  .factor-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.375rem;
  }

  .factor-option {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    cursor: pointer;
    padding: 0.375rem;
    border-radius: 0.375rem;
    transition: background 0.2s;
  }

  .factor-option:hover {
    background: #f1f5f9;
  }

  .option-label {
    font-size: 0.75rem;
    color: #475569;
  }

  .results-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .result-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
  }

  .result-card.main-result {
    background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
    border-color: #7dd3fc;
  }

  .result-card-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .result-card-icon {
    font-size: 1.25rem;
  }

  .result-card-header h3 {
    margin: 0;
    font-size: 1rem;
    color: #1e293b;
  }

  .result-cards-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }

  .mini-gauge {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .mini-icon {
    font-size: 1.25rem;
  }

  .mini-score {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
  }

  .mini-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    color: white;
    font-weight: 500;
    font-size: 0.75rem;
  }

  .mini-label {
    font-size: 0.75rem;
    color: #64748b;
  }

  .overlay-gauge {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .overlay-score-circle {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 5px solid;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .overlay-score-value {
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 1;
  }

  .overlay-score-label {
    font-size: 0.7rem;
    color: #64748b;
  }

  .overlay-level-badge {
    padding: 0.4rem 1.25rem;
    border-radius: 2rem;
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
  }

  .overlay-formula h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.85rem;
    color: #475569;
  }

  .formula-box {
    background: #1e293b;
    color: #e2e8f0;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-family: monospace;
    font-size: 0.8rem;
    overflow-x: auto;
  }

  .formula-box strong {
    color: #fbbf24;
  }

  .difficulty-advice-card {
    background: #f8fafc;
    border-radius: 0.5rem;
    padding: 0.75rem;
  }

  .difficulty-advice-card h4 {
    margin: 0 0 0.5rem 0;
    color: #1e293b;
    font-size: 0.9rem;
  }

  .advice-grid {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .advice-point {
    display: flex;
    gap: 0.5rem;
    font-size: 0.8rem;
  }

  .advice-label {
    font-weight: 600;
    color: #475569;
    min-width: 70px;
    flex-shrink: 0;
  }

  .warning-box {
    border-radius: 0.75rem;
    padding: 1rem;
    display: flex;
    gap: 0.75rem;
  }

  .warning-box.severe {
    background: #fef2f2;
    border: 1px solid #fecaca;
  }

  .warning-box.moderate {
    background: #fefce8;
    border: 1px solid #fef08a;
  }

  .warning-box.safe {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
  }

  .warning-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .warning-content strong {
    display: block;
    margin-bottom: 0.25rem;
  }

  .warning-content p {
    margin: 0;
    font-size: 0.85rem;
    color: #475569;
  }

  .breakdown-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .breakdown-item {
    display: grid;
    grid-template-columns: 60px 1fr 40px;
    align-items: center;
    gap: 0.5rem;
  }

  .breakdown-label {
    font-size: 0.8rem;
    color: #475569;
  }

  .breakdown-bar {
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s;
  }

  .breakdown-value {
    font-weight: 600;
    text-align: right;
    font-size: 0.85rem;
  }

  .safety-tips {
    background: white;
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
  }

  .safety-tips h3 {
    margin: 0 0 0.75rem 0;
    font-size: 0.95rem;
    color: #1e293b;
  }

  .tips-list {
    margin: 0;
    padding-left: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .tips-list li {
    font-size: 0.85rem;
    color: #475569;
  }
</style>
