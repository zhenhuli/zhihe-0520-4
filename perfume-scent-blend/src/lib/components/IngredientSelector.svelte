<script>
  import { ingredients, noteFamilies } from '../data/ingredients.js';

  export let noteType;
  export let selected = [];
  export let onSelect;
  export let onRemove;

  const config = {
    top: { label: '前调', description: '持续15分钟-2小时，第一印象', color: 'from-yellow-400 to-orange-400' },
    middle: { label: '中调', description: '持续2-6小时，香水的灵魂', color: 'from-pink-400 to-purple-400' },
    base: { label: '后调', description: '持续6-12小时，定香与余韵', color: 'from-amber-600 to-amber-800' }
  };

  const currentConfig = config[noteType];
  const ingredientsList = ingredients[noteType];

  function toggleIngredient(ing) {
    if (selected.some(item => item.id === ing.id)) {
      onRemove(ing.id);
    } else {
      onSelect(ing);
    }
  }

  let searchQuery = '';
  $: filteredIngredients = ingredientsList.filter(ing => 
    ing.name.includes(searchQuery) || ing.family.includes(searchQuery)
  );

  $: selectedIds = new Set(selected.map(item => item.id));
</script>

<div class="selector-container">
  <div class="header bg-gradient-to-r {currentConfig.color}">
    <h3 class="text-xl font-bold text-white">{currentConfig.label}</h3>
    <p class="text-white/80 text-sm">{currentConfig.description}</p>
  </div>
  
  <div class="search-box">
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="搜索香材..."
      class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
    />
  </div>

  <div class="ingredients-grid">
    {#each filteredIngredients as ing (ing.id)}
      <button
        class="ingredient-card {selectedIds.has(ing.id) ? 'selected' : ''}"
        style="border-left-color: {ing.color}"
        on:click={() => toggleIngredient(ing)}
      >
        <div class="ingredient-color" style="background: {ing.color}"></div>
        <div class="ingredient-info">
          <span class="ingredient-name">{ing.name}</span>
          <span class="ingredient-family" style="color: {noteFamilies[ing.family]?.color || '#666'}">{ing.family}</span>
        </div>
        {#if selectedIds.has(ing.id)}
          <span class="check-icon">✓</span>
        {/if}
      </button>
    {/each}
  </div>
</div>

<style>
  .selector-container {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .header {
    padding: 20px;
  }

  .search-box {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  .ingredients-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
    padding: 16px;
    max-height: 280px;
    overflow-y: auto;
  }

  .ingredient-card {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border: 1px solid #e5e7eb;
    border-left-width: 4px;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }

  .ingredient-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .ingredient-card.selected {
    background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
    border-color: #8b5cf6;
    border-left-width: 4px;
  }

  .ingredient-color {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .ingredient-info {
    flex: 1;
    min-width: 0;
  }

  .ingredient-name {
    display: block;
    font-weight: 600;
    font-size: 13px;
    color: #1f2937;
  }

  .ingredient-family {
    display: block;
    font-size: 11px;
    color: #6b7280;
  }

  .check-icon {
    color: #8b5cf6;
    font-weight: bold;
    font-size: 16px;
  }
</style>
