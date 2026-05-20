class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.trackGains = {};
    this.trackMuted = {};
    this.trackSolo = {};
    this.hasSolo = false;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.6;
      this.masterGain.connect(this.audioContext.destination);
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  createTrack(trackId) {
    if (!this.audioContext) this.init();
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 1.0;
    gainNode.connect(this.masterGain);
    this.trackGains[trackId] = gainNode;
    this.trackMuted[trackId] = false;
    this.trackSolo[trackId] = false;
  }

  setMute(trackId, muted) {
    this.trackMuted[trackId] = muted;
    this.updateTrackGains();
  }

  setSolo(trackId, solo) {
    this.trackSolo[trackId] = solo;
    this.hasSolo = Object.values(this.trackSolo).some(v => v);
    this.updateTrackGains();
  }

  updateTrackGains() {
    for (const trackId in this.trackGains) {
      let gain = 1.0;
      if (this.trackMuted[trackId]) {
        gain = 0;
      } else if (this.hasSolo && !this.trackSolo[trackId]) {
        gain = 0;
      }
      this.trackGains[trackId].gain.value = gain;
    }
  }

  playSound(trackId, time, velocity = 1) {
    if (!this.audioContext) this.init();
    
    const gainNode = this.trackGains[trackId];
    if (!gainNode) return;

    switch (trackId) {
      case 'muyu':
        this.playMuyu(time, velocity, gainNode);
        break;
      case 'gu':
        this.playGu(time, velocity, gainNode);
        break;
      case 'luo':
        this.playLuo(time, velocity, gainNode);
        break;
      case 'bo':
        this.playBo(time, velocity, gainNode);
        break;
    }
  }

  playMuyu(time, velocity, output) {
    const osc = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, time);
    osc.frequency.exponentialRampToValueAtTime(800, time + 0.05);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2400, time);
    osc2.frequency.exponentialRampToValueAtTime(1200, time + 0.03);

    filter.type = 'bandpass';
    filter.frequency.value = 1500;
    filter.Q.value = 2;

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.8 * velocity, time + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(output);

    osc.start(time);
    osc2.start(time);
    osc.stop(time + 0.15);
    osc2.stop(time + 0.15);
  }

  playGu(time, velocity, output) {
    const osc = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const noise = this.audioContext.createBufferSource();
    const noiseGain = this.audioContext.createGain();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(60, time + 0.2);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(200, time);
    osc2.frequency.exponentialRampToValueAtTime(80, time + 0.15);

    const bufferSize = this.audioContext.sampleRate * 0.1;
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    noise.buffer = noiseBuffer;

    noiseGain.gain.value = 0.3;

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, time);
    filter.frequency.exponentialRampToValueAtTime(100, time + 0.2);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.9 * velocity, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

    osc.connect(filter);
    osc2.connect(filter);
    noise.connect(noiseGain);
    noiseGain.connect(filter);
    filter.connect(gain);
    gain.connect(output);

    osc.start(time);
    osc2.start(time);
    noise.start(time);
    osc.stop(time + 0.5);
    osc2.stop(time + 0.5);
    noise.stop(time + 0.5);
  }

  playLuo(time, velocity, output) {
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const osc3 = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(350, time);
    osc1.frequency.exponentialRampToValueAtTime(320, time + 0.5);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(525, time);
    osc2.frequency.exponentialRampToValueAtTime(480, time + 0.4);

    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(700, time);
    osc3.frequency.exponentialRampToValueAtTime(650, time + 0.3);

    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 3;

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.7 * velocity, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 1.5);

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(gain);
    gain.connect(output);

    osc1.start(time);
    osc2.start(time);
    osc3.start(time);
    osc1.stop(time + 1.5);
    osc2.stop(time + 1.5);
    osc3.stop(time + 1.5);
  }

  playBo(time, velocity, output) {
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const noise = this.audioContext.createBufferSource();
    const noiseGain = this.audioContext.createGain();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    osc1.type = 'square';
    osc1.frequency.setValueAtTime(800, time);
    osc1.frequency.exponentialRampToValueAtTime(400, time + 0.1);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1200, time);
    osc2.frequency.exponentialRampToValueAtTime(600, time + 0.08);

    const bufferSize = this.audioContext.sampleRate * 0.15;
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
    }
    noise.buffer = noiseBuffer;

    noiseGain.gain.value = 0.4;

    filter.type = 'highpass';
    filter.frequency.value = 300;

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.6 * velocity, time + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

    osc1.connect(filter);
    osc2.connect(filter);
    noise.connect(noiseGain);
    noiseGain.connect(filter);
    filter.connect(gain);
    gain.connect(output);

    osc1.start(time);
    osc2.start(time);
    noise.start(time);
    osc1.stop(time + 0.3);
    osc2.stop(time + 0.3);
    noise.stop(time + 0.3);
  }

  getCurrentTime() {
    return this.audioContext ? this.audioContext.currentTime : 0;
  }
}

export default new AudioEngine();
