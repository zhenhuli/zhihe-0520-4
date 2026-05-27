<script>
  import { teamRoles, fitnessLevels, experienceLevels, createMember, calculateMemberCapacity } from '../../lib/data/teamData.js';
  import { distributeLoad, getDistributionSummary, redistributeLoadFairly, generateDistributionAdvice } from '../../lib/utils/loadDistributor.js';
  import { getEquipmentRecommendations, categoryLabels } from '../../lib/utils/equipmentRecommender.js';
  import { activityTypes } from '../../lib/data/activityTypes.js';
  import { saveTrip } from '../../lib/utils/tripArchive.js';
  export const prerender = true;

  let members = [
    createMember('张三', 'leader', 70, 'good', 'advanced'),
    createMember('李四', 'navigator', 65, 'good', 'intermediate'),
    createMember('王五', 'member', 75, 'fair', 'beginner')
  ];

  let activity = 'hiking';
  let duration = 8;
  let season = 'all';
  let temperature = 20;
  let altitude = 500;
  let experience = 'intermediate';

  let showAddMemberModal = false;
  let showSaveModal = false;
  let saveName = '';
  let saveNotes = '';

  $: params = { activity, duration, season, temperature, altitude, groupSize: 'medium', experience };
  $: recommendation = getEquipmentRecommendations(params);
  $: distribution = distributeLoad(members, recommendation.categories);
  $: fairDistribution = redistributeLoadFairly(members, recommendation.categories);
  $: summary = getDistributionSummary(distribution);
  $: advice = generateDistributionAdvice(distribution);

  function openAddMemberModal() {
    showAddMemberModal = true;
  }

  function addDefaultMember() {
    const member = createMember(`队员${members.length + 1}`, 'member', 65, 'good', 'intermediate');
    members = [...members, member];
    showAddMemberModal = false;
  }

  function removeMember(id) {
    if (members.length <= 1) {
      alert('至少需要一名队员');
      return;
    }
    members = members.filter(m => m.id !== id);
  }

  function openSaveModal() {
    saveName = `负荷分配-${new Date().toLocaleDateString('zh-CN')}`;
    saveNotes = '';
    showSaveModal = true;
  }

  function handleSave() {
    if (!saveName.trim()) {
      alert('请输入方案名称');
      return;
    }

    saveTrip({
      type: 'load_distribution',
      name: saveName.trim(),
      notes: saveNotes.trim(),
      data: {
        params,
        members: members.map(m => ({ name: m.name, role: m.role, bodyWeight: m.bodyWeight, fitness: m.fitness, experience: m.experience })),
        distribution: distribution.map(d => ({
          member: d.member.name,
          totalWeight: d.totalWeight,
          utilization: d.utilization,
          items: d.items.map(i => ({ name: i.name, category: i.category, totalWeight: i.totalWeight }))
        })),
        summary
      }
    });

    alert('负荷分配方案已保存到存档！');
    showSaveModal = false;
  }
</script>

<div class="module-page">
  <header class="module-header">
    <div class="module-header-icon" style="background: #06b6d4">⚖️</div>
    <div>
      <h1>多人负荷分配</h1>
      <p class="module-subtitle">智能分配装备 · 平衡负重 · 角色匹配</p>
    </div>
  </header>

  <div class="module-layout">
    <section class="input-panel">
      <h2 class="panel-title">行程与团队</h2>

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

      <div class="team-section">
        <div class="section-header">
          <h3>团队成员 ({members.length})</h3>
          <button class="mini-btn" on:click={addDefaultMember}>+ 添加</button>
        </div>
        <div class="mini-members-list">
          {#each members as member}
            <div class="mini-member">
              <span class="mini-name">{member.name}</span>
              <span class="mini-role">{teamRoles.find(r => r.id === member.role)?.icon}</span>
              <button class="remove-btn" on:click={() => removeMember(member.id)}>×</button>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section class="result-panel">
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-icon">👥</div>
          <div class="summary-content">
            <div class="summary-label">团队人数</div>
            <div class="summary-value">{summary.memberCount}</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">⚖️</div>
          <div class="summary-content">
            <div class="summary-label">总负重</div>
            <div class="summary-value">{(summary.totalWeight / 1000).toFixed(1)} <span class="unit">kg</span></div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">📊</div>
          <div class="summary-content">
            <div class="summary-label">人均负重</div>
            <div class="summary-value">{(summary.avgWeightPerPerson / 1000).toFixed(1)} <span class="unit">kg</span></div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">📦</div>
          <div class="summary-content">
            <div class="summary-label">物品总数</div>
            <div class="summary-value">{summary.totalItems}</div>
          </div>
        </div>
      </div>

      <div class="save-bar">
        <button class="save-btn" on:click={openSaveModal}>💾 保存分配方案</button>
      </div>

      {#if advice.length > 0}
        <div class="advice-list">
          {#each advice as item}
            <div class="advice-item" class:danger={item.level === 'danger'} class:warning={item.level === 'warning'}>
              <span class="advice-icon">
                {#if item.level === 'danger'}⚠️
                {:else if item.level === 'warning'}⚡
                {:else if item.level === 'success'}✅
                {:else}ℹ️{/if}
              </span>
              <span>{item.message}</span>
            </div>
          {/each}
        </div>
      {/if}

      <div class="distribution-list">
        {#each distribution as dist}
          <div class="distribution-card">
            <div class="distribution-header">
              <div class="member-info">
                <span class="member-avatar">{dist.member.name.charAt(0)}</span>
                <div>
                  <div class="member-name">{dist.member.name}</div>
                  <div class="member-sub">{teamRoles.find(r => r.id === dist.member.role)?.icon} {teamRoles.find(r => r.id === dist.member.role)?.name}</div>
                </div>
              </div>
              <div class="weight-info">
                <div class="weight-value">{(dist.totalWeight / 1000).toFixed(2)} <span class="unit">kg</span></div>
                <div class="utilization-bar">
                  <div class="utilization-fill"
                    style="width: {Math.min(100, dist.utilization)}%; background: {dist.utilization > 90 ? '#ef4444' : dist.utilization > 75 ? '#f97316' : '#22c55e'}"></div>
                </div>
                <div class="utilization-text">{dist.utilization}% 利用率</div>
              </div>
            </div>
            <div class="capacity-info">
              <span class="capacity-tag">能力: {(dist.capacity.adjustedCapacity / 1000).toFixed(1)}kg</span>
              <span class="capacity-tag">负重比: {((dist.totalWeight / 1000) / dist.member.bodyWeight * 100).toFixed(1)}%</span>
            </div>
            <div class="assigned-items">
              <details>
                <summary>分配物品 ({dist.items.length})</summary>
                <div class="items-grid">
                  {#each dist.items as item}
                    <div class="assigned-item" class:personal={item.personal}>
                      <span class="item-name">{item.name}</span>
                      <span class="item-weight">{(item.totalWeight / 1000).toFixed(2)}kg</span>
                      {#if item.personal}
                        <span class="item-tag personal">个人</span>
                      {:else}
                        <span class="item-tag shared">共享</span>
                      {/if}
                    </div>
                  {/each}
                </div>
              </details>
            </div>
          </div>
        {/each}
      </div>

      <div class="equipment-tips">
        <h3>💡 分配建议</h3>
        <ul class="tips-list">
          <li>共享装备（帐篷、炉具等）按角色和能力优先分配</li>
          <li>个人装备（衣物、鞋类等）由队员自行携带</li>
          <li>负重比建议控制在体重的20%-25%以内</li>
          <li>领队和经验丰富的队员可适当多分担装备</li>
          <li>新队员从轻量装备开始，逐步适应</li>
        </ul>
      </div>
    </section>
  </div>

  {#if showSaveModal}
    <div class="modal-overlay" on:click={() => showSaveModal = false}>
      <div class="modal-content" on:click|stopPropagation>
        <h3>保存分配方案</h3>
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
  .team-section {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .section-header h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
  }

  .mini-btn {
    padding: 0.375rem 0.75rem;
    background: #8b5cf6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.8rem;
    cursor: pointer;
  }

  .mini-members-list {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .mini-member {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    background: #f8fafc;
    border-radius: 0.375rem;
  }

  .mini-name {
    font-size: 0.85rem;
    font-weight: 500;
  }

  .mini-role {
    font-size: 0.9rem;
  }

  .remove-btn {
    padding: 0.125rem 0.5rem;
    border: none;
    background: #fef2f2;
    color: #ef4444;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .advice-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .advice-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #f0f9ff;
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }

  .advice-item.warning {
    background: #fffbeb;
  }

  .advice-item.danger {
    background: #fef2f2;
  }

  .advice-icon {
    font-size: 1rem;
  }

  .distribution-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1rem;
  }

  .distribution-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .distribution-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .member-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .member-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #06b6d4, #0891b2);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }

  .member-name {
    font-weight: 600;
    color: #1e293b;
  }

  .member-sub {
    font-size: 0.78rem;
    color: #64748b;
  }

  .weight-info {
    text-align: right;
  }

  .weight-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #06b6d4;
  }

  .weight-value .unit {
    font-size: 0.7rem;
    color: #64748b;
  }

  .utilization-bar {
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    overflow: hidden;
    margin-top: 0.25rem;
  }

  .utilization-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s;
  }

  .utilization-text {
    font-size: 0.72rem;
    color: #64748b;
    margin-top: 0.25rem;
  }

  .capacity-info {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .capacity-tag {
    background: #f0f9ff;
    color: #0369a1;
    padding: 0.25rem 0.5rem;
    border-radius: 999px;
    font-size: 0.72rem;
  }

  .assigned-items {
    border-top: 1px solid #e2e8f0;
    padding-top: 0.5rem;
  }

  .assigned-items details summary {
    cursor: pointer;
    font-size: 0.85rem;
    color: #64748b;
    padding: 0.25rem 0;
  }

  .items-grid {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    margin-top: 0.5rem;
  }

  .assigned-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.375rem 0.5rem;
    background: #f8fafc;
    border-radius: 0.375rem;
    font-size: 0.82rem;
  }

  .item-name {
    flex: 1;
  }

  .item-weight {
    color: #64748b;
    margin-right: 0.5rem;
  }

  .item-tag {
    font-size: 0.7rem;
    padding: 0.1rem 0.4rem;
    border-radius: 999px;
  }

  .item-tag.personal {
    background: #fef3c7;
    color: #92400e;
  }

  .item-tag.shared {
    background: #dbeafe;
    color: #1e40af;
  }

  .save-bar {
    margin-bottom: 1rem;
  }

  .save-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, #06b6d4, #0891b2);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .save-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(6, 182, 212, 0.3);
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
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
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
    background: #06b6d4;
    color: white;
    border-color: #06b6d4;
  }

  .modal-btn.primary:hover {
    background: #0891b2;
  }
</style>
