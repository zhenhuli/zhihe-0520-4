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
    calculateWeatherRiskOverlay
  } from '../../lib/data/routeDifficulty.js';
  import {
    generateRiskReport,
    formatReportForDisplay,
    downloadReport
  } from '../../lib/utils/riskReportGenerator.js';
  export const prerender = true;

  let tripName = '';
  let tripLocation = '';
  let tripDate = new Date().toISOString().split('T')[0];
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
  let participants = 1;

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

  let generatedReport = null;
  let activeTab = 'form';

  $: params = {
    weather, terrain, experience, groupSize, physical,
    altitude, duration, temperature,
    hasEmergencyPlan, hasFirstAid, hasNavigation, hasCommunication
  };

  $: riskScore = calculateRiskScore(params);
  $: riskLevel = getRiskLevel(riskScore);
  $: routeDifficulty = calculateRouteDifficulty(routeParams);
  $: weatherOverlay = calculateWeatherRiskOverlay(riskScore, weather, routeDifficulty);

  function handleGenerateReport() {
    if (!tripName.trim()) {
      alert('请输入出行名称');
      return;
    }

    const report = generateRiskReport({
      basicInfo: {
        tripName,
        activityType: 'hiking',
        date: tripDate,
        location: tripLocation,
        duration,
        groupSize,
        participants,
        weather,
        altitude,
        temperature
      },
      riskScore,
      routeDifficulty,
      weatherOverlay,
      riskBreakdown: [
        { factor: '天气', value: weatherConditions.find(w => w.id === weather)?.riskLevel || 0, weight: 0.25 },
        { factor: '地形', value: terrainTypes.find(t => t.id === terrain)?.riskLevel || 0, weight: 0.25 },
        { factor: '经验', value: experienceLevels.find(e => e.id === experience)?.riskModifier || 0, weight: 0.2 },
        { factor: '团队', value: groupSizes.find(g => g.id === groupSize)?.riskModifier || 0, weight: 0.15 },
        { factor: '装备', value: (hasEmergencyPlan ? -1 : 0) + (hasFirstAid ? -1 : 0), weight: 0.15 }
      ],
      routeBreakdown: routeDifficulty.breakdown,
      safetyMeasures: {
        emergencyPlan: hasEmergencyPlan,
        firstAid: hasFirstAid,
        navigation: hasNavigation,
        communication: hasCommunication
      }
    });

    generatedReport = formatReportForDisplay(report);
    activeTab = 'report';
  }

  function handleDownload(format) {
    if (generatedReport) {
      downloadReport(generatedReport, format);
    }
  }

  function getPriorityColor(priority) {
    const colors = {
      critical: '#ef4444',
      high: '#f97316',
      medium: '#eab308',
      low: '#22c55e'
    };
    return colors[priority] || '#64748b';
  }

  function getPriorityLabel(priority) {
    const labels = {
      critical: '紧急',
      high: '高',
      medium: '中',
      low: '低'
    };
    return labels[priority] || priority;
  }
</script>

<div class="module-page">
  <header class="module-header">
    <div class="module-header-icon" style="background: #10b981">📋</div>
    <div>
      <h1>风险报告生成</h1>
      <p class="module-subtitle">生成专业风险评估报告 · 详细分析 · 支持导出分享</p>
    </div>
  </header>

  <div class="tabs">
    <button class="tab-btn" class:active={activeTab === 'form'} on:click={() => activeTab = 'form'}>
      填写信息
    </button>
    <button class="tab-btn" class:active={activeTab === 'report'} on:click={() => activeTab = 'report'} disabled={!generatedReport}>
      查看报告
    </button>
  </div>

  {#if activeTab === 'form'}
    <div class="module-layout">
      <section class="input-panel">
        <div class="input-section">
          <h2 class="panel-title">📝 基本信息</h2>
          <div class="form-single-column">
            <div class="form-group">
              <label class="form-label">出行名称 *</label>
              <input type="text" class="form-input" bind:value={tripName} placeholder="例如：香山周末徒步" />
            </div>
            <div class="form-group">
              <label class="form-label">活动地点</label>
              <input type="text" class="form-input" bind:value={tripLocation} placeholder="例如：北京香山" />
            </div>
            <div class="form-group">
              <label class="form-label">出行日期</label>
              <input type="date" class="form-input" bind:value={tripDate} />
            </div>
            <div class="form-group">
              <label class="form-label">参与人数</label>
              <div class="range-input">
                <input type="range" bind:value={participants} min="1" max="20" step="1" />
                <span class="range-value">{participants} 人</span>
              </div>
            </div>
          </div>
        </div>

        <div class="input-section" style="margin-top: 1.5rem;">
          <h2 class="panel-title">🎯 环境参数</h2>
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
        </div>

        <div class="input-section" style="margin-top: 1.5rem;">
          <h2 class="panel-title">✅ 安全措施</h2>
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
          <h2 class="panel-title">⛰️ 路线难度</h2>
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
        <div class="preview-card">
          <h3>📊 实时预览</h3>
          
          <div class="preview-result">
            <div class="preview-gauge">
              <div class="preview-score-circle" style="border-color: {weatherOverlay.riskLevel.color}">
                <div class="preview-score-value" style="color: {weatherOverlay.riskLevel.color}">
                  {weatherOverlay.overlayedScore}
                </div>
                <div class="preview-score-label">综合风险</div>
              </div>
              <div class="preview-badge" style="background: {weatherOverlay.riskLevel.color}">
                {weatherOverlay.riskLevel.label}
              </div>
            </div>
          </div>

          <div class="preview-stats">
            <div class="preview-stat">
              <div class="stat-label">路线难度</div>
              <div class="stat-value">{routeDifficulty.difficulty.icon} {routeDifficulty.difficulty.name}</div>
            </div>
            <div class="preview-stat">
              <div class="stat-label">天气系数</div>
              <div class="stat-value">{weatherOverlay.weatherMultiplier}x</div>
            </div>
          </div>

          <button class="generate-btn" on:click={handleGenerateReport}>
            📄 生成完整报告
          </button>
        </div>
      </section>
    </div>
  {:else if generatedReport}
    <div class="report-container">
      <div class="report-actions">
        <button class="report-action-btn" on:click={() => handleDownload('text')}>
          📥 导出 TXT
        </button>
        <button class="report-action-btn" on:click={() => handleDownload('json')}>
          📥 导出 JSON
        </button>
      </div>

      <div class="report-content">
        <div class="report-header">
          <h2>户外出行风险评估报告</h2>
          <div class="report-meta">
            <span>报告编号: {generatedReport.id}</span>
            <span>生成时间: {generatedReport.generatedAtFormatted}</span>
          </div>
        </div>

        <div class="report-section">
          <h3>一、总体评估</h3>
          <div class="overall-assessment">
            <div class="assessment-main">
              <div class="assessment-score" style="border-color: {generatedReport.overallAssessment.riskColor}">
                <div class="score-value" style="color: {generatedReport.overallAssessment.riskColor}">
                  {generatedReport.overallAssessment.riskScore}
                </div>
                <div class="score-label">综合风险指数</div>
              </div>
              <div class="assessment-badges">
                <span class="assessment-badge" style="background: {generatedReport.overallAssessment.riskColor}">
                  {generatedReport.overallAssessment.riskLabel}
                </span>
                <span class="assessment-badge route">
                  {generatedReport.overallAssessment.routeDifficultyLabel}
                </span>
              </div>
            </div>
            <p class="assessment-summary">{generatedReport.overallAssessment.summary}</p>
          </div>
        </div>

        <div class="report-section">
          <h3>二、基本信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">出行名称</span>
              <span class="info-value">{generatedReport.basicInfo.tripName}</span>
            </div>
            <div class="info-item">
              <span class="info-label">活动地点</span>
              <span class="info-value">{generatedReport.basicInfo.location}</span>
            </div>
            <div class="info-item">
              <span class="info-label">出行日期</span>
              <span class="info-value">{generatedReport.dateFormatted}</span>
            </div>
            <div class="info-item">
              <span class="info-label">预计时长</span>
              <span class="info-value">{generatedReport.basicInfo.duration} 小时</span>
            </div>
            <div class="info-item">
              <span class="info-label">参与人数</span>
              <span class="info-value">{generatedReport.basicInfo.participants} 人</span>
            </div>
          </div>
        </div>

        <div class="report-section">
          <h3>三、建议措施</h3>
          <div class="recommendations-list">
            {#each generatedReport.recommendations as rec}
              <div class="recommendation-item">
                <div class="rec-header">
                  <span class="rec-priority" style="background: {getPriorityColor(rec.priority)}">
                    {getPriorityLabel(rec.priority)}
                  </span>
                  <span class="rec-title">{rec.title}</span>
                </div>
                <p class="rec-content">{rec.content}</p>
              </div>
            {/each}
          </div>
        </div>

        <div class="report-section">
          <h3>四、应急装备清单</h3>
          <div class="equipment-checklist">
            {#each generatedReport.emergencyPreparedness.items as item}
              <div class="checklist-item" class:required={item.required}>
                <span class="check-icon">{item.required ? '✅' : 'ℹ️'}</span>
                <span>{item.item}</span>
              </div>
            {/each}
          </div>
          <p class="checklist-advice">{generatedReport.emergencyPreparedness.advice}</p>
        </div>

        <div class="report-section">
          <h3>五、结论</h3>
          <div class="conclusion-box">
            <div class="conclusion-header">
              <span class="conclusion-icon">{generatedReport.conclusion.goNoGo ? '✅' : '⚠️'}</span>
              <span class="conclusion-text">{generatedReport.conclusion.goNoGoText}</span>
            </div>
            <ul class="conclusion-conditions">
              {#each generatedReport.conclusion.conditions as cond}
              <li>{cond}</li>
              {/each}
            </ul>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .form-single-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-input {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }

  .form-input:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  .preview-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .preview-card h3 {
    margin: 0 0 1.5rem 0;
    color: #1e293b;
  }

  .preview-result {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .preview-gauge {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .preview-score-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 4px solid;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .preview-score-value {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
  }

  .preview-score-label {
    font-size: 0.7rem;
    color: #64748b;
  }

  .preview-badge {
    padding: 0.375rem 1rem;
    border-radius: 2rem;
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
  }

  .preview-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .preview-stat {
    text-align: center;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 0.5rem;
  }

  .preview-stat .stat-label {
    font-size: 0.75rem;
    color: #64748b;
    margin-bottom: 0.25rem;
  }

  .preview-stat .stat-value {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1e293b;
  }

  .generate-btn {
    width: 100%;
    padding: 0.875rem;
    background: #10b981;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .generate-btn:hover {
    background: #059669;
  }

  .report-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .report-action-btn {
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .report-action-btn:hover {
    background: #f8fafc;
  }

  .report-container {
    background: white;
    border-radius: 0.75rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .report-header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid #e2e8f0;
  }

  .report-header h2 {
    margin: 0 0 0.75rem 0;
    color: #1e293b;
  }

  .report-meta {
    display: flex;
    justify-content: center;
    gap: 2rem;
    font-size: 0.875rem;
    color: #64748b;
  }

  .report-section {
    margin-bottom: 2rem;
  }

  .report-section h3 {
    margin: 0 0 1rem 0;
    color: #1e293b;
    font-size: 1.1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .overall-assessment {
    text-align: center;
  }

  .assessment-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .assessment-score {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    border: 5px solid;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .score-value {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1;
  }

  .score-label {
    font-size: 0.8rem;
    color: #64748b;
  }

  .assessment-badges {
    display: flex;
    gap: 0.75rem;
  }

  .assessment-badge {
    padding: 0.375rem 1rem;
    border-radius: 2rem;
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
  }

  .assessment-badge.route {
    background: #3b82f6;
  }

  .assessment-summary {
    color: #475569;
    margin: 0;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 0.5rem;
  }

  .info-label {
    font-size: 0.75rem;
    color: #64748b;
  }

  .info-value {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1e293b;
  }

  .recommendations-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .recommendation-item {
    padding: 1rem;
    background: #f8fafc;
    border-radius: 0.5rem;
    border-left: 4px solid;
  }

  .rec-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .rec-priority {
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
  }

  .rec-title {
    font-weight: 600;
    color: #1e293b;
  }

  .rec-content {
    margin: 0;
    color: #475569;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .equipment-checklist {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .checklist-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: #f8fafc;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }

  .checklist-item.required {
    background: #fef3c7;
  }

  .check-icon {
    font-size: 1rem;
  }

  .checklist-advice {
    margin: 0;
    padding: 0.75rem;
    background: #ecfdf5;
    border-radius: 0.5rem;
    color: #065f46;
    font-size: 0.875rem;
  }

  .conclusion-box {
    padding: 1.5rem;
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    border-radius: 0.75rem;
    border: 1px solid #86efac;
  }

  .conclusion-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .conclusion-icon {
    font-size: 1.5rem;
  }

  .conclusion-text {
    font-size: 1.25rem;
    font-weight: 700;
    color: #166534;
  }

  .conclusion-conditions {
    margin: 0;
    padding-left: 1.25rem;
  }

  .conclusion-conditions li {
    color: #166534;
    margin-bottom: 0.375rem;
    font-size: 0.9rem;
  }
</style>
