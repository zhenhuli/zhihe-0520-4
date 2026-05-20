import audioEngine from './audioEngine.js';
import { TRACKS, PATTERNS, createEmptyPattern, copyPattern, getVelocity } from './patterns.js';

class RhythmComposer {
  constructor() {
    this.tempo = 100;
    this.beatsPerMeasure = 4;
    this.measures = 4;
    this.subdivision = 2;
    this.pattern = {};
    this.isPlaying = false;
    this.currentBeat = -1;
    this.loopEnabled = true;
    this.segmentStart = 0;
    this.segmentEnd = 0;
    this.segmentEnabled = false;
    this.scheduleAheadTime = 0.1;
    this.nextNoteTime = 0;
    this.lookahead = 25;
    this.animationId = null;
    this.startTime = 0;
    this.pausedBeat = -1;
    this.pausedAtTime = 0;

    this.init();
  }

  init() {
    const totalBeats = this.getTotalBeats();
    this.segmentEnd = totalBeats;
    this.pattern = copyPattern(PATTERNS.basic);
    this.resizePattern();
    this.bindEvents();
    this.renderTracks();
    this.updateSegmentControls();
  }

  getTotalBeats() {
    return this.beatsPerMeasure * this.measures * this.subdivision;
  }

  getBeatDuration() {
    return 60 / this.tempo / this.subdivision;
  }

  resizePattern() {
    const totalBeats = this.getTotalBeats();
    for (const track of TRACKS) {
      if (!this.pattern[track.id]) {
        this.pattern[track.id] = new Array(totalBeats).fill(0);
      } else if (this.pattern[track.id].length < totalBeats) {
        while (this.pattern[track.id].length < totalBeats) {
          this.pattern[track.id].push(0);
        }
      } else if (this.pattern[track.id].length > totalBeats) {
        this.pattern[track.id] = this.pattern[track.id].slice(0, totalBeats);
      }
    }
  }

  bindEvents() {
    document.getElementById('tempo').addEventListener('input', (e) => {
      this.tempo = parseInt(e.target.value);
      document.getElementById('tempoValue').textContent = this.tempo;
    });

    document.getElementById('beats').addEventListener('change', (e) => {
      this.beatsPerMeasure = parseInt(e.target.value);
      this.resizePattern();
      this.renderTracks();
      this.updateSegmentControls();
    });

    document.getElementById('measures').addEventListener('change', (e) => {
      this.measures = Math.max(1, Math.min(32, parseInt(e.target.value)));
      e.target.value = this.measures;
      this.resizePattern();
      this.renderTracks();
      this.updateSegmentControls();
    });

    document.getElementById('loop').addEventListener('change', (e) => {
      this.loopEnabled = e.target.checked;
    });

    document.getElementById('playBtn').addEventListener('click', () => this.togglePlay());
    document.getElementById('stopBtn').addEventListener('click', () => this.stop());
    document.getElementById('clearBtn').addEventListener('click', () => this.clearPattern());

    document.getElementById('setSegmentBtn').addEventListener('click', () => this.setSegment());
    document.getElementById('resetSegmentBtn').addEventListener('click', () => this.resetSegment());

    document.querySelectorAll('.btn-pattern').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const patternName = e.target.dataset.pattern;
        this.loadPattern(patternName);
      });
    });
  }

  loadPattern(name) {
    const sourcePattern = PATTERNS[name];
    if (!sourcePattern) return;
    
    const totalBeats = this.getTotalBeats();
    for (const track of TRACKS) {
      const source = sourcePattern[track.id] || [];
      this.pattern[track.id] = [];
      for (let i = 0; i < totalBeats; i++) {
        this.pattern[track.id].push(source[i % source.length] || 0);
      }
    }
    this.renderTracks();
  }

  clearPattern() {
    const totalBeats = this.getTotalBeats();
    this.pattern = createEmptyPattern(totalBeats);
    this.renderTracks();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    audioEngine.init();
    this.isPlaying = true;
    const now = audioEngine.getCurrentTime();
    
    if (this.pausedBeat >= 0) {
      this.currentBeat = this.pausedBeat;
      this.nextNoteTime = now + 0.05;
      const beatDuration = this.getBeatDuration();
      const startBeat = this.segmentEnabled ? this.segmentStart : 0;
      const beatsFromSegmentStart = this.pausedBeat - startBeat;
      this.startTime = this.nextNoteTime - (beatsFromSegmentStart * beatDuration);
    } else {
      this.currentBeat = -1;
      this.nextNoteTime = now + 0.05;
      this.startTime = this.nextNoteTime;
    }
    
    this.pausedBeat = -1;
    document.getElementById('playBtn').textContent = '⏸ 暂停';
    this.scheduler();
  }

  pause() {
    this.isPlaying = false;
    this.pausedBeat = this.currentBeat;
    this.pausedAtTime = audioEngine.getCurrentTime();
    document.getElementById('playBtn').textContent = '▶ 播放';
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  stop() {
    this.pause();
    this.currentBeat = -1;
    this.pausedBeat = -1;
    this.removePositionMarker();
    this.highlightBeat(-1);
  }

  scheduler() {
    if (!this.isPlaying) return;

    const currentTime = audioEngine.getCurrentTime();
    const beatDuration = this.getBeatDuration();
    const totalBeats = this.getTotalBeats();

    const startBeat = this.segmentEnabled ? this.segmentStart : 0;
    const endBeat = this.segmentEnabled ? this.segmentEnd : totalBeats;

    while (this.nextNoteTime < currentTime + this.scheduleAheadTime) {
      this.currentBeat++;
      
      if (this.segmentEnabled) {
        if (this.currentBeat >= endBeat) {
          if (this.loopEnabled) {
            this.currentBeat = startBeat;
            this.startTime = this.nextNoteTime;
          } else {
            this.stop();
            return;
          }
        }
      } else {
        if (this.currentBeat >= totalBeats) {
          if (this.loopEnabled) {
            this.currentBeat = 0;
            this.startTime = this.nextNoteTime;
          } else {
            this.stop();
            return;
          }
        }
      }

      const beatToPlay = this.currentBeat;
      this.scheduleBeat(beatToPlay, this.nextNoteTime);
      this.nextNoteTime += beatDuration;
    }

    this.updatePositionMarker();
    this.animationId = requestAnimationFrame(() => this.scheduler());
  }

  scheduleBeat(beatIndex, time) {
    const beatInMeasure = beatIndex % (this.beatsPerMeasure * this.subdivision);
    const isDownbeat = beatInMeasure % (this.subdivision * this.beatsPerMeasure) === 0;

    for (const track of TRACKS) {
      const velocityLevel = this.pattern[track.id][beatIndex];
      if (velocityLevel > 0) {
        const velocity = getVelocity(velocityLevel);
        audioEngine.playSound(track.id, time, velocity);
      }
    }

    this.highlightBeat(beatIndex);
  }

  highlightBeat(beatIndex) {
    document.querySelectorAll('.beat').forEach(el => {
      el.classList.remove('playing');
    });

    if (beatIndex >= 0) {
      document.querySelectorAll(`[data-beat="${beatIndex}"]`).forEach(el => {
        el.classList.add('playing');
      });
    }
  }

  updatePositionMarker() {
    if (!this.isPlaying) return;

    const currentTime = audioEngine.getCurrentTime();
    const beatDuration = this.getBeatDuration();
    const elapsed = currentTime - this.startTime;
    const totalBeats = this.getTotalBeats();
    const beatsElapsed = elapsed / beatDuration;
    
    const startBeat = this.segmentEnabled ? this.segmentStart : 0;
    const endBeat = this.segmentEnabled ? this.segmentEnd : totalBeats;
    const segmentLength = endBeat - startBeat;
    
    let position = (beatsElapsed % segmentLength) + startBeat;
    if (position >= endBeat) position = startBeat;

    const beatWidth = 44;
    const left = position * beatWidth;

    let marker = document.querySelector('.position-marker');
    if (!marker) {
      marker = document.createElement('div');
      marker.className = 'position-marker';
      document.querySelector('.tracks-container').appendChild(marker);
    }
    marker.style.left = `${left}px`;
  }

  removePositionMarker() {
    const marker = document.querySelector('.position-marker');
    if (marker) {
      marker.remove();
    }
  }

  setSegment() {
    const start = parseFloat(document.getElementById('segmentStart').value);
    const end = parseFloat(document.getElementById('segmentEnd').value);
    const totalBeats = this.getTotalBeats();

    if (start >= 0 && end > start && end <= totalBeats) {
      this.segmentStart = Math.floor(start * this.subdivision);
      this.segmentEnd = Math.ceil(end * this.subdivision);
      this.segmentEnabled = true;
      this.highlightSegment();
    }
  }

  resetSegment() {
    this.segmentEnabled = false;
    this.segmentStart = 0;
    this.segmentEnd = this.getTotalBeats();
    document.getElementById('segmentStart').value = 0;
    document.getElementById('segmentEnd').value = this.getTotalBeats() / this.subdivision;
    this.highlightSegment();
  }

  updateSegmentControls() {
    const totalBeats = this.getTotalBeats() / this.subdivision;
    document.getElementById('segmentStart').max = totalBeats - 0.5;
    document.getElementById('segmentEnd').max = totalBeats;
    document.getElementById('segmentEnd').value = totalBeats;
  }

  highlightSegment() {
    document.querySelectorAll('.beat').forEach(el => {
      el.classList.remove('in-segment');
    });

    if (this.segmentEnabled) {
      for (let i = this.segmentStart; i < this.segmentEnd; i++) {
        document.querySelectorAll(`[data-beat="${i}"]`).forEach(el => {
          el.classList.add('in-segment');
        });
      }
    }
  }

  renderTracks() {
    const tracksContainer = document.getElementById('tracks');
    tracksContainer.innerHTML = '';

    for (const track of TRACKS) {
      audioEngine.createTrack(track.id);
      
      const trackEl = document.createElement('div');
      trackEl.className = 'track';

      const labelEl = document.createElement('div');
      labelEl.className = `track-label ${track.id}`;
      labelEl.innerHTML = `${track.icon} ${track.name}`;

      const controlsEl = document.createElement('div');
      controlsEl.className = 'track-controls';
      
      const muteBtn = document.createElement('button');
      muteBtn.className = 'track-btn mute';
      muteBtn.textContent = '🔇';
      muteBtn.title = '静音';
      muteBtn.addEventListener('click', () => {
        muteBtn.classList.toggle('active');
        audioEngine.setMute(track.id, muteBtn.classList.contains('active'));
      });

      const soloBtn = document.createElement('button');
      soloBtn.className = 'track-btn solo';
      soloBtn.textContent = 'S';
      soloBtn.title = '独奏';
      soloBtn.addEventListener('click', () => {
        soloBtn.classList.toggle('active');
        audioEngine.setSolo(track.id, soloBtn.classList.contains('active'));
      });

      controlsEl.appendChild(muteBtn);
      controlsEl.appendChild(soloBtn);

      const gridEl = document.createElement('div');
      gridEl.className = 'beat-grid';

      const totalBeats = this.getTotalBeats();
      for (let i = 0; i < totalBeats; i++) {
        const beatEl = document.createElement('div');
        const velocity = this.pattern[track.id][i] || 0;
        beatEl.className = `beat vel-${velocity}`;
        beatEl.dataset.beat = i;
        beatEl.dataset.track = track.id;
        
        if (i % (this.beatsPerMeasure * this.subdivision) === 0) {
          beatEl.classList.add('downbeat');
        }

        beatEl.addEventListener('click', () => {
          const current = this.pattern[track.id][i] || 0;
          const next = (current + 1) % 4;
          this.pattern[track.id][i] = next;
          beatEl.className = `beat vel-${next}`;
          if (i % (this.beatsPerMeasure * this.subdivision) === 0) {
            beatEl.classList.add('downbeat');
          }
          if (this.segmentEnabled && i >= this.segmentStart && i < this.segmentEnd) {
            beatEl.classList.add('in-segment');
          }
          if (next > 0) {
            audioEngine.playSound(track.id, audioEngine.getCurrentTime() + 0.05, getVelocity(next));
          }
        });

        beatEl.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          this.pattern[track.id][i] = 0;
          beatEl.className = 'beat vel-0';
          if (i % (this.beatsPerMeasure * this.subdivision) === 0) {
            beatEl.classList.add('downbeat');
          }
          if (this.segmentEnabled && i >= this.segmentStart && i < this.segmentEnd) {
            beatEl.classList.add('in-segment');
          }
        });

        gridEl.appendChild(beatEl);
      }

      trackEl.appendChild(labelEl);
      trackEl.appendChild(controlsEl);
      trackEl.appendChild(gridEl);
      tracksContainer.appendChild(trackEl);
    }

    if (this.segmentEnabled) {
      this.highlightSegment();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.composer = new RhythmComposer();
});
