import audioEngine from './audioEngine.js';

class RainSound {
  constructor(id) {
    this.id = id;
    this.source = null;
    this.filter = null;
    this.bufferSource = null;
    this.rhythm = 1;
  }

  init() {
    this.source = audioEngine.createSource(this.id);
    this.filter = audioEngine.audioContext.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 1000;
    this.filter.Q.value = 0.5;
    this.filter.connect(this.source.gainNode);
    this.source.filters.push(this.filter);
  }

  play() {
    if (!this.source) this.init();
    
    const buffer = audioEngine.createNoiseBuffer('pink', 5);
    this.bufferSource = audioEngine.audioContext.createBufferSource();
    this.bufferSource.buffer = buffer;
    this.bufferSource.loop = true;
    this.bufferSource.connect(this.filter);
    this.bufferSource.start();
    
    this.source.bufferSources.push(this.bufferSource);
    audioEngine.play(this.id);
  }

  stop() {
    if (this.bufferSource) {
      try {
        this.bufferSource.stop();
        this.bufferSource.disconnect();
      } catch (e) {}
      this.bufferSource = null;
    }
    audioEngine.stop(this.id);
  }

  setVolume(value) {
    audioEngine.setVolume(this.id, value);
  }

  setRhythm(value) {
    this.rhythm = value;
    if (this.filter) {
      this.filter.frequency.value = 500 + value * 1000;
    }
  }

  getState() {
    return {
      volume: this.source ? this.source.volume : 0.5,
      rhythm: this.rhythm,
      isPlaying: this.source ? this.source.isPlaying : false
    };
  }
}

class StreamSound {
  constructor(id) {
    this.id = id;
    this.source = null;
    this.filter = null;
    this.bufferSource = null;
    this.lfo = null;
    this.lfoGain = null;
    this.rhythm = 1;
  }

  init() {
    this.source = audioEngine.createSource(this.id);
    
    this.filter = audioEngine.audioContext.createBiquadFilter();
    this.filter.type = 'bandpass';
    this.filter.frequency.value = 800;
    this.filter.Q.value = 2;
    this.filter.connect(this.source.gainNode);
    this.source.filters.push(this.filter);

    this.lfoGain = audioEngine.audioContext.createGain();
    this.lfoGain.gain.value = 200;
  }

  play() {
    if (!this.source) this.init();
    
    const buffer = audioEngine.createNoiseBuffer('white', 3);
    this.bufferSource = audioEngine.audioContext.createBufferSource();
    this.bufferSource.buffer = buffer;
    this.bufferSource.loop = true;
    
    this.lfo = audioEngine.audioContext.createOscillator();
    this.lfo.type = 'sine';
    this.lfo.frequency.value = 2 * this.rhythm;
    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.filter.frequency);
    this.lfo.start();
    
    this.bufferSource.connect(this.filter);
    this.bufferSource.start();
    
    this.source.bufferSources.push(this.bufferSource);
    this.source.oscillators.push(this.lfo);
    audioEngine.play(this.id);
  }

  stop() {
    if (this.bufferSource) {
      try {
        this.bufferSource.stop();
        this.bufferSource.disconnect();
      } catch (e) {}
      this.bufferSource = null;
    }
    if (this.lfo) {
      try {
        this.lfo.stop();
        this.lfo.disconnect();
      } catch (e) {}
      this.lfo = null;
    }
    audioEngine.stop(this.id);
  }

  setVolume(value) {
    audioEngine.setVolume(this.id, value);
  }

  setRhythm(value) {
    this.rhythm = value;
    if (this.lfo) {
      this.lfo.frequency.value = 2 * value;
    }
  }

  getState() {
    return {
      volume: this.source ? this.source.volume : 0.5,
      rhythm: this.rhythm,
      isPlaying: this.source ? this.source.isPlaying : false
    };
  }
}

class BirdsSound {
  constructor(id) {
    this.id = id;
    this.source = null;
    this.oscillators = [];
    this.intervalId = null;
    this.rhythm = 1;
    this.isPlaying = false;
  }

  init() {
    this.source = audioEngine.createSource(this.id);
  }

  playChirp() {
    if (!this.isPlaying) return;
    
    const osc = audioEngine.audioContext.createOscillator();
    const gain = audioEngine.audioContext.createGain();
    const filter = audioEngine.audioContext.createBiquadFilter();
    
    const baseFreq = 2000 + Math.random() * 2000;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, audioEngine.getCurrentTime());
    osc.frequency.exponentialRampToValueAtTime(
      baseFreq * (0.8 + Math.random() * 0.4),
      audioEngine.getCurrentTime() + 0.1
    );
    
    filter.type = 'highpass';
    filter.frequency.value = 1500;
    
    gain.gain.setValueAtTime(0, audioEngine.getCurrentTime());
    gain.gain.linearRampToValueAtTime(0.3 * (this.source ? this.source.volume : 0.5), audioEngine.getCurrentTime() + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audioEngine.getCurrentTime() + 0.15);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.source.gainNode);
    
    osc.start();
    osc.stop(audioEngine.getCurrentTime() + 0.2);
    
    this.oscillators.push({ osc, gain, filter });
    
    setTimeout(() => {
      try {
        osc.disconnect();
        gain.disconnect();
        filter.disconnect();
      } catch (e) {}
    }, 250);
  }

  play() {
    if (!this.source) this.init();
    this.isPlaying = true;
    audioEngine.play(this.id);
    
    const chirp = () => {
      if (this.isPlaying) {
        this.playChirp();
        if (Math.random() > 0.3) {
          setTimeout(() => this.playChirp(), 100 + Math.random() * 100);
        }
      }
    };
    
    chirp();
    this.intervalId = setInterval(chirp, (2000 / this.rhythm) + Math.random() * 2000);
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.oscillators.forEach(({ osc, gain, filter }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
        filter.disconnect();
      } catch (e) {}
    });
    this.oscillators = [];
    audioEngine.stop(this.id);
  }

  setVolume(value) {
    audioEngine.setVolume(this.id, value);
  }

  setRhythm(value) {
    this.rhythm = value;
    if (this.isPlaying && this.intervalId) {
      clearInterval(this.intervalId);
      const chirp = () => {
        if (this.isPlaying) {
          this.playChirp();
          if (Math.random() > 0.3) {
            setTimeout(() => this.playChirp(), 100 + Math.random() * 100);
          }
        }
      };
      this.intervalId = setInterval(chirp, (2000 / value) + Math.random() * 2000);
    }
  }

  getState() {
    return {
      volume: this.source ? this.source.volume : 0.5,
      rhythm: this.rhythm,
      isPlaying: this.isPlaying
    };
  }
}

class WindSound {
  constructor(id) {
    this.id = id;
    this.source = null;
    this.filter = null;
    this.bufferSource = null;
    this.lfo = null;
    this.lfoGain = null;
    this.rhythm = 1;
  }

  init() {
    this.source = audioEngine.createSource(this.id);
    
    this.filter = audioEngine.audioContext.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 400;
    this.filter.Q.value = 1;
    this.filter.connect(this.source.gainNode);
    this.source.filters.push(this.filter);

    this.lfoGain = audioEngine.audioContext.createGain();
    this.lfoGain.gain.value = 200;
  }

  play() {
    if (!this.source) this.init();
    
    const buffer = audioEngine.createNoiseBuffer('brown', 5);
    this.bufferSource = audioEngine.audioContext.createBufferSource();
    this.bufferSource.buffer = buffer;
    this.bufferSource.loop = true;
    
    this.lfo = audioEngine.audioContext.createOscillator();
    this.lfo.type = 'sine';
    this.lfo.frequency.value = 0.3 * this.rhythm;
    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.filter.frequency);
    this.lfo.start();
    
    this.bufferSource.connect(this.filter);
    this.bufferSource.start();
    
    this.source.bufferSources.push(this.bufferSource);
    this.source.oscillators.push(this.lfo);
    audioEngine.play(this.id);
  }

  stop() {
    if (this.bufferSource) {
      try {
        this.bufferSource.stop();
        this.bufferSource.disconnect();
      } catch (e) {}
      this.bufferSource = null;
    }
    if (this.lfo) {
      try {
        this.lfo.stop();
        this.lfo.disconnect();
      } catch (e) {}
      this.lfo = null;
    }
    audioEngine.stop(this.id);
  }

  setVolume(value) {
    audioEngine.setVolume(this.id, value);
  }

  setRhythm(value) {
    this.rhythm = value;
    if (this.lfo) {
      this.lfo.frequency.value = 0.3 * value;
    }
  }

  getState() {
    return {
      volume: this.source ? this.source.volume : 0.5,
      rhythm: this.rhythm,
      isPlaying: this.source ? this.source.isPlaying : false
    };
  }
}

class ThunderSound {
  constructor(id) {
    this.id = id;
    this.source = null;
    this.timeoutId = null;
    this.rhythm = 1;
    this.isPlaying = false;
  }

  init() {
    this.source = audioEngine.createSource(this.id);
  }

  playThunder() {
    if (!this.isPlaying) return;
    
    const buffer = audioEngine.createNoiseBuffer('brown', 2);
    const bufferSource = audioEngine.audioContext.createBufferSource();
    bufferSource.buffer = buffer;
    
    const filter = audioEngine.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 150;
    
    const gain = audioEngine.audioContext.createGain();
    gain.gain.setValueAtTime(0, audioEngine.getCurrentTime());
    gain.gain.linearRampToValueAtTime(0.8 * (this.source ? this.source.volume : 0.5), audioEngine.getCurrentTime() + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, audioEngine.getCurrentTime() + 1.5);
    
    bufferSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.source.gainNode);
    
    bufferSource.start();
    bufferSource.stop(audioEngine.getCurrentTime() + 2);
  }

  play() {
    if (!this.source) this.init();
    this.isPlaying = true;
    audioEngine.play(this.id);
    
    const thunder = () => {
      if (this.isPlaying) {
        this.playThunder();
        this.timeoutId = setTimeout(thunder, (8000 / this.rhythm) + Math.random() * 8000);
      }
    };
    
    this.timeoutId = setTimeout(thunder, 2000 + Math.random() * 3000);
  }

  stop() {
    this.isPlaying = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    audioEngine.stop(this.id);
  }

  setVolume(value) {
    audioEngine.setVolume(this.id, value);
  }

  setRhythm(value) {
    this.rhythm = value;
  }

  getState() {
    return {
      volume: this.source ? this.source.volume : 0.5,
      rhythm: this.rhythm,
      isPlaying: this.isPlaying
    };
  }
}

class FireSound {
  constructor(id) {
    this.id = id;
    this.source = null;
    this.filter = null;
    this.bufferSource = null;
    this.crackInterval = null;
    this.rhythm = 1;
    this.isPlaying = false;
  }

  init() {
    this.source = audioEngine.createSource(this.id);
    
    this.filter = audioEngine.audioContext.createBiquadFilter();
    this.filter.type = 'bandpass';
    this.filter.frequency.value = 600;
    this.filter.Q.value = 3;
    this.filter.connect(this.source.gainNode);
    this.source.filters.push(this.filter);
  }

  playCrack() {
    if (!this.isPlaying) return;
    
    const osc = audioEngine.audioContext.createOscillator();
    const gain = audioEngine.audioContext.createGain();
    
    osc.type = 'square';
    osc.frequency.value = 100 + Math.random() * 200;
    
    gain.gain.setValueAtTime(0, audioEngine.getCurrentTime());
    gain.gain.linearRampToValueAtTime(0.1 * (this.source ? this.source.volume : 0.5), audioEngine.getCurrentTime() + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, audioEngine.getCurrentTime() + 0.05);
    
    osc.connect(gain);
    gain.connect(this.source.gainNode);
    
    osc.start();
    osc.stop(audioEngine.getCurrentTime() + 0.1);
  }

  play() {
    if (!this.source) this.init();
    this.isPlaying = true;
    
    const buffer = audioEngine.createNoiseBuffer('brown', 3);
    this.bufferSource = audioEngine.audioContext.createBufferSource();
    this.bufferSource.buffer = buffer;
    this.bufferSource.loop = true;
    this.bufferSource.connect(this.filter);
    this.bufferSource.start();
    
    this.source.bufferSources.push(this.bufferSource);
    
    this.crackInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        this.playCrack();
      }
    }, 500 / this.rhythm);
    
    audioEngine.play(this.id);
  }

  stop() {
    this.isPlaying = false;
    if (this.bufferSource) {
      try {
        this.bufferSource.stop();
        this.bufferSource.disconnect();
      } catch (e) {}
      this.bufferSource = null;
    }
    if (this.crackInterval) {
      clearInterval(this.crackInterval);
      this.crackInterval = null;
    }
    audioEngine.stop(this.id);
  }

  setVolume(value) {
    audioEngine.setVolume(this.id, value);
  }

  setRhythm(value) {
    this.rhythm = value;
    if (this.isPlaying && this.crackInterval) {
      clearInterval(this.crackInterval);
      this.crackInterval = setInterval(() => {
        if (Math.random() > 0.5) {
          this.playCrack();
        }
      }, 500 / value);
    }
  }

  getState() {
    return {
      volume: this.source ? this.source.volume : 0.5,
      rhythm: this.rhythm,
      isPlaying: this.isPlaying
    };
  }
}

export const soundTypes = {
  rain: {
    name: '雨声',
    icon: '🌧️',
    class: RainSound
  },
  stream: {
    name: '溪流',
    icon: '💧',
    class: StreamSound
  },
  birds: {
    name: '鸟鸣',
    icon: '🐦',
    class: BirdsSound
  },
  wind: {
    name: '风声',
    icon: '🌬️',
    class: WindSound
  },
  thunder: {
    name: '雷声',
    icon: '⛈️',
    class: ThunderSound
  },
  fire: {
    name: '篝火',
    icon: '🔥',
    class: FireSound
  }
};
