<script>
  import {
    emergencyScenarios,
    emergencyProcedureSteps,
    emergencyKitItems,
    emergencyContacts,
    getEmergencyPlan,
    getRelevantScenarios,
    getSeverityColor,
    getCategoryIcon
  } from '../../lib/data/emergencyPlans.js';
  import {
    weatherConditions,
    terrainTypes
  } from '../../lib/data/riskData.js';
  export const prerender = true;

  let activeScenario = null;
  let activeCategory = 'all';
  let activeTab = 'scenarios';
  let showRelevantOnly = false;

  let params = {
    riskLevel: 'medium',
    altitude: 1000,
    temperature: 20,
    duration: 4,
    terrain: 'trail',
    weather: 'sunny'
  };

  $: relevantScenarios = getRelevantScenarios(params);
  $: displayedScenarios = showRelevantOnly ? relevantScenarios :
    (activeCategory === 'all' ? emergencyScenarios :
      emergencyScenarios.filter(s => s.category === activeCategory));

  const categories = [
    { id: 'all', name: '全部', icon: '📋' },
    { id: 'medical', name: '医疗急救', icon: '🏥' },
    { id: 'navigation', name: '导航通讯', icon: '🧭' },
    { id: 'weather', name: '天气灾害', icon: '🌤️' },
    { id: 'wildlife', name: '野生动物', icon: '🐾' },
    { id: 'equipment', name: '装备故障', icon: '🎒' },
    { id: 'fitness', name: '体能问题', icon: '💪' }
  ];

  const procedureLabels = {
    immediate: '立即行动',
    assessment: '情况评估',
    treatment: '处理方法',
    evacuation: '撤离安排',
    self_rescue: '自行脱困',
    stay_and_wait: '原地等待',
    thunderstorm: '雷暴应对',
    heavy_rain: '暴雨应对',
    after_storm: '风暴过后',
    warming: '复温措施',
    monitoring: '持续监测',
    mild_symptoms: '轻微症状',
    severe_symptoms: '严重症状',
    prevention: '预防措施',
    recovery: '恢复措施',
    decision: '决策选择',
    defense: '防御姿势',
    bear_specific: '熊类应对',
    post_encounter: '遭遇后',
    repair: '临时修复',
    critical_failure: '严重故障',
    during_flood: '洪水期间',
    crossing_danger: '渡河风险',
    alternatives: '替代方案',
    emergency_signal: '求救信号'
  };

  function selectScenario(scenarioId) {
    activeScenario = getEmergencyPlan(scenarioId);
  }

  function closeDetail() {
    activeScenario = null;
  }

  function getSeverityLabel(severity) {
    const labels = {
      critical: '极高',
      high: '高',
      medium: '中',
      low: '低'
    };
    return labels[severity] || severity;
  }
</script>

<div class="module-page">
  <header class="module-header">
    <div class="module-header-icon" style="background: #dc2626">🚨</div>
    <div>
      <h1>紧急预案推荐</h1>
      <p class="module-subtitle">常见紧急情况处理流程 · 急救装备清单 · 应急联系方式</p>
    </div>
  </header>

  <div class="tabs">
    <button class="tab-btn" class:active={activeTab === 'scenarios'} on:click={() => activeTab = 'scenarios'}>
      应急预案
    </button>
    <button class="tab-btn" class:active={activeTab === 'kit'} on:click={() => activeTab = 'kit'}>
      急救装备
    </button>
    <button class="tab-btn" class:active={activeTab === 'contacts'} on:click={() => activeTab === 'contacts'}>
      联系方式
    </button>
  </div>

  {#if activeTab === 'scenarios'}
    <div class="scenarios-container">
      <div class="filter-panel">
        <div class="filter-section">
          <h4>🔍 智能推荐</h4>
          <label class="checkbox-item">
            <input type="checkbox" bind:checked={showRelevantOnly} />
            <span>仅显示与当前条件相关的预案</span>
          </label>
          
          {#if showRelevantOnly}
            <div class="params-form">
              <div class="form-group">
                <label class="form-label">风险等级</label>
                <select class="form-select" bind:value={params.riskLevel}>
                  <option value="low">低风险</option>
                  <option value="medium">中等风险</option>
                  <option value="high">高风险</option>
                  <option value="extreme">极高风险</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">海拔高度</label>
                <div class="range-input">
                  <input type="range" bind:value={params.altitude} min="0" max="6000" step="100" />
                  <span class="range-value">{params.altitude} 米</span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">环境温度</label>
                <div class="range-input">
                  <input type="range" bind:value={params.temperature} min="-20" max="45" step="1" />
                  <span class="range-value">{params.temperature} °C</span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">活动时长</label>
                <div class="range-input">
                  <input type="range" bind:value={params.duration} min="1" max="48" step="1" />
                  <span class="range-value">{params.duration} 小时</span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">地形类型</label>
                <select class="form-select" bind:value={params.terrain}>
                  {#each terrainTypes as opt}
                    <option value={opt.id}>{opt.icon} {opt.name}</option>
                  {/each}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">天气状况</label>
                <select class="form-select" bind:value={params.weather}>
                  {#each weatherConditions as opt}
                    <option value={opt.id}>{opt.icon} {opt.name}</option>
                  {/each}
                </select>
              </div>
            </div>
            {#if relevantScenarios.length > 0}
              <div class="relevant-hint">
                <p>✨ 根据您的条件，推荐关注以下 {relevantScenarios.length} 种情况：</p>
              </div>
            {/if}
          {/if}
        </div>

        <div class="filter-section">
          <h4>📂 分类筛选</h4>
          <div class="category-grid">
            {#each categories as cat}
              <button
                class="category-btn"
                class:active={activeCategory === cat.id}
                on:click={() => { activeCategory = cat.id; showRelevantOnly = false; }}
              >
                <span class="cat-icon">{cat.icon}</span>
                <span class="cat-name">{cat.name}</span>
              </button>
            {/each}
          </div>
        </div>
      </div>

      <div class="scenarios-grid">
        {#each displayedScenarios as scenario}
          <div
            class="scenario-card"
            style="border-left-color: {getSeverityColor(scenario.severity)}"
            on:click={() => selectScenario(scenario.id)}
          >
            <div class="scenario-header">
              <span class="scenario-icon">{scenario.icon}</span>
              <h3 class="scenario-name">{scenario.name}</h3>
            </div>
            <p class="scenario-desc">{scenario.description}</p>
            <div class="scenario-footer">
              <span class="severity-badge" style="background: {getSeverityColor(scenario.severity)}">
                {getSeverityLabel(scenario.severity)}风险
              </span>
              <span class="category-tag">
                {getCategoryIcon(scenario.category)}
              </span>
            </div>
          </div>
        {/each}
      </div>
    </div>

    {#if activeScenario}
      <div class="detail-modal" on:click={closeDetail}>
        <div class="detail-content" on:click|stopPropagation>
          <button class="close-btn" on:click={closeDetail}>×</button>
          
          <div class="detail-header">
            <span class="detail-icon">{activeScenario.scenario.icon}</span>
            <h2>{activeScenario.scenario.name}</h2>
            <span class="detail-severity" style="background: {getSeverityColor(activeScenario.scenario.severity)}">
              {getSeverityLabel(activeScenario.scenario.severity)}风险
            </span>
          </div>

          <p class="detail-desc">{activeScenario.scenario.description}</p>

          {#if activeScenario.procedures}
            <div class="procedure-sections">
              {#each Object.entries(activeScenario.procedures) as [key, steps]}
                <div class="procedure-section">
                  <h3 class="procedure-title">
                    {procedureLabels[key] || key}
                  </h3>
                  <ol class="procedure-steps">
                    {#each steps as step}
                      <li>{step}</li>
                    {/each}
                  </ol>
                </div>
              {/each}
            </div>
          {/if}

          <div class="detail-footer">
            <p class="trigger-hint">
              <strong>常见诱因：</strong>
              {activeScenario.scenario.triggers.join('、')}
            </p>
          </div>
        </div>
      </div>
    {/if}
  {:else if activeTab === 'kit'}
    <div class="kit-container">
      <div class="kit-intro">
        <div class="intro-card">
          <div class="intro-icon">🎒</div>
          <div class="intro-content">
            <h3>急救装备清单</h3>
            <p>根据出行类型、时长和环境的不同，选择合适的急救装备。以下是标准的户外急救装备清单，供您参考。</p>
          </div>
        </div>
      </div>

      <div class="kit-categories">
        {#each emergencyKitItems as category}
          <div class="kit-category">
            <h3 class="kit-category-title">{category.category}</h3>
            <div class="kit-items">
              {#each category.items as item}
                <div class="kit-item" class:essential={item.essential}>
                  <span class="item-check">{item.essential ? '✅' : 'ℹ️'}</span>
                  <span class="item-name">{item.name}</span>
                  {#if item.essential}
                    <span class="essential-tag">必备</span>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <div class="kit-tips">
        <h4>💡 急救包使用建议</h4>
        <ul>
          <li>定期检查急救包内物品的保质期，及时更换过期物品</li>
          <li>了解急救包内每种物品的使用方法</li>
          <li>根据个人健康状况添加常用药品</li>
          <li>将急救包放在易于取用的位置</li>
          <li>建议参加急救培训，掌握基本急救技能</li>
          <li>高海拔或严寒地区需要额外增加保暖和抗高反物品</li>
        </ul>
      </div>
    </div>
  {:else if activeTab === 'contacts'}
    <div class="contacts-container">
      <div class="contacts-section">
        <h3>📞 国内紧急联系方式</h3>
        <div class="contacts-grid">
          {#each emergencyContacts.china as contact}
            <div class="contact-card">
              <div class="contact-icon">📞</div>
              <h4>{contact.name}</h4>
              <div class="contact-number">{contact.number}</div>
              <p class="contact-desc">{contact.description}</p>
            </div>
          {/each}
        </div>
      </div>

      <div class="contacts-section">
        <h3>🌍 国际紧急联系方式</h3>
        <div class="contacts-grid">
          {#each emergencyContacts.international as contact}
            <div class="contact-card">
              <div class="contact-icon">🌐</div>
              <h4>{contact.name}</h4>
              <div class="contact-number">{contact.number}</div>
              <p class="contact-desc">{contact.description}</p>
            </div>
          {/each}
        </div>
      </div>

      <div class="contacts-tips">
        <h4>📋 出行前准备</h4>
        <ul>
          <li>出发前将紧急联系人信息告知家人或朋友</li>
          <li>保存当地救援机构的联系方式</li>
          <li>告知他人详细的行程计划和返回时间</li>
          <li>如参加商业活动，确认组织者是否购买保险</li>
          <li>建议购买户外保险，保存保险公司报案电话</li>
          <li>在偏远地区建议携带卫星通讯设备</li>
        </ul>
      </div>

      <div class="sos-info">
        <h4>🆘 国际求救信号</h4>
        <div class="sos-methods">
          <div class="sos-method">
            <span class="sos-icon">📢</span>
            <div>
              <h5>声音信号</h5>
              <p>三声短、三声长、三声短（SOS摩尔斯电码），间隔1分钟重复</p>
            </div>
          </div>
          <div class="sos-method">
            <span class="sos-icon">🔥</span>
            <div>
              <h5>火焰信号</h5>
              <p>三堆火排成三角形或直线，间隔约25米</p>
            </div>
          </div>
          <div class="sos-method">
            <span class="sos-icon">☀️</span>
            <div>
              <h5>光线信号</h5>
              <p>使用镜子或其他反光物，每分钟闪烁6次，间隔1分钟重复</p>
            </div>
          </div>
          <div class="sos-method">
            <span class="sos-icon">🗺️</span>
            <div>
              <h5>地面信号</h5>
              <p>在开阔地面摆放SOS字样，每个字母至少3米长</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .scenarios-container {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 1.5rem;
  }

  .filter-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .filter-section {
    background: white;
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .filter-section h4 {
    margin: 0 0 0.75rem 0;
    color: #1e293b;
    font-size: 0.95rem;
  }

  .params-form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid #e2e8f0;
  }

  .relevant-hint {
    margin-top: 0.75rem;
    padding: 0.5rem 0.75rem;
    background: #fef3c7;
    border-radius: 0.5rem;
  }

  .relevant-hint p {
    margin: 0;
    color: #92400e;
    font-size: 0.85rem;
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .category-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.75rem 0.5rem;
    background: #f8fafc;
    border: 2px solid transparent;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .category-btn:hover {
    background: #f1f5f9;
  }

  .category-btn.active {
    background: #eff6ff;
    border-color: #3b82f6;
  }

  .cat-icon {
    font-size: 1.25rem;
  }

  .cat-name {
    font-size: 0.75rem;
    color: #475569;
  }

  .category-btn.active .cat-name {
    color: #1d4ed8;
    font-weight: 500;
  }

  .scenarios-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
    align-content: start;
  }

  .scenario-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border-left: 4px solid;
    cursor: pointer;
    transition: all 0.2s;
  }

  .scenario-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .scenario-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .scenario-icon {
    font-size: 1.25rem;
  }

  .scenario-name {
    margin: 0;
    font-size: 1rem;
    color: #1e293b;
  }

  .scenario-desc {
    margin: 0 0 0.75rem 0;
    font-size: 0.85rem;
    color: #64748b;
  }

  .scenario-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .severity-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
  }

  .category-tag {
    font-size: 1rem;
  }

  .detail-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .detail-content {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    max-width: 700px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: #f1f5f9;
    font-size: 1.25rem;
    cursor: pointer;
  }

  .close-btn:hover {
    background: #e2e8f0;
  }

  .detail-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .detail-icon {
    font-size: 2rem;
  }

  .detail-content h2 {
    margin: 0;
    color: #1e293b;
    flex: 1;
  }

  .detail-severity {
    padding: 0.375rem 0.75rem;
    border-radius: 0.5rem;
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
  }

  .detail-desc {
    color: #64748b;
    margin: 0 0 1.5rem 0;
  }

  .procedure-sections {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .procedure-section {
    background: #f8fafc;
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .procedure-title {
    margin: 0 0 0.5rem 0;
    color: #1e293b;
    font-size: 0.95rem;
  }

  .procedure-steps {
    margin: 0;
    padding-left: 1.25rem;
  }

  .procedure-steps li {
    margin-bottom: 0.375rem;
    color: #475569;
    font-size: 0.875rem;
  }

  .detail-footer {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
  }

  .trigger-hint {
    margin: 0;
    color: #64748b;
    font-size: 0.875rem;
  }

  .kit-container,
  .contacts-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .kit-intro .intro-card {
    display: flex;
    gap: 1rem;
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border-radius: 0.75rem;
    padding: 1rem;
    border: 1px solid #fcd34d;
  }

  .kit-intro .intro-icon {
    font-size: 2rem;
  }

  .kit-intro .intro-content h3 {
    margin: 0 0 0.25rem 0;
    color: #92400e;
    font-size: 1rem;
  }

  .kit-intro .intro-content p {
    margin: 0;
    color: #b45309;
    font-size: 0.875rem;
  }

  .kit-categories {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  .kit-category {
    background: white;
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .kit-category-title {
    margin: 0 0 0.75rem 0;
    color: #1e293b;
    font-size: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .kit-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .kit-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: #f8fafc;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }

  .kit-item.essential {
    background: #fef3c7;
  }

  .item-check {
    font-size: 1rem;
  }

  .item-name {
    flex: 1;
    color: #475569;
  }

  .essential-tag {
    font-size: 0.7rem;
    background: #f59e0b;
    color: white;
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
  }

  .kit-tips,
  .contacts-tips {
    background: #f0fdfa;
    border-radius: 0.75rem;
    padding: 1rem;
    border: 1px solid #99f6e4;
  }

  .kit-tips h4,
  .contacts-tips h4 {
    margin: 0 0 0.75rem 0;
    color: #0f766e;
  }

  .kit-tips ul,
  .contacts-tips ul {
    margin: 0;
    padding-left: 1.25rem;
  }

  .kit-tips li,
  .contacts-tips li {
    color: #0f766e;
    font-size: 0.875rem;
    margin-bottom: 0.375rem;
  }

  .contacts-section h3 {
    margin: 0 0 1rem 0;
    color: #1e293b;
  }

  .contacts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }

  .contact-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    text-align: center;
  }

  .contact-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .contact-card h4 {
    margin: 0 0 0.25rem 0;
    color: #1e293b;
    font-size: 0.95rem;
  }

  .contact-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: #dc2626;
    margin: 0.5rem 0;
  }

  .contact-desc {
    margin: 0;
    font-size: 0.8rem;
    color: #64748b;
  }

  .sos-info {
    background: #fef2f2;
    border-radius: 0.75rem;
    padding: 1rem;
    border: 1px solid #fecaca;
  }

  .sos-info h4 {
    margin: 0 0 1rem 0;
    color: #991b1b;
  }

  .sos-methods {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 0.75rem;
  }

  .sos-method {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem;
    background: white;
    border-radius: 0.5rem;
  }

  .sos-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .sos-method h5 {
    margin: 0 0 0.25rem 0;
    color: #991b1b;
    font-size: 0.9rem;
  }

  .sos-method p {
    margin: 0;
    font-size: 0.8rem;
    color: #7f1d1d;
  }

  @media (max-width: 768px) {
    .scenarios-container {
      grid-template-columns: 1fr;
    }
  }
</style>