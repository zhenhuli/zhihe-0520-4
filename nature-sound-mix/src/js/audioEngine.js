class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.sources = new Map();
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.7;
    this.masterGain.connect(this.audioContext.destination);
    this.isInitialized = true;
  }

  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  setMasterVolume(value) {
    if (this.masterGain) {
      this.masterGain.gain.value = value;
    }
  }

  createNoiseBuffer(type = 'white', duration = 2) {
    const sampleRate = this.audioContext.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, sampleRate);
    const output = buffer.getChannelData(0);

    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      
      switch (type) {
        case 'pink':
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
          break;
        case 'brown':
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
          break;
        default:
          output[i] = white;
      }
    }

    return buffer;
  }

  createSource(id) {
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0;
    gainNode.connect(this.masterGain);

    const source = {
      id,
      gainNode,
      oscillators: [],
      buffers: [],
      bufferSources: [],
      filters: [],
      isPlaying: false,
      volume: 0.5,
      rhythm: 1
    };

    this.sources.set(id, source);
    return source;
  }

  getSource(id) {
    return this.sources.get(id);
  }

  setVolume(id, value) {
    const source = this.sources.get(id);
    if (source) {
      source.volume = value;
      if (source.isPlaying) {
        source.gainNode.gain.value = value;
      }
    }
  }

  play(id) {
    const source = this.sources.get(id);
    if (source && !source.isPlaying) {
      source.gainNode.gain.value = source.volume;
      source.isPlaying = true;
    }
  }

  stop(id) {
    const source = this.sources.get(id);
    if (source) {
      source.gainNode.gain.value = 0;
      source.isPlaying = false;
    }
  }

  stopAll() {
    this.sources.forEach((source, id) => {
      this.stop(id);
    });
  }

  playAll() {
    this.sources.forEach((source, id) => {
      if (source.volume > 0) {
        this.play(id);
      }
    });
  }

  cleanup(id) {
    const source = this.sources.get(id);
    if (source) {
      source.oscillators.forEach(osc => {
        try { osc.stop(); } catch (e) {}
        try { osc.disconnect(); } catch (e) {}
      });
      source.bufferSources.forEach(bs => {
        try { bs.stop(); } catch (e) {}
        try { bs.disconnect(); } catch (e) {}
      });
      source.filters.forEach(f => {
        try { f.disconnect(); } catch (e) {}
      });
      try { source.gainNode.disconnect(); } catch (e) {}
      this.sources.delete(id);
    }
  }

  getCurrentTime() {
    return this.audioContext ? this.audioContext.currentTime : 0;
  }
}

export default new AudioEngine();
