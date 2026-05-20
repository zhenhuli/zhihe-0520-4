<script>
  import { noteFamilies } from '../data/ingredients.js';

  export let noteType;
  export let selected = [];
  export let onUpdateRatio;
  export let onRemove;

  const config = {
    top: { label: '前调', color: '#fbbf24' },
    middle: { label: '中调', color: '#ec4899' },
    base: { label: '后调', color: '#92400e' }
  };

  const currentConfig = config[noteType];

  $: totalRatio = selected.reduce((sum, item) => sum + item.ratio, 0);

  function updateRatio(id, event) {
    const value = parseInt(event.target.value);
    onUpdateRatio(id, value);
  }

  function normalizeRatios() {
    if (selected.length === 0) return;
    const currentTotal = selected.reduce((sum, item) => sum + item.ratio, 0);
    if (currentTotal === 0) {
      const evenRatio = Math.round(100 / selected.length);
      selected.forEach((item, index) => {
        const ratio = index === selected.length - 1 ? 100 - evenRatio * (selected.length - 1) : evenRatio;
        onUpdateRatio(item.id, ratio);
      });
    } else {
      selected.forEach(item => {
        const normalized = Math.round((item.ratio / currentTotal) * 100);
        onUpdateRatio(item.id, normalized);
      });
    }
  }
</script>

{#if selected.length > 0}
  <div class="blend-controls">
    <div class="header">
      <h4 class="font-bold text-gray-800">{currentConfig.label}配比</h4>
      <div class="total-ratio {totalRatio > 100 ? 'over' : totalRatio < 100 ? 'under' : 'ok'}">
        {totalRatio}%
      </div>
    </div>

    <div class="ratio-bar">
      {#each selected as item (item.id)}
        <div 
          class="ratio-segment"
          style="width: {Math.max(item.ratio, 2)}%; background: {item.color}"
          title="{item.name}: {item.ratio}%"
        />
      {/each}
    </div>

    <div class="ingredients-list">
      {#each selected as item (item.id)}
        <div class="ingredient-row">
          <div class="ingredient-header">
            <div class="ingredient-color" style="background: {item.color}"></div>
            <div class="ingredient-info">
              <span class="name">{item.name}</span>
              <span class="family" style="color: {noteFamilies[item.family]?.color || '#666'}">{item.family}</span>
            </div>
            <button class="remove-btn" on:click={() => onRemove(item.id)}>×</button>
          </div>
          <div class="slider-container">
            <input
              type="range"
              min="0"
              max="100"
              value={item.ratio}
              on:input={(e) => updateRatio(item.id, e)}
              class="slider"
              style="--slider-color: {item.color}"
            />
            <div class="ratio-input">
              <input
                type="number"
                min="0"
                max="100"
                value={item.ratio}
                on:input={(e) => updateRatio(item.id, e)}
              />
              <span>%</span>
            </div>
          </div>
        </div>
      {/each}
    </div>

    {#if totalRatio !== 100}
      <button class="normalize-btn" on:click={normalizeRatios}>
        自动归一化到100%
      </button>
    {/if}
  </div>
{/if}

<style>
  .blend-controls {
    background: #fafafa;
    border-radius: 12px;
    padding: 16px;
    margin-top: 12px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .total-ratio {
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 14px;
  }

  .total-ratio.ok {
    background: #dcfce7;
    color: #166534;
  }

  .total-ratio.over {
    background: #fee2e2;
    color: #991b1b;
  }

  .total-ratio.under {
    background: #fef3c7;
    color: #92400e;
  }

  .ratio-bar {
    display: flex;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    background: #e5e7eb;
    margin-bottom: 16px;
  }

  .ratio-segment {
    height: 100%;
    transition: width 0.3s ease;
  }

  .ingredients-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .ingredient-row {
    background: white;
    padding: 12px;
    border-radius: 8px;
  }

  .ingredient-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  .ingredient-color {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .ingredient-info {
    flex: 1;
  }

  .name {
    display: block;
    font-weight: 600;
    font-size: 14px;
    color: #1f2937;
  }

  .family {
    font-size: 12px;
  }

  .remove-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: #fee2e2;
    color: #991b1b;
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
    transition: all 0.2s;
  }

  .remove-btn:hover {
    background: #fecaca;
  }

  .slider-container {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .slider {
    flex: 1;
    height: 6px;
    border-radius: 3px;
    background: #e5e7eb;
    outline: none;
    -webkit-appearance: none;
    cursor: pointer;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--slider-color, #8b5cf6);
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s;
  }

  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  .ratio-input {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .ratio-input input {
    width: 50px;
    padding: 4px 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
  }

  .ratio-input span {
    color: #6b7280;
    font-size: 14px;
  }

  .normalize-btn {
    width: 100%;
    margin-top: 12px;
    padding: 10px;
    background: #8b5cf6;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .normalize-btn:hover {
    background: #7c3aed;
  }
</style>
