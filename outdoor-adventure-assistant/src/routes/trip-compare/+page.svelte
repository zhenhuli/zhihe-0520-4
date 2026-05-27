<script>
  import { onMount } from 'svelte';
  import { getAllTrips } from '../../lib/utils/tripArchive.js';
  export const prerender = true;

  let trips = [];
  let selectedTrips = [];
  let compareMode = false;

  onMount(() => {
    trips = getAllTrips();
  });

  function toggleTripSelection(tripId) {
    if (selectedTrips.includes(tripId)) {
      selectedTrips = selectedTrips.filter(id => id !== tripId);
    } else if (selectedTrips.length < 3) {
      selectedTrips = [...selectedTrips, tripId];
    }
  }

  $: selectedTripData = selectedTrips.map(id => trips.find(t => t.id === id)).filter(Boolean);

  function startCompare() {
    compareMode = true;
  }

  function clearSelection() {
    selectedTrips = [];
    compareMode = false;
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('zh-CN');
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

  function getTripValue(trip, key) {
    if (!trip || !trip.data) return '-';
    return trip.data[key] ?? '-';
  }
</script>

<div class="module-page">
  <header class="module-header">
    <div class="module-header-icon" style="background: #06b6d4">📊</div>
    <div>
      <h1>历史出行对比</h1>
      <p class="module-subtitle">对比分析多次出行数据 · 发现进步空间 · 优化装备配置</p>
    </div>
  </header>

  {#if !compareMode}
    <div class="compare-intro">
      <div class="intro-card">
        <div class="intro-icon">💡</div>
        <div class="intro-content">
          <h3>如何使用对比功能</h3>
          <p>选择最多 3 个存档方案进行对比分析，查看不同配置的差异，帮助您优化未来的出行计划。</p>
        </div>
      </div>
    </div>

    <div class="selection-header">
      <h3>选择要对比的方案（最多3个）</h3>
      <div class="selection-actions">
        <span class="selection-count">已选择 {selectedTrips.length}/3</span>
        {#if selectedTrips.length >= 2}
          <button class="compare-btn" on:click={startCompare}>
            开始对比
          </button>
        {/if}
        {#if selectedTrips.length > 0}
          <button class="clear-btn" on:click={clearSelection}>
            清除选择
          </button>
        {/if}
      </div>
    </div>

    {#if trips.length === 0}
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>暂无存档方案</h3>
        <p>请先在其他功能页面保存方案，然后再来进行对比分析</p>
        <a href="/trip-archive" class="empty-link">→ 查看方案存档</a>
      </div>
    {:else}
      <div class="trips-select-grid">
        {#each trips as trip}
          <div
            class="trip-select-card"
            class:selected={selectedTrips.includes(trip.id)}
            on:click={() => toggleTripSelection(trip.id)}
          >
            <div class="select-checkbox">
              {selectedTrips.includes(trip.id) ? '✓' : ''}
            </div>
            <div class="trip-select-content">
              <div class="trip-select-header">
                <span class="trip-type-icon">{getTypeIcon(trip.type)}</span>
                <h4>{trip.name}</h4>
              </div>
              <div class="trip-select-meta">
                <span>{getTypeName(trip.type)}</span>
                <span>·</span>
                <span>{formatDate(trip.createdAt)}</span>
              </div>
              {#if trip.tags && trip.tags.length > 0}
                <div class="trip-select-tags">
                  {#each trip.tags.slice(0, 3) as tag}
                    <span class="mini-tag">{tag}</span>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {:else}
    <div class="compare-results">
      <div class="compare-header">
        <h3>对比分析结果</h3>
        <button class="back-btn" on:click={() => compareMode = false}>← 返回选择</button>
      </div>

      <div class="compare-table-container">
        <table class="compare-table">
          <thead>
            <tr>
              <th class="compare-label-col">对比项</th>
              {#each selectedTripData as trip}
                <th class="compare-trip-col">
                  <div class="compare-trip-header">
                    <span class="trip-icon">{getTypeIcon(trip.type)}</span>
                    <span class="trip-name">{trip.name}</span>
                  </div>
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="compare-label">方案类型</td>
              {#each selectedTripData as trip}
                <td>{getTypeName(trip.type)}</td>
              {/each}
            </tr>
            <tr>
              <td class="compare-label">创建时间</td>
              {#each selectedTripData as trip}
                <td>{formatDate(trip.createdAt)}</td>
              {/each}
            </tr>
            <tr class="compare-section">
              <td colspan="4">📊 核心数据对比</td>
            </tr>
            {#if selectedTripData.some(t => t.type === 'risk')}
              <tr>
                <td class="compare-label">风险评分</td>
                {#each selectedTripData as trip}
                  <td>{trip.data?.riskScore ?? '-'}</td>
                {/each}
              </tr>
              <tr>
                <td class="compare-label">路线难度</td>
                {#each selectedTripData as trip}
                  <td>{trip.data?.routeDifficulty ?? '-'}</td>
                {/each}
              </tr>
            {/if}
            {#if selectedTripData.some(t => t.type === 'fitness')}
              <tr>
                <td class="compare-label">总距离</td>
                {#each selectedTripData as trip}
                  <td>{trip.data?.distance ?? '-'} 公里</td>
                {/each}
              </tr>
              <tr>
                <td class="compare-label">海拔爬升</td>
                {#each selectedTripData as trip}
                  <td>{trip.data?.elevation ?? '-'} 米</td>
                {/each}
              </tr>
              <tr>
                <td class="compare-label">预计热量消耗</td>
                {#each selectedTripData as trip}
                  <td>{trip.data?.calories ?? '-'} 千卡</td>
                {/each}
              </tr>
              <tr>
                <td class="compare-label">建议饮水量</td>
                {#each selectedTripData as trip}
                  <td>{trip.data?.water ?? '-'} 升</td>
                {/each}
              </tr>
            {/if}
            {#if selectedTripData.some(t => t.type === 'equipment')}
              <tr>
                <td class="compare-label">装备总数</td>
                {#each selectedTripData as trip}
                  <td>{trip.data?.equipmentCount ?? '-'} 件</td>
                {/each}
              </tr>
              <tr>
                <td class="compare-label">预估总重量</td>
                {#each selectedTripData as trip}
                  <td>{trip.data?.totalWeight ?? '-'} kg</td>
                {/each}
              </tr>
            {/if}
            <tr class="compare-section">
              <td colspan="4">📝 备注信息</td>
            </tr>
            <tr>
              <td class="compare-label">备注</td>
              {#each selectedTripData as trip}
                <td>{trip.notes || '无'}</td>
              {/each}
            </tr>
            <tr>
              <td class="compare-label">标签</td>
              {#each selectedTripData as trip}
                <td>
                  {#if trip.tags && trip.tags.length > 0}
                    <div class="tag-list">
                      {#each trip.tags as tag}
                        <span class="mini-tag">{tag}</span>
                      {/each}
                    </div>
                  {:else}
                    无
                  {/if}
                </td>
              {/each}
            </tr>
          </tbody>
        </table>
      </div>

      <div class="compare-summary">
        <h4>📈 对比分析总结</h4>
        <div class="summary-content">
          <p>基于 {selectedTripData.length} 个方案的对比分析：</p>
          <ul>
            <li>建议根据实际情况选择最适合的配置方案</li>
            <li>可参考历史数据优化未来的出行计划</li>
            <li>关注装备重量与实用性的平衡</li>
            <li>根据体能状况合理调整行程强度</li>
          </ul>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .compare-intro {
    margin-bottom: 1.5rem;
  }

  .intro-card {
    display: flex;
    gap: 1rem;
    background: linear-gradient(135deg, #ecfeff, #cffafe);
    border-radius: 0.75rem;
    padding: 1rem;
    border: 1px solid #a5f3fc;
  }

  .intro-icon {
    font-size: 2rem;
  }

  .intro-content h3 {
    margin: 0 0 0.25rem 0;
    color: #0e7490;
    font-size: 1rem;
  }

  .intro-content p {
    margin: 0;
    color: #0891b2;
    font-size: 0.875rem;
  }

  .selection-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .selection-header h3 {
    margin: 0;
    color: #1e293b;
  }

  .selection-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .selection-count {
    color: #64748b;
    font-size: 0.875rem;
  }

  .compare-btn {
    padding: 0.5rem 1rem;
    background: #06b6d4;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .compare-btn:hover {
    background: #0891b2;
  }

  .clear-btn {
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .clear-btn:hover {
    background: #f8fafc;
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
    margin-bottom: 1rem;
  }

  .empty-link {
    color: #06b6d4;
    text-decoration: none;
  }

  .trips-select-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  .trip-select-card {
    display: flex;
    gap: 0.75rem;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .trip-select-card:hover {
    border-color: #06b6d4;
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.1);
  }

  .trip-select-card.selected {
    border-color: #06b6d4;
    background: #ecfeff;
  }

  .select-checkbox {
    width: 24px;
    height: 24px;
    border: 2px solid #cbd5e1;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
    flex-shrink: 0;
    transition: all 0.2s;
  }

  .trip-select-card.selected .select-checkbox {
    background: #06b6d4;
    border-color: #06b6d4;
  }

  .trip-select-content {
    flex: 1;
  }

  .trip-select-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .trip-type-icon {
    font-size: 1rem;
  }

  .trip-select-header h4 {
    margin: 0;
    font-size: 0.95rem;
    color: #1e293b;
  }

  .trip-select-meta {
    font-size: 0.75rem;
    color: #64748b;
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .trip-select-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .mini-tag {
    background: #e0f2fe;
    color: #0369a1;
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.7rem;
  }

  .compare-results {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .compare-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .compare-header h3 {
    margin: 0;
    color: #1e293b;
  }

  .back-btn {
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .back-btn:hover {
    background: #f8fafc;
  }

  .compare-table-container {
    overflow-x: auto;
    margin-bottom: 1.5rem;
  }

  .compare-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
  }

  .compare-table th,
  .compare-table td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  .compare-table th {
    background: #f8fafc;
    font-weight: 600;
    color: #475569;
  }

  .compare-label-col {
    width: 150px;
  }

  .compare-trip-col {
    min-width: 180px;
  }

  .compare-trip-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .trip-icon {
    font-size: 1.25rem;
  }

  .trip-name {
    font-weight: 600;
    color: #1e293b;
  }

  .compare-label {
    font-weight: 500;
    color: #64748b;
    background: #f8fafc;
  }

  .compare-section td {
    background: #f0f9ff;
    font-weight: 600;
    color: #0369a1;
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .compare-summary {
    background: #f0fdfa;
    border-radius: 0.75rem;
    padding: 1rem;
    border: 1px solid #99f6e4;
  }

  .compare-summary h4 {
    margin: 0 0 0.75rem 0;
    color: #0f766e;
  }

  .summary-content p {
    margin: 0 0 0.5rem 0;
    color: #115e59;
  }

  .summary-content ul {
    margin: 0;
    padding-left: 1.25rem;
  }

  .summary-content li {
    color: #0f766e;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
  }
</style>
