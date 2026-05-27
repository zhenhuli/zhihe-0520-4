<script>
  import { activityTypes } from '../../lib/data/activityTypes.js';
  import { getAllTrips } from '../../lib/utils/tripArchive.js';
  import { buildTripPlan, exportPlanAsText, exportPlanAsJSON, downloadTripPlan } from '../../lib/utils/tripPlanExporter.js';
  export const prerender = true;

  let tripName = '';
  let activityType = 'hiking';
  let date = new Date().toISOString().split('T')[0];
  let location = '';
  let duration = 8;
  let notes = '';

  let selectedTrips = {
    risk: null,
    fitness: null,
    equipment: null,
    team: null,
    route: null,
    load_distribution: null
  };

  let availableTrips = [];
  let generatedPlan = null;
  let previewText = '';
  let activeTab = 'config';

  function refreshTrips() {
    availableTrips = getAllTrips();
  }

  function getTripsByType(type) {
    return availableTrips.filter(t => t.type === type);
  }

  function generatePlan() {
    const riskTrip = selectedTrips.risk ? availableTrips.find(t => t.id === selectedTrips.risk) : null;
    const fitnessTrip = selectedTrips.fitness ? availableTrips.find(t => t.id === selectedTrips.fitness) : null;
    const equipmentTrip = selectedTrips.equipment ? availableTrips.find(t => t.id === selectedTrips.equipment) : null;
    const teamTrip = selectedTrips.team ? availableTrips.find(t => t.id === selectedTrips.team) : null;
    const routeTrip = selectedTrips.route ? availableTrips.find(t => t.id === selectedTrips.route) : null;

    generatedPlan = buildTripPlan({
      tripName: tripName || '未命名出行',
      activityType,
      date,
      location: location || '未指定',
      duration,
      team: teamTrip?.data?.members || [],
      routeNodes: routeTrip?.data?.nodes || [],
      equipment: equipmentTrip?.data || {},
      riskAssessment: riskTrip?.data || {},
      fitnessPlan: fitnessTrip?.data || {},
      notes: notes || ''
    });

    previewText = exportPlanAsText(generatedPlan);
    activeTab = 'preview';
  }

  function resetForm() {
    tripName = '';
    activityType = 'hiking';
    date = new Date().toISOString().split('T')[0];
    location = '';
    duration = 8;
    notes = '';
    selectedTrips = {
      risk: null,
      fitness: null,
      equipment: null,
      team: null,
      route: null,
      load_distribution: null
    };
    generatedPlan = null;
    previewText = '';
    activeTab = 'config';
  }

  function handleExport(format) {
    if (!generatedPlan) {
      alert('请先生成出行计划');
      return;
    }
    downloadTripPlan(generatedPlan, format);
  }

  function copyToClipboard() {
    if (!previewText) return;
    navigator.clipboard.writeText(previewText).then(() => {
      alert('已复制到剪贴板！');
    });
  }

  refreshTrips();
</script>

<div class="module-page">
  <header class="module-header">
    <div class="module-header-icon" style="background: #10b981">📋</div>
    <div>
      <h1>出行计划书导出</h1>
      <p class="module-subtitle">汇总所有模块 · 生成完整计划书 · 支持导出</p>
    </div>
  </header>

  <div class="tabs">
    <button class="tab-btn" class:active={activeTab === 'config'} on:click={() => activeTab = 'config'}>
      ⚙️ 配置
    </button>
    <button class="tab-btn" class:active={activeTab === 'preview'} on:click={() => activeTab = 'preview'} disabled={!generatedPlan}>
      👁️ 预览
    </button>
  </div>

  <div class="module-layout">
    <section class="input-panel">
      <h2 class="panel-title">基本信息</h2>

      <div class="form-group">
        <label class="form-label">出行名称 *</label>
        <input type="text" class="form-input" bind:value={tripName} placeholder="如：五一泰山登山计划" />
      </div>

      <div class="form-group">
        <label class="form-label">活动类型</label>
        <div class="activity-selector">
          {#each activityTypes as at}
            <button
              class="activity-btn"
              class:active={activityType === at.id}
              on:click={() => activityType = at.id}
            >
              <span class="activity-btn-icon">{at.icon}</span>
              <span>{at.name}</span>
            </button>
          {/each}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">出行日期</label>
        <input type="date" class="form-input" bind:value={date} />
      </div>

      <div class="form-group">
        <label class="form-label">活动地点</label>
        <input type="text" class="form-input" bind:value={location} placeholder="如：泰山风景区" />
      </div>

      <div class="form-group">
        <label class="form-label">预计时长</label>
        <div class="range-input">
          <input type="range" bind:value={duration} min="1" max="168" step="1" />
          <span class="range-value">{duration} 小时</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">备注</label>
        <textarea class="form-input" bind:value={notes} placeholder="添加备注信息..." rows="2"></textarea>
      </div>
    </section>

    <section class="result-panel">
      {#if activeTab === 'config'}
        <div class="trip-selection">
          <h2 class="panel-title">选择存档方案 <button class="refresh-btn" on:click={refreshTrips}>🔄 刷新</button></h2>

          <div class="selection-section">
            <div class="selection-header">
              <span class="selection-icon">⚠️</span>
              <span class="selection-title">风险评估方案</span>
            </div>
            <select class="form-select" bind:value={selectedTrips.risk}>
              <option value="">-- 不选择 --</option>
              {#each getTripsByType('risk') as trip}
                <option value={trip.id}>{trip.name} ({new Date(trip.createdAt).toLocaleDateString('zh-CN')})</option>
              {/each}
            </select>
          </div>

          <div class="selection-section">
            <div class="selection-header">
              <span class="selection-icon">🔥</span>
              <span class="selection-title">体能测算方案</span>
            </div>
            <select class="form-select" bind:value={selectedTrips.fitness}>
              <option value="">-- 不选择 --</option>
              {#each getTripsByType('fitness') as trip}
                <option value={trip.id}>{trip.name} ({new Date(trip.createdAt).toLocaleDateString('zh-CN')})</option>
              {/each}
            </select>
          </div>

          <div class="selection-section">
            <div class="selection-header">
              <span class="selection-icon">🎒</span>
              <span class="selection-title">装备推荐方案</span>
            </div>
            <select class="form-select" bind:value={selectedTrips.equipment}>
              <option value="">-- 不选择 --</option>
              {#each getTripsByType('equipment') as trip}
                <option value={trip.id}>{trip.name} ({new Date(trip.createdAt).toLocaleDateString('zh-CN')})</option>
              {/each}
            </select>
          </div>

          <div class="selection-section">
            <div class="selection-header">
              <span class="selection-icon">👥</span>
              <span class="selection-title">团队出行方案</span>
            </div>
            <select class="form-select" bind:value={selectedTrips.team}>
              <option value="">-- 不选择 --</option>
              {#each getTripsByType('team') as trip}
                <option value={trip.id}>{trip.name} ({new Date(trip.createdAt).toLocaleDateString('zh-CN')})</option>
              {/each}
            </select>
          </div>

          <div class="selection-section">
            <div class="selection-header">
              <span class="selection-icon">🗺️</span>
              <span class="selection-title">路线规划方案</span>
            </div>
            <select class="form-select" bind:value={selectedTrips.route}>
              <option value="">-- 不选择 --</option>
              {#each getTripsByType('route') as trip}
                <option value={trip.id}>{trip.name} ({new Date(trip.createdAt).toLocaleDateString('zh-CN')})</option>
              {/each}
            </select>
          </div>

          <div class="selection-section">
            <div class="selection-header">
              <span class="selection-icon">⚖️</span>
              <span class="selection-title">负荷分配方案</span>
            </div>
            <select class="form-select" bind:value={selectedTrips.load_distribution}>
              <option value="">-- 不选择 --</option>
              {#each getTripsByType('load_distribution') as trip}
                <option value={trip.id}>{trip.name} ({new Date(trip.createdAt).toLocaleDateString('zh-CN')})</option>
              {/each}
            </select>
          </div>

          <div class="generate-section">
            <button class="generate-btn" on:click={generatePlan}>
              🚀 生成完整出行计划书
            </button>
            <button class="reset-btn" on:click={resetForm}>
              🔄 重置表单
            </button>
          </div>
        </div>

      {:else if activeTab === 'preview'}
        <div class="preview-section">
          <div class="preview-actions">
            <button class="action-btn" on:click={() => activeTab = 'config'}>← 返回配置</button>
            <button class="action-btn primary" on:click={() => handleExport('text')}>📄 导出 TXT</button>
            <button class="action-btn secondary" on:click={() => handleExport('json')}>📋 导出 JSON</button>
            <button class="action-btn" on:click={copyToClipboard}>📋 复制文本</button>
          </div>

          <div class="plan-preview">
            <h3>📋 {generatedPlan.basicInfo.tripName}</h3>
            <div class="plan-meta">
              <span>📅 {generatedPlan.basicInfo.date}</span>
              <span>📍 {generatedPlan.basicInfo.location}</span>
              <span>⏱️ {generatedPlan.basicInfo.duration}小时</span>
            </div>
            <pre class="plan-text">{previewText}</pre>
          </div>

          <div class="plan-summary">
            <h3>📊 计划书摘要</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <span class="s-label">团队成员</span>
                <span class="s-value">{generatedPlan.teamInfo?.totalMembers || 0}人</span>
              </div>
              <div class="summary-item">
                <span class="s-label">路线节点</span>
                <span class="s-value">{generatedPlan.routeInfo?.nodes?.length || 0}个</span>
              </div>
              <div class="summary-item">
                <span class="s-label">装备重量</span>
                <span class="s-value">{generatedPlan.equipmentInfo?.summary?.totalWeight || 0}kg</span>
              </div>
              <div class="summary-item">
                <span class="s-label">风险等级</span>
                <span class="s-value">{generatedPlan.riskInfo?.riskScore || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </section>
  </div>
</div>

<style>
  .refresh-btn {
    float: right;
    padding: 0.25rem 0.5rem;
    background: #f1f5f9;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.85rem;
  }

  .refresh-btn:hover {
    background: #e2e8f0;
  }

  .trip-selection {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .selection-section {
    margin-bottom: 1rem;
  }

  .selection-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
    font-size: 0.9rem;
    color: #475569;
  }

  .selection-icon {
    font-size: 1.1rem;
  }

  .generate-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e2e8f0;
  }

  .generate-btn {
    width: 100%;
    padding: 0.875rem 1rem;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .generate-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
  }

  .reset-btn {
    padding: 0.625rem 1rem;
    background: white;
    color: #64748b;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .reset-btn:hover {
    border-color: #10b981;
    color: #10b981;
  }

  .preview-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .preview-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .action-btn {
    padding: 0.5rem 1rem;
    background: white;
    color: #475569;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .action-btn:hover {
    border-color: #10b981;
    color: #10b981;
  }

  .action-btn.primary {
    background: #10b981;
    color: white;
    border-color: #10b981;
  }

  .action-btn.primary:hover {
    background: #059669;
  }

  .action-btn.secondary {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .action-btn.secondary:hover {
    background: #2563eb;
  }

  .plan-preview {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .plan-preview h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1.25rem;
    color: #1e293b;
  }

  .plan-meta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    padding: 0.75rem 0;
    margin-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
    font-size: 0.875rem;
    color: #64748b;
  }

  .plan-text {
    background: #1e293b;
    color: #e2e8f0;
    padding: 1.25rem;
    border-radius: 0.5rem;
    font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
    font-size: 0.78rem;
    line-height: 1.6;
    white-space: pre-wrap;
    word-wrap: break-word;
    max-height: 500px;
    overflow-y: auto;
  }

  .plan-summary {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .plan-summary h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 700;
    color: #1e293b;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
  }

  .summary-item {
    background: #f8fafc;
    border-radius: 0.5rem;
    padding: 0.75rem;
    text-align: center;
  }

  .s-label {
    display: block;
    font-size: 0.75rem;
    color: #64748b;
    margin-bottom: 0.25rem;
  }

  .s-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: #10b981;
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
    padding: 0.625rem 0.75rem;
    border: none;
    border-radius: 0.5rem;
    background: transparent;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    color: #64748b;
    transition: all 0.2s;
  }

  .tab-btn.active {
    background: white;
    color: #1e293b;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .tab-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    .summary-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .preview-actions {
      flex-direction: column;
    }

    .action-btn {
      width: 100%;
    }
  }
</style>
