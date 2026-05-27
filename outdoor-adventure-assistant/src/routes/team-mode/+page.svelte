<script>
  import { teamRoles, fitnessLevels, experienceLevels, createMember, calculateMemberCapacity, getRoleInfo } from '../../lib/data/teamData.js';
  import { saveTrip } from '../../lib/utils/tripArchive.js';
  export const prerender = true;

  let members = [
    createMember('张三', 'leader', 70, 'good', 'advanced'),
    createMember('李四', 'navigator', 65, 'good', 'intermediate')
  ];

  let activeTab = 'members';
  let showAddModal = false;
  let editingMember = null;

  let newMember = { name: '', role: 'member', bodyWeight: 65, fitness: 'good', experience: 'intermediate' };
  let saveName = '';
  let saveNotes = '';
  let showSaveModal = false;

  $: memberCapacities = members.map(m => ({
    member: m,
    capacity: calculateMemberCapacity(m)
  }));

  $: teamStats = {
    totalMembers: members.length,
    totalCapacity: memberCapacities.reduce((sum, mc) => sum + mc.capacity.adjustedCapacity, 0),
    avgCapacity: memberCapacities.length > 0
      ? Math.round(memberCapacities.reduce((sum, mc) => sum + mc.capacity.adjustedCapacity, 0) / memberCapacities.length)
      : 0,
    roleDistribution: getRoleDistribution()
  };

  function getRoleDistribution() {
    const dist = {};
    for (const m of members) {
      dist[m.role] = (dist[m.role] || 0) + 1;
    }
    return dist;
  }

  function openAddModal() {
    showAddModal = true;
    editingMember = null;
    newMember = { name: '', role: 'member', bodyWeight: 65, fitness: 'good', experience: 'intermediate' };
  }

  function openEditModal(member) {
    showAddModal = true;
    editingMember = member;
    newMember = { ...member };
  }

  function saveMember() {
    if (!newMember.name.trim()) {
      alert('请输入队员姓名');
      return;
    }

    if (editingMember) {
      const idx = members.findIndex(m => m.id === editingMember.id);
      if (idx !== -1) {
        members[idx] = { ...members[idx], ...newMember };
        members = members;
      }
    } else {
      const member = createMember(newMember.name, newMember.role, newMember.bodyWeight, newMember.fitness, newMember.experience);
      members = [...members, member];
    }

    showAddModal = false;
  }

  function removeMember(id) {
    if (members.length <= 1) {
      alert('至少保留至少需要一名队员');
      return;
    }
    members = members.filter(m => m.id !== id);
  }

  function updateMemberRole(id, role) {
    const idx = members.findIndex(m => m.id === id);
    if (idx !== -1) {
      members[idx].role = role;
      members = members;
    }
  }

  function openSaveModal() {
    saveName = `团队出行-${new Date().toLocaleDateString('zh-CN')}`;
    saveNotes = '';
    showSaveModal = true;
  }

  function handleSave() {
    if (!saveName.trim()) {
      alert('请输入方案名称');
      return;
    }

    saveTrip({
      type: 'team',
      name: saveName.trim(),
      notes: saveNotes.trim(),
      data: {
        members: members.map(m => ({
          name: m.name,
          role: m.role,
          bodyWeight: m.bodyWeight,
          fitness: m.fitness,
          experience: m.experience,
          notes: m.notes
        })),
        teamStats
      }
    });

    alert('团队方案已保存到存档！');
    showSaveModal = false;
  }
</script>

<div class="module-page">
  <header class="module-header">
    <div class="module-header-icon" style="background: #8b5cf6">👥</div>
    <div>
      <h1>团队出行模式</h1>
      <p class="module-subtitle">团队组建 · 角色分配 · 能力评估</p>
    </div>
  </header>

  <div class="tabs">
    <button class="tab-btn" class:active={activeTab === 'members'} on:click={() => activeTab = 'members'}>
      👥 团队成员
    </button>
    <button class="tab-btn" class:active={activeTab === 'capacity'} on:click={() => activeTab = 'capacity'}>
      ⚖️ 能力评估
    </button>
    <button class="tab-btn" class:active={activeTab === 'roles'} on:click={() => activeTab = 'roles'}>
      📋 角色说明
    </button>
  </div>

  <div class="module-layout">
    <section class="input-panel">
      <h2 class="panel-title">团队操作</h2>

      <div class="team-actions">
        <button class="primary-btn" on:click={openAddModal}>
        ➕ 添加队员
        </button>
        <button class="secondary-btn" on:click={openSaveModal}>
        💾 保存团队方案
        </button>
      </div>

      <div class="team-summary">
        <div class="summary-item">
          <span class="summary-label">团队人数</span>
          <span class="summary-value">{teamStats.totalMembers}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">总负重能力</span>
          <span class="summary-value">{(teamStats.totalCapacity / 1000).toFixed(1)}kg</span>
        </div>
      </div>

      {#if activeTab === 'roles'}
        <div class="role-info">
          <h3>角色职责说明</h3>
          {#each teamRoles as role}
            <div class="role-card">
              <div class="role-header">
                <span class="role-icon">{role.icon}</span>
                <span class="role-name">{role.name}</span>
              </div>
              <p class="role-desc">{role.description}</p>
              <div class="role-skills">
                {#each role.essentialSkills as skill}
                  <span class="skill-tag">{skill}</span>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </section>

    <section class="result-panel">
      {#if activeTab === 'members'}
        <div class="members-list">
          {#each members as member, i}
            <div class="member-card">
              <div class="member-header">
                <div class="member-avatar">{member.name.charAt(0)}</div>
                <div class="member-info">
                  <div class="member-name">{member.name}</div>
                  <select bind:value={member.role} on:change={(e) => updateMemberRole(member.id, e.target.value)} class="role-select">
                    {#each teamRoles as role}
                      <option value={role.id}>{role.icon} {role.name}</option>
                    {/each}
                  </select>
                </div>
                <div class="member-actions">
                  <button class="icon-btn" on:click={() => openEditModal(member)}>✏️</button>
                  <button class="icon-btn danger" on:click={() => removeMember(member.id)}>🗑️</button>
                </div>
              </div>
              <div class="member-details">
                <span class="detail-item">
                  <span class="detail-label">体重</span>
                  <span class="detail-value">{member.bodyWeight}kg</span>
                </span>
                <span class="detail-item">
                  <span class="detail-label">体能</span>
                  <span class="detail-value">{getRoleInfo(member.fitness).icon} {getRoleInfo(member.fitness).name}</span>
                </span>
                <span class="detail-item">
                  <span class="detail-label">经验</span>
                  <span class="detail-value">{getRoleInfo(member.experience).icon} {getRoleInfo(member.experience).name}</span>
                </span>
              </div>
            </div>
          {/each}
        </div>
      {:else if activeTab === 'capacity'}
        <div class="capacity-list">
          {#each memberCapacities as mc}
            <div class="capacity-card">
              <div class="capacity-header">
                <span class="capacity-name">{mc.member.name}</span>
                <span class="capacity-role">{getRoleInfo(mc.member.role).icon} {getRoleInfo(mc.member.role).name}</span>
              </div>
              <div class="capacity-values">
                <div class="capacity-item">
                  <span class="capacity-label">基础负重</span>
                  <span class="capacity-value">{(mc.capacity.baseCapacity / 1000).toFixed(1)}kg</span>
                </div>
                <div class="capacity-item">
                  <span class="capacity-label">调整后</span>
                  <span class="capacity-value highlight">{(mc.capacity.adjustedCapacity / 1000).toFixed(1)}kg</span>
                </div>
              </div>
              <div class="capacity-factors">
                <span class="factor-tag">角色×{mc.capacity.roleMultiplier}</span>
                <span class="factor-tag">体能×{mc.capacity.fitnessMultiplier}</span>
                <span class="factor-tag">经验×{mc.capacity.experienceMultiplier}</span>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </section>
  </div>

  {#if showAddModal}
    <div class="modal-overlay" on:click={() => showAddModal = false}>
      <div class="modal-content" on:click|stopPropagation>
        <h3>{editingMember ? '编辑队员' : '添加队员'}</h3>
        <div class="modal-form">
          <div class="form-group">
            <label class="form-label">姓名 *</label>
            <input type="text" class="form-input" bind:value={newMember.name} placeholder="输入队员姓名" />
          </div>
          <div class="form-group">
            <label class="form-label">角色</label>
            <select class="form-select" bind:value={newMember.role}>
              {#each teamRoles as role}
                <option value={role.id}>{role.icon} {role.name} - {role.description}</option>
              {/each}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">体重 (kg)</label>
            <div class="range-input">
              <input type="range" bind:value={newMember.bodyWeight} min="40" max="120" step="1" />
              <span class="range-value">{newMember.bodyWeight} kg</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">体能水平</label>
            <select class="form-select" bind:value={newMember.fitness}>
              {#each fitnessLevels as level}
                <option value={level.id}>{level.icon} {level.name}</option>
              {/each}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">户外经验</label>
            <select class="form-select" bind:value={newMember.experience}>
              {#each experienceLevels as level}
                <option value={level.id}>{level.icon} {level.name}</option>
              {/each}
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button class="modal-btn" on:click={() => showAddModal = false}>取消</button>
          <button class="modal-btn primary" on:click={saveMember}>确认</button>
        </div>
      </div>
    </div>
  {/if}

  {#if showSaveModal}
    <div class="modal-overlay" on:click={() => showSaveModal = false}>
      <div class="modal-content" on:click|stopPropagation>
        <h3>保存团队方案</h3>
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
  .team-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .primary-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .primary-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(139, 92, 246, 0.3);
  }

  .secondary-btn {
    width: 100%;
    padding: 0.625rem 1rem;
    background: white;
    color: #475569;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .secondary-btn:hover {
    border-color: #8b5cf6;
    color: #8b5cf6;
  }

  .team-summary {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .summary-item {
    background: #f8fafc;
    border-radius: 0.5rem;
    padding: 0.75rem;
    text-align: center;
  }

  .summary-label {
    display: block;
    font-size: 0.75rem;
    color: #64748b;
    margin-bottom: 0.25rem;
  }

  .summary-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #8b5cf6;
  }

  .role-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .role-info h3 {
    font-size: 0.9rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  .role-card {
    background: #f8fafc;
    border-radius: 0.5rem;
    padding: 0.75rem;
  }

  .role-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .role-icon {
    font-size: 1.25rem;
  }

  .role-name {
    font-weight: 600;
    color: #1e293b;
  }

  .role-desc {
    font-size: 0.8rem;
    color: #64748b;
    margin-bottom: 0.5rem;
  }

  .role-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .skill-tag {
    background: #ede9fe;
    color: #7c3aed;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    font-size: 0.72rem;
  }

  .members-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .member-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .member-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .member-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .member-info {
    flex: 1;
  }

  .member-name {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }

  .role-select {
    padding: 0.375rem 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    font-size: 0.82rem;
    background: white;
    cursor: pointer;
  }

  .member-actions {
    display: flex;
    gap: 0.5rem;
  }

  .icon-btn {
    padding: 0.375rem 0.5rem;
    border: none;
    background: #f1f5f9;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s;
  }

  .icon-btn:hover {
    background: #e2e8f0;
  }

  .icon-btn.danger:hover {
    background: #fef2f2;
  }

  .member-details {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
  }

  .detail-label {
    font-size: 0.72rem;
    color: #94a3b8;
  }

  .detail-value {
    font-size: 0.85rem;
    font-weight: 600;
    color: #475569;
  }

  .capacity-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .capacity-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .capacity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .capacity-name {
    font-weight: 600;
    color: #1e293b;
  }

  .capacity-role {
    font-size: 0.85rem;
    color: #8b5cf6;
  }

  .capacity-values {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .capacity-item {
    background: #f8fafc;
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
  }

  .capacity-label {
    display: block;
    font-size: 0.72rem;
    color: #64748b;
  }

  .capacity-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: #3b82f6;
  }

  .capacity-value.highlight {
    color: #8b5cf6;
  }

  .capacity-factors {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .factor-tag {
    background: #ede9fe;
    color: #7c3aed;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    font-size: 0.72rem;
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
    max-height: 90vh;
    overflow-y: auto;
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
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
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
    background: #8b5cf6;
    color: white;
    border-color: #8b5cf6;
  }

  .modal-btn.primary:hover {
    background: #7c3aed;
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
</style>
