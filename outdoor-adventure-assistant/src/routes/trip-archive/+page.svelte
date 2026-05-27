<script>
  import { onMount } from 'svelte';
  import {
    getAllTrips,
    deleteTrip,
    toggleFavorite,
    addTag,
    removeTag,
    getTripStats,
    exportTrips,
    importTrips,
    clearAllTrips
  } from '../../lib/utils/tripArchive.js';
  export const prerender = true;

  let trips = [];
  let stats = null;
  let filterType = 'all';
  let searchQuery = '';
  let showFavoritesOnly = false;
  let selectedTrip = null;
  let showImportModal = false;
  let importData = '';
  let newTag = '';

  const tripTypes = [
    { id: 'all', name: '全部', icon: '📁' },
    { id: 'risk', name: '风险评估', icon: '⚠️' },
    { id: 'fitness', name: '体能测算', icon: '🔥' },
    { id: 'equipment', name: '装备推荐', icon: '🎒' }
  ];

  onMount(() => {
    loadTrips();
  });

  function loadTrips() {
    trips = getAllTrips();
    stats = getTripStats();
  }

  $: filteredTrips = trips.filter(trip => {
    if (filterType !== 'all' && trip.type !== filterType) return false;
    if (showFavoritesOnly && !trip.isFavorite) return false;
    if (searchQuery && !trip.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  function handleDelete(tripId) {
    if (confirm('确定要删除这个方案吗？')) {
      deleteTrip(tripId);
      loadTrips();
    }
  }

  function handleToggleFavorite(tripId) {
    toggleFavorite(tripId);
    loadTrips();
  }

  function handleAddTag(tripId) {
    if (newTag.trim()) {
      addTag(tripId, newTag.trim());
      newTag = '';
      loadTrips();
    }
  }

  function handleRemoveTag(tripId, tag) {
    removeTag(tripId, tag);
    loadTrips();
  }

  function handleExport() {
    exportTrips();
  }

  function handleImport() {
    if (importTrips(importData)) {
      alert('导入成功！');
      showImportModal = false;
      importData = '';
      loadTrips();
    } else {
      alert('导入失败，请检查数据格式');
    }
  }

  function handleClearAll() {
    if (confirm('确定要清空所有存档吗？此操作不可恢复！')) {
      clearAllTrips();
      loadTrips();
    }
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getTypeIcon(type) {
    const icons = {
      risk: '⚠️',
      fitness: '🔥',
      equipment: '🎒'
    };
    return icons[type] || '📄';
  }

  function getTypeName(type) {
    const names = {
      risk: '风险评估',
      fitness: '体能测算',
      equipment: '装备推荐'
    };
    return names[type] || type;
  }
</script>

<div class="module-page">
  <header class="module-header">
    <div class="module-header-icon" style="background: #8b5cf6">📦</div>
    <div>
      <h1>出行方案存档</h1>
      <p class="module-subtitle">保存和管理您的出行方案 · 支持收藏标签分类 · 数据导入导出</p>
    </div>
  </header>

  {#if stats}
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-content">
          <div class="stat-value">{stats.total}</div>
          <div class="stat-label">总方案数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-content">
          <div class="stat-value">{stats.favorites}</div>
          <div class="stat-label">收藏数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <div class="stat-value">{stats.thisMonth}</div>
          <div class="stat-label">本月新增</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔥</div>
        <div class="stat-content">
          <div class="stat-value">{Object.keys(stats.byType).length}</div>
          <div class="stat-label">方案类型</div>
        </div>
      </div>
    </div>
  {/if}

  <div class="toolbar">
    <div class="toolbar-left">
      <div class="filter-tabs">
        {#each tripTypes as type}
          <button
            class="filter-btn"
            class:active={filterType === type.id}
            on:click={() => filterType = type.id}
          >
            <span>{type.icon}</span>
            <span>{type.name}</span>
          </button>
        {/each}
      </div>
    </div>
    <div class="toolbar-right">
      <div class="search-box">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="搜索方案名称..."
        />
      </div>
      <label class="checkbox-item">
        <input type="checkbox" bind:checked={showFavoritesOnly} />
        <span>⭐ 仅显示收藏</span>
      </label>
    </div>
  </div>

  <div class="action-bar">
    <button class="action-btn primary" on:click={handleExport}>
      📤 导出数据
    </button>
    <button class="action-btn" on:click={() => showImportModal = true}>
      📥 导入数据
    </button>
    <button class="action-btn danger" on:click={handleClearAll}>
      🗑️ 清空全部
    </button>
  </div>

  {#if filteredTrips.length === 0}
    <div class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>暂无存档方案</h3>
      <p>在风险评估、体能测算或装备推荐页面完成计算后，点击"保存方案"即可存档</p>
      <div class="empty-links">
        <a href="/risk-assessment" class="empty-link">→ 去做风险评估</a>
        <a href="/fitness-calc" class="empty-link">→ 去做体能测算</a>
        <a href="/equipment" class="empty-link">→ 去看装备推荐</a>
      </div>
    </div>
  {:else}
    <div class="trips-grid">
      {#each filteredTrips as trip}
        <div class="trip-card" class:selected={selectedTrip?.id === trip.id} on:click={() => selectedTrip = trip}>
          <div class="trip-card-header">
            <div class="trip-type-badge">
              <span>{getTypeIcon(trip.type)}</span>
              <span>{getTypeName(trip.type)}</span>
            </div>
            <button
              class="favorite-btn"
              on:click|stopPropagation={() => handleToggleFavorite(trip.id)}
            >
              {trip.isFavorite ? '⭐' : '☆'}
            </button>
          </div>
          <h3 class="trip-name">{trip.name}</h3>
          <div class="trip-meta">
            <span class="trip-date">📅 {formatDate(trip.createdAt)}</span>
          </div>
          {#if trip.notes}
            <p class="trip-notes">{trip.notes}</p>
          {/if}
          {#if trip.tags && trip.tags.length > 0}
            <div class="trip-tags">
              {#each trip.tags as tag}
                <span class="tag">
                  {tag}
                  <button class="tag-remove" on:click={() => handleRemoveTag(trip.id, tag)}>×</button>
                </span>
              {/each}
            </div>
          {/if}
          <div class="trip-card-footer" on:click|stopPropagation>
            <div class="add-tag">
              <input
                type="text"
                placeholder="添加标签..."
                bind:value={newTag}
                on:keydown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag(trip.id);
                  }
                }}
              />
            </div>
            <button class="delete-btn" on:click={() => handleDelete(trip.id)}>
              🗑️
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  {#if selectedTrip}
    <div class="modal-overlay" on:click={() => selectedTrip = null}>
      <div class="modal-content detail-modal" on:click|stopPropagation>
        <div class="detail-header">
          <div>
            <h3>{selectedTrip.name}</h3>
            <div class="detail-type">
              {getTypeIcon(selectedTrip.type)} {getTypeName(selectedTrip.type)}
            </div>
          </div>
          <button class="close-btn" on:click={() => selectedTrip = null}>×</button>
        </div>

        <div class="detail-meta">
          <span>📅 {formatDate(selectedTrip.createdAt)}</span>
          {#if selectedTrip.isFavorite}
            <span>⭐ 已收藏</span>
          {/if}
        </div>

        {#if selectedTrip.notes}
          <div class="detail-notes">
            <strong>备注：</strong>
            <p>{selectedTrip.notes}</p>
          </div>
        {/if}

        <div class="detail-data">
          <h4>方案详情</h4>
          
          {#if selectedTrip.type === 'risk'}
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">综合风险评分</span>
                <span class="detail-value">{selectedTrip.data.riskScore}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">风险等级</span>
                <span class="detail-value">{selectedTrip.data.riskLevel}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">路线难度</span>
                <span class="detail-value">{selectedTrip.data.routeDifficulty}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">天气状况</span>
                <span class="detail-value">{selectedTrip.data.weather}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">地形类型</span>
                <span class="detail-value">{selectedTrip.data.terrain}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">户外经验</span>
                <span class="detail-value">{selectedTrip.data.experience}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">海拔高度</span>
                <span class="detail-value">{selectedTrip.data.altitude} 米</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">活动时长</span>
                <span class="detail-value">{selectedTrip.data.duration} 小时</span>
              </div>
            </div>
          {:else if selectedTrip.type === 'fitness'}
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">徒步里程</span>
                <span class="detail-value">{selectedTrip.data.distance} 公里</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">海拔落差</span>
                <span class="detail-value">{selectedTrip.data.elevation} 米</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">总负重</span>
                <span class="detail-value">{selectedTrip.data.weight + selectedTrip.data.packWeight} kg</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">预计总消耗</span>
                <span class="detail-value">{selectedTrip.data.result.totalCalories} 千卡</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">徒步时长</span>
                <span class="detail-value">{selectedTrip.data.result.durationHours} 小时</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">体能指数</span>
                <span class="detail-value">{selectedTrip.data.fitnessIndex}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">体能等级</span>
                <span class="detail-value">{selectedTrip.data.fitnessLevel}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">建议饮水量</span>
                <span class="detail-value">{selectedTrip.data.waterIntake.totalLiters} 升</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">建议总热量</span>
                <span class="detail-value">{selectedTrip.data.foodIntake.totalCalories} 千卡</span>
              </div>
            </div>
          {:else if selectedTrip.type === 'equipment'}
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">活动类型</span>
                <span class="detail-value">{selectedTrip.data.activity}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">活动时长</span>
                <span class="detail-value">{selectedTrip.data.duration} 小时</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">季节</span>
                <span class="detail-value">{selectedTrip.data.season}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">预估总重量</span>
                <span class="detail-value">{selectedTrip.data.totalWeight}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">装备总数</span>
                <span class="detail-value">{selectedTrip.data.totalCount} 件</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">必备装备</span>
                <span class="detail-value">{selectedTrip.data.essentialCount} 件</span>
              </div>
            </div>
            {#if selectedTrip.data.categories}
              <div class="equipment-categories">
                <h5>装备分类</h5>
                {#each Object.entries(selectedTrip.data.categories) as [category, items]}
                  {#if items.length > 0}
                    <div class="eq-category">
                      <div class="eq-category-name">{category}</div>
                      <div class="eq-items">
                        {#each items as item}
                          <span class="eq-item">{item.name}{item.quantity > 1 ? ' ×' + item.quantity : ''}</span>
                        {/each}
                      </div>
                    </div>
                  {/if}
                {/each}
              </div>
            {/if}
          {/if}
        </div>
      </div>
    </div>
  {/if}

  {#if showImportModal}
    <div class="modal-overlay" on:click={() => showImportModal = false}>
      <div class="modal-content" on:click|stopPropagation>
        <h3>导入数据</h3>
        <p class="modal-desc">请粘贴JSON格式的存档数据</p>
        <textarea
            bind:value={importData}
            placeholder="请粘贴JSON格式的存档数据..."
            rows="10"
          ></textarea>
        <div class="modal-actions">
          <button class="modal-btn" on:click={() => showImportModal = false}>取消</button>
          <button class="modal-btn primary" on:click={handleImport}>确认导入</button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: white;
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .stat-icon {
    font-size: 2rem;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    line-height: 1;
  }

  .stat-label {
    font-size: 0.8rem;
    color: #64748b;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .filter-tabs {
    display: flex;
    gap: 0.5rem;
    background: #f1f5f9;
    padding: 0.25rem;
    border-radius: 0.5rem;
  }

  .filter-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    background: transparent;
    cursor: pointer;
    font-size: 0.875rem;
    color: #64748b;
    transition: all 0.2s;
  }

  .filter-btn.active {
    background: white;
    color: #1e293b;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .search-box input {
    padding: 0.5rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }

  .checkbox-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #475569;
    cursor: pointer;
  }

  .action-bar {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .action-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .action-btn:hover {
    background: #f8fafc;
  }

  .action-btn.primary {
    background: #8b5cf6;
    color: white;
    border-color: #8b5cf6;
  }

  .action-btn.primary:hover {
    background: #7c3aed;
  }

  .action-btn.danger {
    color: #dc2626;
  }

  .action-btn.danger:hover {
    background: #fef2f2;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: #f8fafc;
    border-radius: 1rem;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-state h3 {
    margin: 0 0 0.5rem 0;
    color: #1e293b;
  }

  .empty-state p {
    color: #64748b;
    margin-bottom: 1.5rem;
  }

  .empty-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .empty-link {
    color: #8b5cf6;
    text-decoration: none;
  }

  .empty-link:hover {
    text-decoration: underline;
  }

  .trips-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  .trip-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    transition: all 0.2s;
  }

  .trip-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .trip-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .trip-type-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: #f1f5f9;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    color: #475569;
  }

  .favorite-btn {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.25rem;
  }

  .trip-name {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    color: #1e293b;
  }

  .trip-meta {
    margin-bottom: 0.5rem;
  }

  .trip-date {
    font-size: 0.75rem;
    color: #64748b;
  }

  .trip-notes {
    font-size: 0.875rem;
    color: #475569;
    margin: 0.5rem 0;
    padding: 0.5rem;
    background: #f8fafc;
    border-radius: 0.375rem;
  }

  .trip-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: #ede9fe;
    color: #6d28d9;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
  }

  .tag-remove {
    background: none;
    border: none;
    cursor: pointer;
    font-weight: bold;
    color: #6d28d9;
    padding: 0;
    line-height: 1;
  }

  .trip-card-footer {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .add-tag input {
    flex: 1;
    padding: 0.375rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    width: 100%;
  }

  .delete-btn {
    background: #fef2f2;
    border: none;
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .delete-btn:hover {
    background: #fee2e2;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    max-width: 600px;
    width: 90%;
  }

  .modal-content h3 {
    margin: 0 0 0.5rem 0;
    color: #1e293b;
  }

  .modal-desc {
    color: #64748b;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  .modal-content textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    font-family: monospace;
    font-size: 0.875rem;
    resize: vertical;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .modal-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;
  }

  .modal-btn.primary {
    background: #8b5cf6;
    color: white;
    border-color: #8b5cf6;
  }

  .detail-modal {
    max-width: 700px;
    max-height: 80vh;
    overflow-y: auto;
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .detail-type {
    font-size: 0.875rem;
    color: #64748b;
    margin-top: 0.25rem;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #64748b;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
  }

  .close-btn:hover {
    background: #f1f5f9;
  }

  .detail-meta {
    display: flex;
    gap: 1rem;
    color: #64748b;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .detail-notes {
    background: #f8fafc;
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  .detail-notes p {
    margin: 0.25rem 0 0 0;
    color: #475569;
  }

  .detail-data h4 {
    margin: 0 0 1rem 0;
    color: #1e293b;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .detail-item {
    background: #f8fafc;
    padding: 0.75rem;
    border-radius: 0.5rem;
  }

  .detail-label {
    display: block;
    font-size: 0.75rem;
    color: #64748b;
    margin-bottom: 0.25rem;
  }

  .detail-value {
    font-weight: 600;
    color: #1e293b;
    font-size: 0.875rem;
  }

  .equipment-categories {
    margin-top: 1rem;
  }

  .equipment-categories h5 {
    margin: 0 0 0.75rem 0;
    color: #475569;
  }

  .eq-category {
    margin-bottom: 0.75rem;
    background: #f8fafc;
    border-radius: 0.5rem;
    padding: 0.75rem;
  }

  .eq-category-name {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }

  .eq-items {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .eq-item {
    background: white;
    padding: 0.25rem 0.625rem;
    border-radius: 0.375rem;
    font-size: 0.8rem;
    color: #475569;
    border: 1px solid #e2e8f0;
  }

  .trip-card {
    cursor: pointer;
  }

  .trip-card.selected {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
  }
</style>
