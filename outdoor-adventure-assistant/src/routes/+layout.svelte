<script>
  import '../app.css';
  export const prerender = true;
</script>

<svelte:head>
  <title>户外探险助手</title>
</svelte:head>

<div class="app-shell">
  <nav class="top-nav">
    <div class="nav-container">
      <a href="/" class="nav-brand">
        <span class="brand-icon">🏔️</span>
        <span class="brand-text">户外探险助手</span>
      </a>
      <div class="nav-links">
        <a href="/" class="nav-link">首页</a>
        <a href="/risk-assessment" class="nav-link">风险评估</a>
        <a href="/fitness-calc" class="nav-link">体能测算</a>
        <a href="/equipment" class="nav-link">装备推荐</a>
        <div class="nav-dropdown">
          <span class="nav-link dropdown-toggle">更多功能 ▼</span>
          <div class="dropdown-menu">
            <a href="/trip-archive" class="dropdown-item">📦 方案存档</a>
            <a href="/trip-compare" class="dropdown-item">📊 历史对比</a>
            <a href="/risk-report" class="dropdown-item">📋 风险报告</a>
            <a href="/emergency-plan" class="dropdown-item">🚨 紧急预案</a>
          </div>
        </div>
        <div class="nav-dropdown">
          <span class="nav-link dropdown-toggle">团队模式 ▼</span>
          <div class="dropdown-menu">
            <a href="/team-mode" class="dropdown-item">👥 团队出行</a>
            <a href="/load-distribution" class="dropdown-item">⚖️ 负荷分配</a>
            <a href="/route-planner" class="dropdown-item">🗺️ 路线节点</a>
            <a href="/trip-plan-export" class="dropdown-item">📋 计划书导出</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <main class="main-content">
    <slot />
  </main>
  <footer class="app-footer">
    <p>⚠️ 本工具仅供参考，实际户外出行请以专业指导和实际情况为准</p>
  </footer>
</div>

<style>
  .nav-dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-toggle {
    cursor: pointer;
    user-select: none;
  }

  .dropdown-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 180px;
    z-index: 1000;
    padding: 0.5rem 0;
  }

  .nav-dropdown:hover .dropdown-menu {
    display: block;
  }

  .dropdown-item {
    display: block;
    padding: 0.75rem 1rem;
    color: #475569;
    text-decoration: none;
    font-size: 0.875rem;
    transition: background 0.2s;
  }

  .dropdown-item:hover {
    background: #f1f5f9;
    color: #1e293b;
  }
</style>