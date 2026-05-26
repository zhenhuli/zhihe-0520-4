import '../css/style.css';
import audioEngine from './audioEngine.js';
import { soundTypes } from './soundGenerators.js';
import presetManager from './presetManager.js';

class NatureSoundApp {
  constructor() {
    this.sounds = {};
    this.soundStates = {};
    this.init();
  }

  init() {
    this.initSounds();
    this.renderSoundCards();
    this.renderPresets();
    this.bindEvents();
  }

  initSounds() {
    Object.entries(soundTypes).forEach(([id, { name, icon, class: SoundClass }]) => {
      this.sounds[id] = new SoundClass(id);
      this.soundStates[id] = {
        name,
        icon,
        volume: 0.5,
        rhythm: 1,
        isPlaying: false
      };
    });
  }

  renderSoundCards() {
    const grid = document.getElementById('soundGrid');
    grid.innerHTML = '';

    Object.entries(this.soundStates).forEach(([id, state]) => {
      const card = this.createSoundCard(id, state);
      grid.appendChild(card);
    });
  }

  createSoundCard(id, state) {
    const card = document.createElement('div');
    card.className = `sound-card ${state.isPlaying ? 'active' : ''}`;
    card.dataset.soundId = id;

    card.innerHTML = `
      <div class="sound-header">
        <span class="sound-icon">${state.icon}</span>
        <span class="sound-title">${state.name}</span>
        <span class="sound-status"></span>
      </div>
      <div class="sound-controls">
        <div class="control-group">
          <label>音量</label>
          <input type="range" class="volume-slider" min="0" max="100" value="${state.volume * 100}">
          <span class="control-value volume-value">${Math.round(state.volume * 100)}%</span>
        </div>
        <div class="control-group">
          <label>节奏</label>
          <input type="range" class="rhythm-slider" min="10" max="200" value="${state.rhythm * 100}">
          <span class="control-value rhythm-value">${Math.round(state.rhythm * 100)}%</span>
        </div>
      </div>
    `;

    return card;
  }

  renderPresets() {
    const list = document.getElementById('presetsList');
    list.innerHTML = '';

    presetManager.getAllPresets().forEach(preset => {
      const item = document.createElement('div');
      item.className = 'preset-item';
      item.dataset.presetId = preset.id;

      item.innerHTML = `
        <span class="preset-name">${preset.name}</span>
        <span class="preset-delete" title="删除">✕</span>
      `;

      list.appendChild(item);
    });
  }

  bindEvents() {
    document.getElementById('soundGrid').addEventListener('click', (e) => {
      const card = e.target.closest('.sound-card');
      if (card && !e.target.matches('input')) {
        this.toggleSound(card.dataset.soundId);
      }
    });

    document.getElementById('soundGrid').addEventListener('input', (e) => {
      const card = e.target.closest('.sound-card');
      if (!card) return;

      const soundId = card.dataset.soundId;

      if (e.target.classList.contains('volume-slider')) {
        const volume = e.target.value / 100;
        this.setVolume(soundId, volume);
      } else if (e.target.classList.contains('rhythm-slider')) {
        const rhythm = e.target.value / 100;
        this.setRhythm(soundId, rhythm);
      }
    });

    document.getElementById('masterVolume').addEventListener('input', (e) => {
      const value = e.target.value / 100;
      audioEngine.setMasterVolume(value);
      document.getElementById('masterVolumeValue').textContent = `${e.target.value}%`;
    });

    document.getElementById('playAllBtn').addEventListener('click', () => {
      this.playAll();
    });

    document.getElementById('stopAllBtn').addEventListener('click', () => {
      this.stopAll();
    });

    document.getElementById('savePresetBtn').addEventListener('click', () => {
      this.savePreset();
    });

    document.getElementById('presetsList').addEventListener('click', (e) => {
      const item = e.target.closest('.preset-item');
      if (!item) return;

      const presetId = item.dataset.presetId;

      if (e.target.classList.contains('preset-delete')) {
        e.stopPropagation();
        presetManager.deletePreset(presetId);
        this.renderPresets();
      } else {
        this.loadPreset(presetId);
      }
    });
  }

  toggleSound(soundId) {
    audioEngine.init();
    audioEngine.resume();

    const state = this.soundStates[soundId];
    state.isPlaying = !state.isPlaying;

    if (state.isPlaying) {
      this.sounds[soundId].play();
    } else {
      this.sounds[soundId].stop();
    }

    this.updateCardUI(soundId);
  }

  setVolume(soundId, volume) {
    this.soundStates[soundId].volume = volume;
    this.sounds[soundId].setVolume(volume);

    const card = document.querySelector(`[data-sound-id="${soundId}"]`);
    if (card) {
      card.querySelector('.volume-value').textContent = `${Math.round(volume * 100)}%`;
    }
  }

  setRhythm(soundId, rhythm) {
    this.soundStates[soundId].rhythm = rhythm;
    this.sounds[soundId].setRhythm(rhythm);

    const card = document.querySelector(`[data-sound-id="${soundId}"]`);
    if (card) {
      card.querySelector('.rhythm-value').textContent = `${Math.round(rhythm * 100)}%`;
    }
  }

  updateCardUI(soundId) {
    const card = document.querySelector(`[data-sound-id="${soundId}"]`);
    if (card) {
      const state = this.soundStates[soundId];
      card.classList.toggle('active', state.isPlaying);
    }
  }

  playAll() {
    audioEngine.init();
    audioEngine.resume();

    Object.entries(this.soundStates).forEach(([soundId, state]) => {
      if (!state.isPlaying && state.volume > 0) {
        state.isPlaying = true;
        this.sounds[soundId].play();
        this.updateCardUI(soundId);
      }
    });
  }

  stopAll() {
    Object.entries(this.soundStates).forEach(([soundId, state]) => {
      if (state.isPlaying) {
        state.isPlaying = false;
        this.sounds[soundId].stop();
        this.updateCardUI(soundId);
      }
    });
  }

  savePreset() {
    const nameInput = document.getElementById('presetName');
    const name = nameInput.value.trim();

    if (!name) {
      alert('请输入预设名称');
      return;
    }

    presetManager.addPreset(name, this.soundStates);
    this.renderPresets();
    nameInput.value = '';
  }

  loadPreset(presetId) {
    const preset = presetManager.getPreset(presetId);
    if (!preset) return;

    this.stopAll();
    audioEngine.init();
    audioEngine.resume();

    Object.entries(this.soundStates).forEach(([soundId, state]) => {
      const presetSound = preset.sounds[soundId];
      
      if (presetSound) {
        state.volume = presetSound.volume;
        state.rhythm = presetSound.rhythm;
        state.isPlaying = true;

        this.sounds[soundId].setVolume(state.volume);
        this.sounds[soundId].setRhythm(state.rhythm);
        this.sounds[soundId].play();

        this.updateCardControls(soundId);
        this.updateCardUI(soundId);
      } else {
        state.volume = 0;
        state.rhythm = 1;
        this.sounds[soundId].setVolume(0);
        this.updateCardControls(soundId);
      }
    });
  }

  updateCardControls(soundId) {
    const state = this.soundStates[soundId];
    const card = document.querySelector(`[data-sound-id="${soundId}"]`);
    
    if (card) {
      card.querySelector('.volume-slider').value = state.volume * 100;
      card.querySelector('.volume-value').textContent = `${Math.round(state.volume * 100)}%`;
      card.querySelector('.rhythm-slider').value = state.rhythm * 100;
      card.querySelector('.rhythm-value').textContent = `${Math.round(state.rhythm * 100)}%`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new NatureSoundApp();
});
