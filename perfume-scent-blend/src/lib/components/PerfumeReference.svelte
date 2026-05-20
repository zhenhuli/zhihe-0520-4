<script>
  import { classicPerfumes } from '../data/perfumes.js';

  export let onLoadPerfume;

  let expandedPerfume = null;

  function toggleExpand(perfume) {
    expandedPerfume = expandedPerfume?.id === perfume.id ? null : perfume;
  }

  function getBlendText(blend) {
    const parts = [];
    if (blend.top?.length) parts.push(`前调: ${blend.top.map(b => b.id).join(', ')}`);
    if (blend.middle?.length) parts.push(`中调: ${blend.middle.map(b => b.id).join(', ')}`);
    if (blend.base?.length) parts.push(`后调: ${blend.base.map(b => b.id).join(', ')}`);
    return parts.join(' | ');
  }
</script>

<div class="perfume-reference">
  <div class="header">
    <h3 class="text-xl font-bold text-gray-800">经典香水配方库</h3>
    <p class="text-gray-500 text-sm">点击查看配方详情，加载到调配台进行比对</p>
  </div>

  <div class="perfume-list">
    {#each classicPerfumes as perfume (perfume.id)}
      <div class="perfume-item">
        <div class="perfume-header" on:click={() => toggleExpand(perfume)}>
          <div class="perfume-icon">{perfume.image}</div>
          <div class="perfume-info">
            <div class="perfume-name">{perfume.name}</div>
            <div class="perfume-meta">
              <span class="brand">{perfume.brand}</span>
              <span class="year">{perfume.year}</span>
            </div>
          </div>
          <div class="expand-icon {expandedPerfume?.id === perfume.id ? 'expanded' : ''}">▼</div>
        </div>

        {#if expandedPerfume?.id === perfume.id}
          <div class="perfume-detail">
            <p class="description">{perfume.description}</p>
            <div class="style-tags">
              {#each perfume.style as tag (tag)}
                <span class="style-tag">{tag}</span>
              {/each}
            </div>
            <div class="blend-info">
              <div class="blend-section">
                <h4 class="blend-label">前调</h4>
                <div class="blend-notes">
                  {#each perfume.blend.top as note (note.id)}
                    <span class="blend-note">{note.id} ({note.ratio}%)</span>
                  {/each}
                </div>
              </div>
              <div class="blend-section">
                <h4 class="blend-label">中调</h4>
                <div class="blend-notes">
                  {#each perfume.blend.middle as note (note.id)}
                    <span class="blend-note">{note.id} ({note.ratio}%)</span>
                  {/each}
                </div>
              </div>
              <div class="blend-section">
                <h4 class="blend-label">后调</h4>
                <div class="blend-notes">
                  {#each perfume.blend.base as note (note.id)}
                    <span class="blend-note">{note.id} ({note.ratio}%)</span>
                  {/each}
                </div>
              </div>
            </div>
            <button class="load-btn" on:click={() => onLoadPerfume(perfume)}>
              加载此配方
            </button>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .perfume-reference {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .header {
    margin-bottom: 20px;
  }

  .perfume-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 600px;
    overflow-y: auto;
  }

  .perfume-item {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s ease;
  }

  .perfume-item:hover {
    border-color: #c4b5fd;
  }

  .perfume-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    cursor: pointer;
    background: #fafafa;
    transition: background 0.2s ease;
  }

  .perfume-header:hover {
    background: #f5f3ff;
  }

  .perfume-icon {
    font-size: 32px;
  }

  .perfume-info {
    flex: 1;
  }

  .perfume-name {
    font-weight: 600;
    font-size: 15px;
    color: #1f2937;
  }

  .perfume-meta {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-top: 2px;
  }

  .brand {
    font-size: 12px;
    color: #6b7280;
  }

  .year {
    font-size: 11px;
    color: #9ca3af;
    background: #f3f4f6;
    padding: 1px 6px;
    border-radius: 4px;
  }

  .expand-icon {
    color: #9ca3af;
    font-size: 12px;
    transition: transform 0.3s ease;
  }

  .expand-icon.expanded {
    transform: rotate(180deg);
  }

  .perfume-detail {
    padding: 16px;
    border-top: 1px solid #e5e7eb;
    background: white;
  }

  .description {
    color: #4b5563;
    font-size: 13px;
    line-height: 1.6;
    margin-bottom: 12px;
  }

  .style-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 16px;
  }

  .style-tag {
    padding: 3px 10px;
    background: #ede9fe;
    color: #7c3aed;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
  }

  .blend-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 16px;
  }

  .blend-section {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .blend-label {
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    min-width: 40px;
    padding-top: 2px;
  }

  .blend-notes {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .blend-note {
    padding: 2px 8px;
    background: #f3f4f6;
    border-radius: 6px;
    font-size: 11px;
    color: #374151;
  }

  .load-btn {
    width: 100%;
    padding: 10px;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .load-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }
</style>
