<script>
  import { activityTypes } from '../lib/data/activityTypes.js';
  export const prerender = true;

  const modules = [
    {
      id: 'risk',
      title: '综合风险评估',
      icon: '⚠️',
      description: '多维度风险评估、路线难度评级、天气风险叠加分析，智能生成综合风险等级与应对建议',
      features: ['基础风险', '路线难度评级', '天气风险叠加', '经验匹配', '应急预案'],
      route: '/risk-assessment',
      color: '#ef4444'
    },
    {
      id: 'fitness',
      title: '体能与营养规划',
      icon: '🔥',
      description: '精准计算热量消耗、饮水需求、食物配比，生成完整补给方案与体能指数评估',
      features: ['热量消耗', '饮水计划', '食物配比', '电解质补充', '体能评估'],
      route: '/fitness-calc',
      color: '#f97316'
    },
    {
      id: 'equipment',
      title: '装备与负重管理',
      icon: '🎒',
      description: '智能推荐装备清单、负重测算分析、轻量化建议，按类别分类展示',
      features: ['装备推荐', '负重分析', '重量分布', '轻量化建议', '必备/可选'],
      route: '/equipment',
      color: '#3b82f6'
    }
  ];

  const advancedModules = [
    {
      id: 'archive',
      title: '出行方案存档',
      icon: '📦',
      description: '保存和管理你的出行方案，支持收藏、标签分类、导入导出，随时查阅历史方案',
      features: ['方案存档', '收藏管理', '标签分类', '数据导入', '数据导出'],
      route: '/trip-archive',
      color: '#8b5cf6'
    },
    {
      id: 'compare',
      title: '历史出行对比',
      icon: '📊',
      description: '对比分析多次出行数据，发现进步空间，优化装备和体能配置',
      features: ['多方案对比', '数据可视化', '进步分析', '配置优化', '趋势统计'],
      route: '/trip-compare',
      color: '#06b6d4'
    },
    {
      id: 'report',
      title: '风险报告生成',
      icon: '📋',
      description: '生成专业的风险评估报告，包含详细分析、建议措施、装备清单，支持导出',
      features: ['专业报告', '详细分析', '建议措施', '装备清单', '导出分享'],
      route: '/risk-report',
      color: '#10b981'
    },
    {
      id: 'emergency',
      title: '紧急预案推荐',
      icon: '🚨',
      description: '针对常见户外紧急情况提供专业处理流程，急救装备清单，应急联系方式',
      features: ['紧急应对', '处理流程', '急救清单', '联系方式', '预防措施'],
      route: '/emergency-plan',
      color: '#dc2626'
    }
  ];

  const teamModules = [
    {
      id: 'team',
      title: '团队出行模式',
      icon: '👥',
      description: '组建团队、分配角色、评估队员能力，支持多成员管理和角色职责分配',
      features: ['团队组建', '角色分配', '能力评估', '队员管理', '团队统计'],
      route: '/team-mode',
      color: '#8b5cf6'
    },
    {
      id: 'load',
      title: '多人负荷分配',
      icon: '⚖️',
      description: '根据队员角色和体能智能分配装备重量，平衡团队负重，优化利用率',
      features: ['智能分配', '负重平衡', '角色匹配', '利用率分析', '分配建议'],
      route: '/load-distribution',
      color: '#06b6d4'
    },
    {
      id: 'route',
      title: '路线节点规划',
      icon: '🗺️',
      description: '详细规划路线节点、时间、海拔、活动类型，生成完整路线时间线和统计数据',
      features: ['节点规划', '时间估算', '海拔统计', '路线评估', '时间线'],
      route: '/route-planner',
      color: '#f59e0b'
    },
    {
      id: 'export',
      title: '出行计划书导出',
      icon: '📋',
      description: '汇总所有模块数据，生成完整出行计划书，支持TXT和JSON格式导出',
      features: ['数据汇总', '完整计划书', 'TXT导出', 'JSON导出', '剪贴板复制'],
      route: '/trip-plan-export',
      color: '#10b981'
    }
  ];
</script>

<div class="home">
  <section class="hero">
    <div class="hero-bg"></div>
    <div class="hero-content">
      <h1 class="hero-title">
        <span class="hero-icon">🏔️</span>
        户外探险一体化助手
      </h1>
      <p class="hero-subtitle">
        面向登山、露营、徒步、野外探险人群
        <br />
        风险评估 · 体能测算 · 装备推荐 · 一站式解决方案
      </p>
      <div class="hero-activities">
        {#each activityTypes as activity}
          <div class="activity-tag">
            <span class="activity-icon">{activity.icon}</span>
            <span>{activity.name}</span>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section class="modules-section">
    <h2 class="section-title">核心功能</h2>
    <div class="modules-grid">
      {#each modules as mod}
        <a href={mod.route} class="module-card" style="--card-color: {mod.color}">
          <div class="module-icon" style="background: {mod.color}20">{mod.icon}</div>
          <h3 class="module-title">{mod.title}</h3>
          <p class="module-desc">{mod.description}</p>
          <div class="module-features">
            {#each mod.features as feat}
              <span class="feature-tag">{feat}</span>
            {/each}
          </div>
          <div class="module-arrow">→</div>
        </a>
      {/each}
    </div>
  </section>

  <section class="modules-section advanced-section">
    <h2 class="section-title">高级功能</h2>
    <div class="modules-grid advanced-grid">
      {#each advancedModules as mod}
        <a href={mod.route} class="module-card" style="--card-color: {mod.color}">
          <div class="module-icon" style="background: {mod.color}20">{mod.icon}</div>
          <h3 class="module-title">{mod.title}</h3>
          <p class="module-desc">{mod.description}</p>
          <div class="module-features">
            {#each mod.features as feat}
              <span class="feature-tag">{feat}</span>
            {/each}
          </div>
          <div class="module-arrow">→</div>
        </a>
      {/each}
    </div>
  </section>

  <section class="modules-section team-section">
    <h2 class="section-title">团队出行模式</h2>
    <div class="modules-grid team-grid">
      {#each teamModules as mod}
        <a href={mod.route} class="module-card" style="--card-color: {mod.color}">
          <div class="module-icon" style="background: {mod.color}20">{mod.icon}</div>
          <h3 class="module-title">{mod.title}</h3>
          <p class="module-desc">{mod.description}</p>
          <div class="module-features">
            {#each mod.features as feat}
              <span class="feature-tag">{feat}</span>
            {/each}
          </div>
          <div class="module-arrow">→</div>
        </a>
      {/each}
    </div>
  </section>

  <section class="info-section">
    <div class="info-grid">
      <div class="info-card">
        <div class="info-icon">📊</div>
        <h3>科学算法</h3>
        <p>基于户外行业标准与实际经验数据，确保评估结果专业可靠</p>
      </div>
      <div class="info-card">
        <div class="info-icon">🛡️</div>
        <h3>安全优先</h3>
        <p>从风险预警到装备建议，始终将安全作为第一考量标准</p>
      </div>
      <div class="info-card">
        <div class="info-icon">⚡</div>
        <h3>高效便捷</h3>
        <p>输入关键参数即可获得完整方案，节省规划时间</p>
      </div>
    </div>
  </section>
</div>