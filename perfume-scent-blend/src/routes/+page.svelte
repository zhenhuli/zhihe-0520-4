<script>
  import IngredientSelector from '../lib/components/IngredientSelector.svelte';
  import BlendControls from '../lib/components/BlendControls.svelte';
  import AnalysisResult from '../lib/components/AnalysisResult.svelte';
  import PerfumeReference from '../lib/components/PerfumeReference.svelte';
  import { analyzeBlend, getIngredientById } from '../lib/utils/perfumeAnalyzer.js';
  import { ingredients } from '../lib/data/ingredients.js';

  let selectedTop = [];
  let selectedMiddle = [];
  let selectedBase = [];
  let activeTab = 'blend';

  function handleSelect(noteType, ing) {
    const defaultRatio = noteType === 'top' ? 25 : noteType === 'middle' ? 33 : 20;
    const target = noteType === 'top' ? selectedTop : noteType === 'middle' ? selectedMiddle : selectedBase;
    target.push({
      id: ing.id,
      name: ing.name,
      family: ing.family,
      color: ing.color,
      ratio: defaultRatio
    });
    selectedTop = selectedTop;
    selectedMiddle = selectedMiddle;
    selectedBase = selectedBase;
  }

  function handleRemove(noteType, id) {
    if (noteType === 'top') {
      selectedTop = selectedTop.filter(item => item.id !== id);
    } else if (noteType === 'middle') {
      selectedMiddle = selectedMiddle.filter(item => item.id !== id);
    } else {
      selectedBase = selectedBase.filter(item => item.id !== id);
    }
  }

  function handleUpdateRatio(noteType, id, value) {
    const target = noteType === 'top' ? selectedTop : noteType === 'middle' ? selectedMiddle : selectedBase;
    const item = target.find(i => i.id === id);
    if (item) {
      item.ratio = Math.max(0, Math.min(100, value || 0));
    }
    selectedTop = selectedTop;
    selectedMiddle = selectedMiddle;
    selectedBase = selectedBase;
  }

  function handleLoadPerfume(perfume) {
    const convertBlend = (blendItems) => {
      return blendItems.map(item => {
        const ing = getIngredientById(item.id);
        if (ing) {
          return {
            id: ing.id,
            name: ing.name,
            family: ing.family,
            color: ing.color,
            ratio: item.ratio
          };
        }
        return null;
      }).filter(Boolean);
    };

    selectedTop = convertBlend(perfume.blend.top || []);
    selectedMiddle = convertBlend(perfume.blend.middle || []);
    selectedBase = convertBlend(perfume.blend.base || []);
    activeTab = 'blend';
  }

  function resetBlend() {
    selectedTop = [];
    selectedMiddle = [];
    selectedBase = [];
  }

  function randomBlend() {
    const randomPick = (arr, count) => {
      const shuffled = [...arr].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count).map(ing => ({
        id: ing.id,
        name: ing.name,
        family: ing.family,
        color: ing.color,
        ratio: Math.round(100 / count)
      }));
    };

    selectedTop = randomPick(ingredients.top, Math.floor(Math.random() * 3) + 2);
    selectedMiddle = randomPick(ingredients.middle, Math.floor(Math.random() * 3) + 2);
    selectedBase = randomPick(ingredients.base, Math.floor(Math.random() * 3) + 2);
  }

  $: blend = {
    top: selectedTop,
    middle: selectedMiddle,
    base: selectedBase
  };

  $: hasIngredients = selectedTop.length > 0 || selectedMiddle.length > 0 || selectedBase.length > 0;

  $: analysis = hasIngredients ? analyzeBlend(blend) : null;
</script>

<div class="app-container">
  <header class="app-header">
    <div class="header-content">
      <div class="logo-section">
        <span class="logo-icon">🌸</span>
        <div>
          <h1 class="app-title">香调原料调配模拟器</h1>
          <p class="app-subtitle">探索专属于你的香气世界</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="action-btn secondary" on:click={randomBlend}>
          🎲 随机调配
        </button>
        <button class="action-btn danger" on:click={resetBlend} disabled={!hasIngredients}>
          🗑️ 清空
        </button>
      </div>
    </div>
  </header>

  <div class="tabs">
    <button class="tab-btn {activeTab === 'blend' ? 'active' : ''}" on:click={() => activeTab = 'blend'}>
      🧪 调配台
    </button>
    <button class="tab-btn {activeTab === 'reference' ? 'active' : ''}" on:click={() => activeTab = 'reference'}>
      📚 经典配方
    </button>
  </div>

  <main class="main-content">
    {#if activeTab === 'blend'}
      <div class="blend-layout">
        <div class="selectors-section">
          <div class="selector-column">
            <IngredientSelector
              noteType="top"
              selected={selectedTop}
              onSelect={(ing) => handleSelect('top', ing)}
              onRemove={(id) => handleRemove('top', id)}
            />
            <BlendControls
              noteType="top"
              selected={selectedTop}
              onUpdateRatio={(id, val) => handleUpdateRatio('top', id, val)}
              onRemove={(id) => handleRemove('top', id)}
            />
          </div>

          <div class="selector-column">
            <IngredientSelector
              noteType="middle"
              selected={selectedMiddle}
              onSelect={(ing) => handleSelect('middle', ing)}
              onRemove={(id) => handleRemove('middle', id)}
            />
            <BlendControls
              noteType="middle"
              selected={selectedMiddle}
              onUpdateRatio={(id, val) => handleUpdateRatio('middle', id, val)}
              onRemove={(id) => handleRemove('middle', id)}
            />
          </div>

          <div class="selector-column">
            <IngredientSelector
              noteType="base"
              selected={selectedBase}
              onSelect={(ing) => handleSelect('base', ing)}
              onRemove={(id) => handleRemove('base', id)}
            />
            <BlendControls
              noteType="base"
              selected={selectedBase}
              onUpdateRatio={(id, val) => handleUpdateRatio('base', id, val)}
              onRemove={(id) => handleRemove('base', id)}
            />
          </div>
        </div>

        <div class="analysis-section">
          <AnalysisResult {analysis} onLoadPerfume={handleLoadPerfume} />
        </div>
      </div>
    {:else}
      <div class="reference-layout">
        <PerfumeReference onLoadPerfume={handleLoadPerfume} />
      </div>
    {/if}
  </main>
</div>

<style>
  .app-container {
    min-height: 100vh;
  }

  .app-header {
    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%);
    padding: 20px 32px;
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
  }

  .header-content {
    max-width: 1600px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo-section {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .logo-icon {
    font-size: 48px;
  }

  .app-title {
    font-size: 28px;
    font-weight: 800;
    color: white;
    letter-spacing: 1px;
  }

  .app-subtitle {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    margin-top: 2px;
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }

  .action-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .action-btn.secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    backdrop-filter: blur(10px);
  }

  .action-btn.secondary:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  .action-btn.danger {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    backdrop-filter: blur(10px);
  }

  .action-btn.danger:hover:not(:disabled) {
    background: rgba(254, 226, 226, 0.9);
    color: #dc2626;
  }

  .action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tabs {
    display: flex;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #e5e7eb;
  }

  .tab-btn {
    padding: 10px 24px;
    border: none;
    border-radius: 10px;
    background: transparent;
    color: #6b7280;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .tab-btn:hover {
    background: #f3f4f6;
  }

  .tab-btn.active {
    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }

  .main-content {
    max-width: 1600px;
    margin: 0 auto;
    padding: 24px 32px;
  }

  .blend-layout {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 24px;
    align-items: start;
  }

  .selectors-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .selector-column {
    display: flex;
    flex-direction: column;
  }

  .analysis-section {
    position: sticky;
    top: 24px;
  }

  .reference-layout {
    max-width: 800px;
    margin: 0 auto;
  }

  @media (max-width: 1200px) {
    .blend-layout {
      grid-template-columns: 1fr;
    }

    .analysis-section {
      position: static;
    }
  }

  @media (max-width: 768px) {
    .app-header {
      padding: 16px;
    }

    .header-content {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }

    .app-title {
      font-size: 22px;
    }

    .main-content {
      padding: 16px;
    }

    .tabs {
      padding: 12px;
    }

    .tab-btn {
      padding: 8px 16px;
      font-size: 13px;
    }
  }
</style>
