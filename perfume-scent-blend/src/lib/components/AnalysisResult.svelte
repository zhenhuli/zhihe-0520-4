<script>
  import { noteFamilies } from '../data/ingredients.js';

  export let analysis;
  export let onLoadPerfume;

  $: styleText = analysis?.style?.map(s => s.name).join(' · ') || '';
</script>

{#if analysis}
  <div class="analysis-result">
    <div class="header">
      <div class="title-section">
        <h2 class="text-2xl font-bold text-gray-800">香气分析结果</h2>
        <p class="text-purple-600 font-medium mt-1">{styleText}</p>
      </div>
      <div class="color-palette">
        {#each analysis.colorPalette as color (color)}
          <div class="color-dot" style="background: {color}"></div>
        {/each}
      </div>
    </div>

    <div class="keywords-section">
      <h3 class="section-title">关键词</h3>
      <div class="keywords">
        {#each analysis.keywords as keyword (keyword)}
          <span class="keyword-tag">{keyword}</span>
        {/each}
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">{analysis.season.icon}</div>
        <div class="stat-info">
          <span class="stat-label">适合季节</span>
          <span class="stat-value">{analysis.season.name}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">{analysis.timeOfDay.icon}</div>
        <div class="stat-info">
          <span class="stat-label">使用时间</span>
          <span class="stat-value">{analysis.timeOfDay.name}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">👤</div>
        <div class="stat-info">
          <span class="stat-label">性别倾向</span>
          <span class="stat-value">{analysis.gender.name}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⏱️</div>
        <div class="stat-info">
          <span class="stat-label">持久度</span>
          <span class="stat-value">{analysis.longevity.level} ({analysis.longevity.value}h)</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💨</div>
        <div class="stat-info">
          <span class="stat-label">扩散力</span>
          <span class="stat-value">{analysis.sillage.level}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">香调构成</h3>
      <div class="family-chart">
        {#each analysis.dominantFamilies as item (item.family)}
          <div class="family-row">
            <div class="family-info">
              <div class="family-color" style="background: {noteFamilies[item.family]?.color || '#888'}"></div>
              <span class="family-name">{item.family}</span>
            </div>
            <div class="family-bar-bg">
              <div class="family-bar" style="width: {item.percentage}%; background: {noteFamilies[item.family]?.color || '#888'}"></div>
            </div>
            <span class="family-percent">{item.percentage}%</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">详细分析</h3>
      <p class="text-gray-600 text-sm leading-relaxed">
        {analysis.longevity.description}
        <br/>
        {analysis.sillage.description}
        <br/>
        {analysis.gender.description}，{analysis.timeOfDay.description}，最适合在{analysis.season.name}使用。
      </p>
    </div>

    {#if analysis.similarPerfumes && analysis.similarPerfumes.length > 0}
      <div class="section">
        <h3 class="section-title">相似香水推荐</h3>
        <div class="similar-perfumes">
          {#each analysis.similarPerfumes as perfume (perfume.id)}
            <div class="perfume-card" on:click={() => onLoadPerfume(perfume)}>
              <div class="perfume-emoji">{perfume.image}</div>
              <div class="perfume-info">
                <div class="perfume-name">{perfume.name}</div>
                <div class="perfume-brand">{perfume.brand}</div>
              </div>
              <div class="similarity-badge">
                <span class="similarity-value">{perfume.similarity}%</span>
                <span class="similarity-label">相似</span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
{:else}
  <div class="empty-state">
    <div class="empty-icon">🌸</div>
    <h3 class="empty-title">开始调配你的专属香水</h3>
    <p class="empty-desc">选择前调、中调、后调的香材，调整配比，系统将为你分析香气风格</p>
  </div>
{/if}

<style>
  .analysis-result {
    background: white;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .color-palette {
    display: flex;
    gap: 6px;
  }

  .color-dot {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .section {
    margin-top: 24px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 12px;
  }

  .keywords-section {
    margin-bottom: 20px;
  }

  .keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .keyword-tag {
    padding: 6px 14px;
    background: linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%);
    color: #7c3aed;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    background: #f9fafb;
    border-radius: 12px;
  }

  .stat-icon {
    font-size: 28px;
  }

  .stat-info {
    display: flex;
    flex-direction: column;
  }

  .stat-label {
    font-size: 11px;
    color: #6b7280;
  }

  .stat-value {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
  }

  .family-chart {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .family-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .family-info {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 80px;
    flex-shrink: 0;
  }

  .family-color {
    width: 14px;
    height: 14px;
    border-radius: 4px;
  }

  .family-name {
    font-size: 13px;
    font-weight: 500;
    color: #374151;
  }

  .family-bar-bg {
    flex: 1;
    height: 10px;
    background: #f3f4f6;
    border-radius: 5px;
    overflow: hidden;
  }

  .family-bar {
    height: 100%;
    border-radius: 5px;
    transition: width 0.5s ease;
  }

  .family-percent {
    width: 45px;
    text-align: right;
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
  }

  .similar-perfumes {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .perfume-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px;
    background: #f9fafb;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .perfume-card:hover {
    background: #f3f4f6;
    transform: translateX(4px);
  }

  .perfume-emoji {
    font-size: 32px;
  }

  .perfume-info {
    flex: 1;
  }

  .perfume-name {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
  }

  .perfume-brand {
    font-size: 12px;
    color: #6b7280;
  }

  .similarity-badge {
    text-align: center;
    padding: 6px 12px;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    border-radius: 8px;
  }

  .similarity-value {
    display: block;
    color: white;
    font-weight: 700;
    font-size: 14px;
  }

  .similarity-label {
    display: block;
    color: rgba(255, 255, 255, 0.8);
    font-size: 10px;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  }

  .empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
  }

  .empty-title {
    font-size: 20px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 8px;
  }

  .empty-desc {
    color: #6b7280;
    font-size: 14px;
    max-width: 320px;
    margin: 0 auto;
    line-height: 1.6;
  }
</style>
