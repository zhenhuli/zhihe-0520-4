<script>
  import { nodeTypes, activityTypesAtNode, createRouteNode, calculateRouteStats, generateRouteTimeline, validateRoute, estimateTravelTime, formatDuration } from '../../lib/utils/routePlanner.js';
  import { saveTrip } from '../../lib/utils/tripArchive.js';
  export const prerender = true;

  function formatTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  let nodes = [
    { ...createRouteNode({ name: '出发点', type: 'start', estimatedTime: 0 }) },
    { ...createRouteNode({ name: '半山腰休息点', type: 'rest', distanceFromPrev: 3, elevationGain: 300, estimatedTime: 90, altitude: 800 }) },
    { ...createRouteNode({ name: '山顶', type: 'summit', distanceFromPrev: 2, elevationGain: 400, estimatedTime: 120, altitude: 1200 }) },
    { ...createRouteNode({ name: '终点', type: 'end', distanceFromPrev: 5, elevationGain: -600, estimatedTime: 120, altitude: 600 }) }
  ];

  let activeTab = 'nodes';
  let showAddNodeModal = false;
  let editingNode = null;
  let showSaveModal = false;
  let saveName = '';
  let saveNotes = '';

  let newNode = {
    name: '',
    type: 'waypoint',
    altitude: 0,
    distanceFromPrev: 1,
    elevationGain: 0,
    estimatedTime: 60,
    activityType: 'hike',
    notes: ''
  };

  $: routeStats = calculateRouteStats(nodes);
  $: timeline = generateRouteTimeline(nodes);
  $: routeIssues = validateRoute(nodes);

  function openAddNodeModal() {
    showAddNodeModal = true;
    editingNode = null;
    newNode = {
      name: '',
      type: 'waypoint',
      altitude: 0,
      distanceFromPrev: 1,
      elevationGain: 0,
      estimatedTime: 60,
      activityType: 'hike',
      notes: ''
    };
  }

  function openEditNodeModal(node, index) {
    showAddNodeModal = true;
    editingNode = { node, index };
    newNode = { ...node };
  }

  function saveNode() {
    if (!newNode.name.trim()) {
      alert('请输入节点名称');
      return;
    }

    if (editingNode) {
      nodes[editingNode.index] = { ...nodes[editingNode.index], ...newNode };
      nodes = nodes;
    } else {
      const node = createRouteNode(newNode);
      nodes = [...nodes, node];
    }

    showAddNodeModal = false;
  }

  function removeNode(index) {
    if (nodes.length <= 2) {
      alert('至少需要两个节点');
      return;
    }
    nodes = nodes.filter((_, i) => i !== index);
  }

  function moveNodeUp(index) {
    if (index > 0) {
      const arr = [...nodes];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      nodes = arr;
    }
  }

  function moveNodeDown(index) {
    if (index < nodes.length - 1) {
      const arr = [...nodes];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      nodes = arr;
    }
  }

  function autoEstimateTime() {
    for (let i = 1; i < nodes.length; i++) {
      nodes[i].estimatedTime = estimateTravelTime(nodes[i].distanceFromPrev, Math.abs(nodes[i].elevationGain));
    }
    nodes = nodes;
  }

  function openSaveModal() {
    saveName = `路线规划-${new Date().toLocaleDateString('zh-CN')}`;
    saveNotes = '';
    showSaveModal = true;
  }

  function handleSave() {
    if (!saveName.trim()) {
      alert('请输入方案名称');
      return;
    }

    saveTrip({
      type: 'route',
      name: saveName.trim(),
      notes: saveNotes.trim(),
      data: {
        nodes: nodes.map(n => ({
          name: n.name,
          type: n.type,
          altitude: n.altitude,
          distanceFromPrev: n.distanceFromPrev,
          elevationGain: n.elevationGain,
          estimatedTime: n.estimatedTime,
          activityType: n.activityType,
          notes: n.notes
        })),
        stats: routeStats
      }
    });

    alert('路线规划方案已保存到存档！');
    showSaveModal = false;
  }
</script>

<div class="module-page">
  <header class="module-header">
    <div class="module-header-icon" style="background: #f59e0b">🗺️</div>
    <div>
      <h1>路线节点规划</h1>
      <p class="module-subtitle">节点设置 · 时间估算 · 路线评估</p>
    </div>
  </header>

  <div class="tabs">
    <button class="tab-btn" class:active={activeTab === 'nodes'} on:click={() => activeTab = 'nodes'}>
      📍 路线节点
    </button>
    <button class="tab-btn" class:active={activeTab === 'timeline'} on:click={() => activeTab = 'timeline'}>
      ⏱️ 时间线
    </button>
    <button class="tab-btn" class:active={activeTab === 'stats'} on:click={() => activeTab === 'stats'}>
      📊 统计数据
    </button>
  </div>

  <div class="module-layout">
    <section class="input-panel">
      <h2 class="panel-title">路线操作</h2>

      <div class="route-actions">
        <button class="primary-btn" on:click={openAddNodeModal}>➕ 添加节点</button>
        <button class="secondary-btn" on:click={autoEstimateTime}>⚡ 自动估算时间</button>
        <button class="secondary-btn" on:click={openSaveModal}>💾 保存路线方案</button>
      </div>

      <div class="route-stats-mini">
        <div class="stat-item">
          <span class="stat-label">总距离</span>
          <span class="stat-value">{routeStats.totalDistance}km</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">总爬升</span>
          <span class="stat-value">{routeStats.totalElevation}m</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">总时长</span>
          <span class="stat-value">{formatDuration(routeStats.totalTime)}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">节点数</span>
          <span class="stat-value">{routeStats.nodeCount}</span>
        </div>
      </div>

      {#if routeIssues.length > 0}
        <div class="route-issues">
          {#each routeIssues as issue}
            <div class="issue-item" class:error={issue.level === 'error'} class:warning={issue.level === 'warning'}>
              {issue.level === 'error' ? '❌' : issue.level === 'warning' ? '⚠️' : 'ℹ️'} {issue.message}
            </div>
          {/each}
        </div>
      {/if}
    </section>

    <section class="result-panel">
      {#if activeTab === 'nodes'}
        <div class="nodes-list">
          {#each nodes as node, index}
            <div class="node-card" class:start={node.type === 'start'} class:end={node.type === 'end'} class:danger={node.type === 'danger'}>
              <div class="node-header">
                <div class="node-icon" style="background: {nodeTypes.find(t => t.id === node.type)?.color || '#6b7280'}20">
                  {nodeTypes.find(t => t.id === node.type)?.icon}
                </div>
                <div class="node-info">
                  <div class="node-name">{node.name}</div>
                  <div class="node-type">{nodeTypes.find(t => t.id === node.type)?.name}</div>
                </div>
                <div class="node-actions">
                  <button class="icon-btn" on:click={() => moveNodeUp(index)} disabled={index === 0}>▲</button>
                  <button class="icon-btn" on:click={() => moveNodeDown(index)} disabled={index === nodes.length - 1}>▼</button>
                  <button class="icon-btn" on:click={() => openEditNodeModal(node, index)}>✏️</button>
                  <button class="icon-btn danger" on:click={() => removeNode(index)}>🗑️</button>
                </div>
              </div>
              <div class="node-details">
                <div class="detail-item">
                  <span class="detail-icon">📐</span>
                  <span>海拔 {node.altitude}m</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">📏</span>
                  <span>距上站 {node.distanceFromPrev}km</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">📈</span>
                  <span>爬升 {node.elevationGain}m</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">⏱️</span>
                  <span>{formatDuration(node.estimatedTime)}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">{activityTypesAtNode.find(a => a.id === node.activityType)?.icon}</span>
                  <span>{activityTypesAtNode.find(a => a.id === node.activityType)?.name}</span>
                </div>
              </div>
              {#if node.notes}
                <div class="node-notes">📝 {node.notes}</div>
              {/if}
            </div>
          {/each}
        </div>

      {:else if activeTab === 'timeline'}
        <div class="timeline-view">
          <div class="timeline-bar">
            {#each timeline as item}
              <div class="timeline-segment" style="flex: {item.node.estimatedTime || 30}">
                <div class="timeline-node" style="background: {nodeTypes.find(t => t.id === item.node.type)?.color}">
                  {nodeTypes.find(t => t.id === item.node.type)?.icon}
                </div>
                <div class="timeline-label">{item.node.name}</div>
              </div>
            {/each}
          </div>
          <div class="timeline-details">
            {#each timeline as item, i}
              <div class="timeline-item">
                <div class="timeline-time">{formatTime(item.cumulativeTime)}</div>
                <div class="timeline-content">
                  <div class="timeline-name">{item.node.name}</div>
                  <div class="timeline-meta">
                    <span>📏 {item.cumulativeDistance.toFixed(1)}km</span>
                    <span>📈 {item.cumulativeElevation}m</span>
                    <span>📐 {item.node.altitude}m</span>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>

      {:else if activeTab === 'stats'}
        <div class="stats-view">
          <div class="stat-cards">
            <div class="stat-card big">
              <div class="stat-card-icon">📍</div>
              <div class="stat-card-value">{routeStats.nodeCount}</div>
              <div class="stat-card-label">路线节点</div>
            </div>
            <div class="stat-card big">
              <div class="stat-card-icon">📏</div>
              <div class="stat-card-value">{routeStats.totalDistance}<span class="unit">km</span></div>
              <div class="stat-card-label">总距离</div>
            </div>
            <div class="stat-card big">
              <div class="stat-card-icon">📈</div>
              <div class="stat-card-value">{routeStats.totalElevation}<span class="unit">m</span></div>
              <div class="stat-card-label">累计爬升</div>
            </div>
            <div class="stat-card big">
              <div class="stat-card-icon">⏱️</div>
              <div class="stat-card-value">{formatDuration(routeStats.totalTime)}</div>
              <div class="stat-card-label">预计时长</div>
            </div>
          </div>

          <div class="elevation-section">
            <h3>🗻 海拔信息</h3>
            <div class="elevation-info">
              <div class="elev-item">
                <span class="elev-label">最高海拔</span>
                <span class="elev-value">{routeStats.maxAltitude} m</span>
              </div>
              <div class="elev-item">
                <span class="elev-label">最低海拔</span>
                <span class="elev-value">{routeStats.minAltitude} m</span>
              </div>
            </div>
          </div>

          <div class="node-type-section">
            <h3>📊 节点类型统计</h3>
            <div class="node-type-list">
              {#each nodeTypes as type}
                {#if nodes.some(n => n.type === type.id)}
                  <div class="type-item">
                    <span class="type-icon">{type.icon}</span>
                    <span class="type-name">{type.name}</span>
                    <span class="type-count">{nodes.filter(n => n.type === type.id).length}</span>
                  </div>
                {/if}
              {/each}
            </div>
          </div>
        </div>
      {/if}

      <div class="equipment-tips">
        <h3>💡 路线规划建议</h3>
        <ul class="tips-list">
          <li>合理设置节点间距，一般2-5公里一个节点为宜</li>
          <li>在危险路段前设置休息点，评估团队状态</li>
          <li>高海拔路线应设置更多适应和休息节点</li>
          <li>营地选择应考虑水源、避风、安全等因素</li>
          <li>出发前检查各节点之间的可行性和通行条件</li>
        </ul>
      </div>
    </section>
  </div>

  {#if showAddNodeModal}
    <div class="modal-overlay" on:click={() => showAddNodeModal = false}>
      <div class="modal-content" on:click|stopPropagation>
        <h3>{editingNode ? '编辑节点' : '添加节点'}</h3>
        <div class="modal-form">
          <div class="form-group">
            <label class="form-label">节点名称 *</label>
            <input type="text" class="form-input" bind:value={newNode.name} placeholder="输入节点名称" />
          </div>
          <div class="form-group">
            <label class="form-label">节点类型</label>
            <div class="type-selector">
              {#each nodeTypes as type}
                <button
                  class="type-btn"
                  class:active={newNode.type === type.id}
                  on:click={() => newNode.type = type.id}
                >
                  <span class="type-btn-icon">{type.icon}</span>
                  <span>{type.name}</span>
                </button>
              {/each}
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">海拔 (m)</label>
              <input type="number" class="form-input" bind:value={newNode.altitude} />
            </div>
            <div class="form-group">
              <label class="form-label">距上站 (km)</label>
              <input type="number" class="form-input" bind:value={newNode.distanceFromPrev} step="0.5" min="0" />
            </div>
            <div class="form-group">
              <label class="form-label">爬升 (m)</label>
              <input type="number" class="form-input" bind:value={newNode.elevationGain} />
            </div>
            <div class="form-group">
              <label class="form-label">预计用时 (分钟)</label>
              <input type="number" class="form-input" bind:value={newNode.estimatedTime} min="0" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">活动类型</label>
            <select class="form-select" bind:value={newNode.activityType}>
              {#each activityTypesAtNode as act}
                <option value={act.id}>{act.icon} {act.name}</option>
              {/each}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">备注</label>
            <textarea class="form-input" bind:value={newNode.notes} placeholder="添加备注..." rows="2"></textarea>
          </div>
        </div>
        <div class="modal-actions">
          <button class="modal-btn" on:click={() => showAddNodeModal = false}>取消</button>
          <button class="modal-btn primary" on:click={saveNode}>确认</button>
        </div>
      </div>
    </div>
  {/if}

  {#if showSaveModal}
    <div class="modal-overlay" on:click={() => showSaveModal = false}>
      <div class="modal-content" on:click|stopPropagation>
        <h3>保存路线方案</h3>
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
  .route-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .primary-btn {
    width: 100%;
    padding: 0.625rem 1rem;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .primary-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
  }

  .secondary-btn {
    width: 100%;
    padding: 0.5rem 0.75rem;
    background: white;
    color: #475569;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .secondary-btn:hover {
    border-color: #f59e0b;
    color: #f59e0b;
  }

  .route-stats-mini {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .stat-item {
    background: #f8fafc;
    border-radius: 0.5rem;
    padding: 0.5rem;
    text-align: center;
  }

  .stat-label {
    display: block;
    font-size: 0.72rem;
    color: #64748b;
  }

  .stat-value {
    font-size: 1rem;
    font-weight: 700;
    color: #f59e0b;
  }

  .route-issues {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .issue-item {
    padding: 0.5rem 0.75rem;
    background: #f0f9ff;
    border-radius: 0.375rem;
    font-size: 0.82rem;
  }

  .issue-item.warning {
    background: #fffbeb;
  }

  .issue-item.error {
    background: #fef2f2;
  }

  .nodes-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .node-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border-left: 4px solid #6b7280;
  }

  .node-card.start { border-left-color: #22c55e; }
  .node-card.end { border-left-color: #10b981; }
  .node-card.danger { border-left-color: #ef4444; }

  .node-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .node-icon {
    width: 40px;
    height: 40px;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
  }

  .node-info {
    flex: 1;
  }

  .node-name {
    font-weight: 600;
    color: #1e293b;
  }

  .node-type {
    font-size: 0.78rem;
    color: #64748b;
  }

  .node-actions {
    display: flex;
    gap: 0.25rem;
  }

  .icon-btn {
    padding: 0.375rem 0.5rem;
    border: none;
    background: #f1f5f9;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.8rem;
  }

  .icon-btn:hover:not(:disabled) {
    background: #e2e8f0;
  }

  .icon-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .icon-btn.danger:hover {
    background: #fef2f2;
  }

  .node-details {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.82rem;
    color: #475569;
    background: #f8fafc;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
  }

  .node-notes {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid #e2e8f0;
    font-size: 0.82rem;
    color: #64748b;
  }

  .timeline-view {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .timeline-bar {
    display: flex;
    height: 60px;
    background: #f1f5f9;
    border-radius: 0.5rem;
    overflow: hidden;
    margin-bottom: 1.5rem;
  }

  .timeline-segment {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 60px;
    border-right: 1px solid #e2e8f0;
  }

  .timeline-segment:last-child {
    border-right: none;
  }

  .timeline-node {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
  }

  .timeline-label {
    font-size: 0.72rem;
    color: #64748b;
    text-align: center;
  }

  .timeline-details {
    display: flex;
    flex-direction: column;
  }

  .timeline-item {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 1rem;
    padding: 0.75rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .timeline-item:last-child {
    border-bottom: none;
  }

  .timeline-time {
    font-weight: 700;
    color: #f59e0b;
  }

  .timeline-name {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }

  .timeline-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.82rem;
    color: #64748b;
  }

  .stats-view {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .stat-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  .stat-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1rem;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .stat-card.big {
    padding: 1.5rem 1rem;
  }

  .stat-card-icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .stat-card-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #f59e0b;
  }

  .stat-card-value .unit {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 400;
  }

  .stat-card-label {
    font-size: 0.78rem;
    color: #64748b;
    margin-top: 0.25rem;
  }

  .elevation-section, .node-type-section {
    background: white;
    border-radius: 0.75rem;
    padding: 1.25rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .elevation-section h3, .node-type-section h3 {
    font-size: 1rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
  }

  .elevation-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .elev-item {
    background: #f8fafc;
    border-radius: 0.5rem;
    padding: 0.75rem;
    text-align: center;
  }

  .elev-label {
    display: block;
    font-size: 0.78rem;
    color: #64748b;
  }

  .elev-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #f59e0b;
  }

  .node-type-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .type-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #f8fafc;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
  }

  .type-icon {
    font-size: 1.1rem;
  }

  .type-name {
    font-size: 0.85rem;
    color: #475569;
  }

  .type-count {
    background: #f59e0b;
    color: white;
    padding: 0.1rem 0.5rem;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 600;
  }

  .type-selector {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.375rem;
  }

  .type-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 0.25rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;
    font-size: 0.78rem;
    transition: all 0.2s;
  }

  .type-btn:hover {
    border-color: #f59e0b;
  }

  .type-btn.active {
    background: #f59e0b;
    color: white;
    border-color: #f59e0b;
  }

  .type-btn-icon {
    font-size: 1.1rem;
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
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }

  textarea.form-input {
    resize: vertical;
    min-height: 60px;
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
    background: #f59e0b;
    color: white;
    border-color: #f59e0b;
  }

  .modal-btn.primary:hover {
    background: #d97706;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
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

  @media (max-width: 1024px) {
    .stat-cards {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .form-grid {
      grid-template-columns: 1fr;
    }

    .type-selector {
      grid-template-columns: repeat(2, 1fr);
    }

    .stat-cards {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
