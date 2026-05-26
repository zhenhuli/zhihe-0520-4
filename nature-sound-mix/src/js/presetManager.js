class PresetManager {
  constructor() {
    this.storageKey = 'nature-sound-presets';
    this.presets = this.loadPresets();
  }

  loadPresets() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('加载预设失败:', e);
    }
    return this.getDefaultPresets();
  }

  getDefaultPresets() {
    return [
      {
        id: 'rainy-day',
        name: '雨天',
        sounds: {
          rain: { volume: 0.6, rhythm: 0.8 },
          thunder: { volume: 0.2, rhythm: 0.5 }
        }
      },
      {
        id: 'forest-morning',
        name: '森林清晨',
        sounds: {
          birds: { volume: 0.5, rhythm: 1.2 },
          wind: { volume: 0.3, rhythm: 0.6 },
          stream: { volume: 0.4, rhythm: 0.8 }
        }
      },
      {
        id: 'campfire-night',
        name: '篝火之夜',
        sounds: {
          fire: { volume: 0.5, rhythm: 1.0 },
          wind: { volume: 0.2, rhythm: 0.5 }
        }
      }
    ];
  }

  savePresets() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.presets));
    } catch (e) {
      console.error('保存预设失败:', e);
    }
  }

  addPreset(name, soundStates) {
    const id = 'preset-' + Date.now();
    const preset = {
      id,
      name,
      sounds: {}
    };

    Object.entries(soundStates).forEach(([soundId, state]) => {
      preset.sounds[soundId] = {
        volume: state.volume,
        rhythm: state.rhythm
      };
    });

    this.presets.push(preset);
    this.savePresets();
    return preset;
  }

  deletePreset(id) {
    this.presets = this.presets.filter(p => p.id !== id);
    this.savePresets();
  }

  getPreset(id) {
    return this.presets.find(p => p.id === id);
  }

  getAllPresets() {
    return this.presets;
  }
}

export default new PresetManager();
