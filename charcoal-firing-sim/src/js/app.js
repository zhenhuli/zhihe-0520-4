(function () {
  'use strict';

  var STAGES = {
    IDLE: 'idle',
    HEATING: 'heating',
    HOLDING: 'holding',
    CARBONIZING: 'carbonizing',
    COOLING: 'cooling',
    DONE: 'done'
  };

  var STAGE_NAMES = {
    idle: '待点火',
    heating: '升温阶段',
    holding: '恒温阶段',
    carbonizing: '缺氧炭化',
    cooling: '冷却阶段',
    done: '烧制完成'
  };

  var WOOD_CONFIG = {
    hard: { name: '硬木炭', density: 1.0, yieldBase: 0.22, burnTime: 1.0 },
    soft: { name: '软木炭', density: 0.7, yieldBase: 0.18, burnTime: 0.85 },
    bamboo: { name: '竹炭', density: 0.85, yieldBase: 0.20, burnTime: 0.9 }
  };

  var state = {
    stage: STAGES.IDLE,
    running: false,
    paused: false,
    temp: 25,
    targetTemp: 600,
    holdTime: 120,
    speed: 60,
    woodType: 'hard',
    simTime: 0,
    o2: 21,
    progress: 0,
    moisture: 0.35,
    volatile: 0.7,
    fixedCarbon: 0.25,
    ash: 0.05,
    crackLevel: 0,
    charLevel: 0,
    overBurn: 0,
    animTime: 0,
    logs: []
  };

  var canvas, ctx, productCanvas, pctx;
  var w = 800, h = 520;

  function init() {
    canvas = document.getElementById('kiln');
    ctx = canvas.getContext('2d');
    productCanvas = document.getElementById('productCanvas');
    pctx = productCanvas.getContext('2d');

    bindControls();
    resetLogs();
    updateUI();
    updateButtonStates();
    draw();
    requestAnimationFrame(loop);
  }

  function resetLogs() {
    state.logs = [];
    var count = 18;
    for (var i = 0; i < count; i++) {
      state.logs.push({
        x: 120 + Math.random() * 560,
        y: 320 + Math.random() * 130,
        w: 80 + Math.random() * 40,
        h: 18 + Math.random() * 10,
        angle: (Math.random() - 0.5) * 0.3,
        color: '#6b4a2a',
        glow: 0
      });
    }
  }

  function bindControls() {
    var tempSlider = document.getElementById('targetTemp');
    var holdSlider = document.getElementById('holdTime');
    var speedSlider = document.getElementById('speed');
    var woodSelect = document.getElementById('woodType');

    tempSlider.addEventListener('input', function () {
      state.targetTemp = +this.value;
      document.getElementById('tempVal').textContent = this.value;
    });
    holdSlider.addEventListener('input', function () {
      state.holdTime = +this.value;
      document.getElementById('holdVal').textContent = this.value;
    });
    speedSlider.addEventListener('input', function () {
      state.speed = +this.value;
      document.getElementById('speedVal').textContent = this.value;
    });
    woodSelect.addEventListener('change', function () {
      state.woodType = this.value;
    });

    document.getElementById('btnStart').addEventListener('click', startFiring);
    document.getElementById('btnPause').addEventListener('click', togglePause);
    document.getElementById('btnReset').addEventListener('click', resetFiring);
  }

  function startFiring() {
    if (state.stage === STAGES.DONE) resetFiring();
    if (state.stage === STAGES.IDLE) {
      state.stage = STAGES.HEATING;
      state.running = true;
      state.paused = false;
    } else if (state.paused) {
      state.paused = false;
      state.running = true;
    }
    updateButtonStates();
  }

  function togglePause() {
    if (state.stage === STAGES.IDLE || state.stage === STAGES.DONE) return;
    state.paused = !state.paused;
    state.running = !state.paused;
    updateButtonStates();
  }

  function updateButtonStates() {
    var btnPause = document.getElementById('btnPause');
    var btnStart = document.getElementById('btnStart');
    if (state.stage === STAGES.IDLE || state.stage === STAGES.DONE) {
      btnPause.disabled = true;
      btnStart.textContent = '🔥 点火开始';
    } else if (state.paused) {
      btnPause.disabled = false;
      btnPause.textContent = '▶️ 继续';
      btnStart.textContent = '▶️ 继续烧制';
    } else {
      btnPause.disabled = false;
      btnPause.textContent = '⏸ 暂停';
      btnStart.textContent = '🔥 烧制中';
    }
  }

  function resetFiring() {
    state.stage = STAGES.IDLE;
    state.running = false;
    state.paused = false;
    state.temp = 25;
    state.simTime = 0;
    state.o2 = 21;
    state.progress = 0;
    state.moisture = 0.35;
    state.volatile = 0.7;
    state.fixedCarbon = 0.25;
    state.ash = 0.05;
    state.crackLevel = 0;
    state.charLevel = 0;
    state.overBurn = 0;
    resetLogs();
    document.getElementById('resultBox').hidden = true;
    updateUI();
    updateButtonStates();
  }

  function update(dt) {
    if (!state.running || state.paused) return;

    var simDt = dt * state.speed;
    state.simTime += simDt / 60;

    switch (state.stage) {
      case STAGES.HEATING: updateHeating(simDt); break;
      case STAGES.HOLDING: updateHolding(simDt); break;
      case STAGES.CARBONIZING: updateCarbonizing(simDt); break;
      case STAGES.COOLING: updateCooling(simDt); break;
    }

    updateLogsVisual();
    updateUI();
  }

  function updateHeating(dt) {
    var rate = 15;
    state.temp += rate * dt / 60;
    if (state.temp < 100) {
      state.moisture -= 0.4 * dt / 60;
      if (state.moisture < 0) state.moisture = 0;
    }
    if (state.temp > 150) {
      state.volatile -= 0.05 * dt / 60;
      state.charLevel = Math.min(1, state.charLevel + 0.08 * dt / 60);
    }
    if (state.temp > 280) {
      state.crackLevel = Math.min(1, state.crackLevel + 0.1 * dt / 60);
    }
    if (state.temp >= state.targetTemp) {
      state.temp = state.targetTemp;
      state.stage = STAGES.HOLDING;
      state.holdStart = state.simTime;
    }
  }

  function updateHolding(dt) {
    state.temp += (state.targetTemp - state.temp) * 0.1;
    state.volatile -= 0.15 * dt / 60;
    state.charLevel = Math.min(1, state.charLevel + 0.2 * dt / 60);
    state.crackLevel = Math.min(1, state.crackLevel + 0.05 * dt / 60);
    if (state.targetTemp > 700) {
      state.overBurn += 0.15 * dt / 60;
    }
    if (state.volatile < 0.08) state.volatile = 0.08;
    var elapsed = state.simTime - state.holdStart;
    if (elapsed >= state.holdTime) {
      state.stage = STAGES.CARBONIZING;
      state.carbonStart = state.simTime;
    }
  }

  function updateCarbonizing(dt) {
    state.o2 -= 5 * dt / 60;
    if (state.o2 < 2) state.o2 = 2;
    state.temp += (state.targetTemp * 0.85 - state.temp) * 0.05;
    state.volatile -= 0.2 * dt / 60;
    if (state.volatile < 0.02) state.volatile = 0.02;
    state.fixedCarbon = Math.min(0.9, state.fixedCarbon + 0.3 * dt / 60);
    state.charLevel = Math.min(1, state.charLevel + 0.15 * dt / 60);
    if (state.targetTemp > 750) state.overBurn += 0.25 * dt / 60;
    var elapsed = state.simTime - state.carbonStart;
    if (elapsed >= 60) {
      state.stage = STAGES.COOLING;
    }
    state.progress = Math.min(1, state.progress + 0.6 * dt / 60);
  }

  function updateCooling(dt) {
    state.temp -= 8 * dt / 60;
    if (state.temp <= 40) {
      state.temp = 25;
      state.stage = STAGES.DONE;
      state.running = false;
      state.animTime = 0;
      showResult();
    }
    state.progress = Math.min(1, state.progress + 0.3 * dt / 60);
  }

  function updateLogsVisual() {
    for (var i = 0; i < state.logs.length; i++) {
      var log = state.logs[i];
      if (state.temp > 200) {
        log.glow = Math.min(1, (state.temp - 200) / 400);
      } else {
        log.glow = Math.max(0, log.glow - 0.02);
      }
      if (state.stage === STAGES.COOLING || state.stage === STAGES.DONE) {
        log.glow = Math.max(0, log.glow - 0.01);
      }
    }
  }

  function evaluateProduct() {
    var cfg = WOOD_CONFIG[state.woodType];
    var qualityScore = 100;
    var comments = [];

    if (state.targetTemp < 400) {
      qualityScore -= 40;
      comments.push('温度过低，炭化不充分');
    } else if (state.targetTemp < 500) {
      qualityScore -= 15;
      comments.push('温度偏低，挥发分残留较多');
    } else if (state.targetTemp > 800) {
      qualityScore -= 25;
      comments.push('温度过高，部分炭材灰化');
    } else if (state.targetTemp > 700) {
      qualityScore -= 8;
      comments.push('温度偏高，损耗增加');
    }

    if (state.holdTime < 60) {
      qualityScore -= 20;
      comments.push('保温不足，内部夹生');
    } else if (state.holdTime > 240) {
      qualityScore -= 10;
      comments.push('保温过长，固定碳损失');
    }

    if (state.woodType === 'soft' && state.targetTemp > 650) {
      qualityScore -= 10;
      comments.push('软木不耐高温，裂纹增多');
    }

    var yieldRate = cfg.yieldBase * (1 - state.overBurn * 0.3) * (1 - state.crackLevel * 0.15);
    yieldRate = Math.max(0.05, Math.min(0.35, yieldRate));

    var heatValue = 6000 + (state.fixedCarbon - 0.5) * 4000 - state.overBurn * 800;
    heatValue = Math.max(4000, Math.min(8500, heatValue));

    var grade;
    if (qualityScore >= 85) grade = '特级';
    else if (qualityScore >= 70) grade = '一级';
    else if (qualityScore >= 50) grade = '二级';
    else grade = '次品';

    var surface;
    if (state.charLevel < 0.4) surface = '未完全炭化，仍见木质纹理';
    else if (state.crackLevel > 0.7) surface = '裂纹严重，易碎裂';
    else if (state.overBurn > 0.5) surface = '表面灰化，手触成粉';
    else surface = '乌黑油亮，质地坚硬';

    if (comments.length === 0) comments.push('工艺控制良好');

    return {
      type: cfg.name,
      grade: grade,
      yieldRate: (yieldRate * 100).toFixed(1) + '%',
      surface: surface,
      heatValue: Math.round(heatValue) + ' kcal/kg',
      score: qualityScore,
      comments: comments.join('；')
    };
  }

  function showResult() {
    var r = evaluateProduct();
    document.getElementById('resultBox').hidden = false;
    document.getElementById('rType').textContent = r.type;
    document.getElementById('rQuality').textContent = r.grade + '（' + r.score + '分）';
    document.getElementById('rYield').textContent = r.yieldRate;
    document.getElementById('rSurface').textContent = r.surface;
    document.getElementById('rHeat').textContent = r.heatValue;
    document.getElementById('rComment').textContent = r.comments;
    document.getElementById('principle').textContent =
      '工艺要点：木材在' + state.targetTemp + '℃下经' + state.holdTime +
      '分钟保温，于缺氧环境完成干馏炭化，水分与挥发分被驱出，固定碳含量达' +
      (state.fixedCarbon * 100).toFixed(0) + '%，最终形成结构致密的木炭。';
    drawProduct(r);
    updateButtonStates();
  }

  function updateUI() {
    document.getElementById('curTemp').textContent = Math.round(state.temp) + ' ℃';
    var stageText = STAGE_NAMES[state.stage];
    if (state.paused) stageText += '（已暂停）';
    document.getElementById('curStage').textContent = stageText;
    document.getElementById('curTime').textContent = Math.round(state.simTime) + ' 分';
    document.getElementById('curO2').textContent = state.o2.toFixed(1) + '%';
    document.getElementById('curProgress').textContent = (state.progress * 100).toFixed(0) + '%';
    var badge = document.getElementById('stageBadge');
    if (state.paused) {
      badge.textContent = '⏸ ' + STAGE_NAMES[state.stage] + ' - 已暂停';
      badge.style.background = '#999';
    } else {
      badge.textContent = STAGE_NAMES[state.stage];
      var colors = {
        idle: '#888', heating: '#ff6633', holding: '#ffaa33',
        carbonizing: '#cc3333', cooling: '#66aaff', done: '#66cc66'
      };
      badge.style.background = colors[state.stage];
    }
    document.getElementById('curQuality').textContent =
      state.stage === STAGES.DONE ? evaluateProduct().grade : '烧制中';
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    drawBackground();
    drawKiln();
    drawLogs();
    drawSmoke();
    drawThermometer();
    drawTempCurve();
  }

  function drawBackground() {
    var grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#2a1810');
    grad.addColorStop(1, '#0d0604');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (state.stage !== STAGES.IDLE && state.stage !== STAGES.COOLING && state.stage !== STAGES.DONE) {
      var heat = ctx.createRadialGradient(400, 380, 50, 400, 380, 400);
      var intensity = Math.min(1, state.temp / 600);
      heat.addColorStop(0, 'rgba(255, 120, 30, ' + (0.4 * intensity) + ')');
      heat.addColorStop(1, 'rgba(255, 60, 0, 0)');
      ctx.fillStyle = heat;
      ctx.fillRect(0, 0, w, h);
    }
  }

  function drawKiln() {
    ctx.fillStyle = '#3a2418';
    ctx.fillRect(80, 200, 640, 280);

    ctx.fillStyle = '#5a3a22';
    for (var i = 0; i < 8; i++) {
      ctx.fillRect(80 + i * 80, 200, 4, 280);
      ctx.fillRect(80, 200 + i * 35, 640, 2);
    }

    ctx.strokeStyle = '#8a5a30';
    ctx.lineWidth = 3;
    ctx.strokeRect(80, 200, 640, 280);

    ctx.fillStyle = '#2a1810';
    ctx.beginPath();
    ctx.moveTo(360, 200);
    ctx.lineTo(440, 200);
    ctx.lineTo(460, 120);
    ctx.lineTo(340, 120);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#8a5a30';
    ctx.stroke();

    ctx.fillStyle = '#1a0d08';
    ctx.fillRect(390, 60, 20, 60);

    if (state.stage === STAGES.CARBONIZING || state.stage === STAGES.HOLDING || state.stage === STAGES.HEATING) {
      ctx.fillStyle = 'rgba(120, 60, 20, ' + (0.4 + Math.sin(state.animTime * 5) * 0.1) + ')';
      ctx.beginPath();
      ctx.arc(400, 380, 180, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#d4b89a';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('土窑 · Kiln', 400, 115);
  }

  function drawLogs() {
    for (var i = 0; i < state.logs.length; i++) {
      var log = state.logs[i];
      ctx.save();
      ctx.translate(log.x, log.y);
      ctx.rotate(log.angle);

      var baseColor = '#6b4a2a';
      if (state.charLevel > 0.1) {
        var c = state.charLevel;
        baseColor = 'rgb(' + Math.round(107 * (1 - c)) + ',' +
                    Math.round(74 * (1 - c) + 20 * c) + ',' +
                    Math.round(42 * (1 - c) + 20 * c) + ')';
      }

      if (log.glow > 0.1) {
        ctx.shadowColor = 'rgba(255, 120, 30, ' + log.glow + ')';
        ctx.shadowBlur = 20 * log.glow;
      }

      ctx.fillStyle = baseColor;
      ctx.fillRect(-log.w / 2, -log.h / 2, log.w, log.h);

      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(-log.w / 2, log.h / 2 - 3, log.w, 3);

      if (log.glow > 0.3) {
        ctx.fillStyle = 'rgba(255, ' + Math.round(120 + log.glow * 80) + ', 30, ' + (log.glow * 0.6) + ')';
        ctx.fillRect(-log.w / 2, -log.h / 2, log.w, log.h);
      }

      if (state.crackLevel > 0.2 && state.charLevel > 0.5) {
        ctx.strokeStyle = 'rgba(0,0,0,' + (state.crackLevel * 0.8) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-log.w / 2 + 5, 0);
        ctx.lineTo(log.w / 2 - 5, 0);
        ctx.stroke();
      }

      ctx.restore();
    }

    if (state.stage !== STAGES.IDLE && state.stage !== STAGES.COOLING && state.stage !== STAGES.DONE) {
      var t = state.animTime;
      for (var j = 0; j < 8; j++) {
        var fx = 150 + j * 80 + Math.sin(t + j) * 20;
        var fy = 470 - Math.abs(Math.sin(t * 2 + j * 0.5)) * 30;
        var fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, 20);
        fg.addColorStop(0, 'rgba(255, 200, 80, 0.8)');
        fg.addColorStop(0.5, 'rgba(255, 100, 30, 0.5)');
        fg.addColorStop(1, 'rgba(255, 50, 0, 0)');
        ctx.fillStyle = fg;
        ctx.fillRect(fx - 20, fy - 20, 40, 40);
      }
    }
  }

  function drawSmoke() {
    if (state.stage === STAGES.IDLE || state.stage === STAGES.DONE) return;
    var t = state.animTime;
    var intensity = 0;
    if (state.stage === STAGES.HEATING) intensity = state.moisture * 0.8;
    else if (state.stage === STAGES.HOLDING) intensity = state.volatile * 0.6;
    else if (state.stage === STAGES.CARBONIZING) intensity = 0.3 * (1 - state.o2 / 21);
    else if (state.stage === STAGES.COOLING) intensity = 0.1;

    for (var i = 0; i < 5; i++) {
      var sx = 400 + Math.sin(t * 2 + i) * 15;
      var sy = 80 - i * 30 - (t * 20) % 40;
      var sr = 15 + i * 5;
      ctx.fillStyle = 'rgba(180, 180, 180, ' + (intensity * 0.15) + ')';
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawThermometer() {
    var tx = 30, ty = 60, tw = 40, th = 400;
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(tx - 5, ty - 5, tw + 10, th + 30);

    var mercuryH = Math.min(th, (state.temp / 1000) * th);
    var grad = ctx.createLinearGradient(0, ty + th, 0, ty);
    grad.addColorStop(0, '#2266ff');
    grad.addColorStop(0.3, '#ffff33');
    grad.addColorStop(0.7, '#ff6600');
    grad.addColorStop(1, '#ff0000');
    ctx.fillStyle = grad;
    ctx.fillRect(tx + 10, ty + th - mercuryH, tw - 20, mercuryH);

    ctx.strokeStyle = '#8a5a30';
    ctx.lineWidth = 2;
    ctx.strokeRect(tx + 10, ty, tw - 20, th);

    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(tx + tw / 2, ty + th + 10, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f4e8d7';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    for (var i = 0; i <= 5; i++) {
      var y = ty + th - (i / 5) * th;
      ctx.fillText((i * 200) + '°', tx + tw + 5, y + 4);
    }
  }

  function drawTempCurve() {
    var cx = 700, cy = 60, cw = 80, ch = 400;
    ctx.strokeStyle = '#5a3a22';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx, cy, cw, ch);
    ctx.fillStyle = 'rgba(255, 140, 50, 0.1)';
    ctx.fillRect(cx, cy, cw, ch);

    var maxTime = 600;
    var progress = Math.min(1, state.simTime / maxTime);
    var tempRatio = Math.min(1, state.temp / 1000);

    ctx.strokeStyle = '#ffb366';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy + ch);
    ctx.lineTo(cx + cw * progress, cy + ch - tempRatio * ch);
    ctx.stroke();

    if (progress > 0) {
      ctx.fillStyle = '#ff4400';
      ctx.beginPath();
      ctx.arc(cx + cw * progress, cy + ch - tempRatio * ch, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#d4b89a';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('温升曲线', cx + cw / 2, cy - 8);
  }

  function drawProduct(result) {
    pctx.clearRect(0, 0, 400, 260);
    var bg = pctx.createLinearGradient(0, 0, 0, 260);
    bg.addColorStop(0, '#2a1810');
    bg.addColorStop(1, '#0d0604');
    pctx.fillStyle = bg;
    pctx.fillRect(0, 0, 400, 260);

    pctx.fillStyle = '#5a3a22';
    pctx.fillRect(20, 200, 360, 15);

    for (var i = 0; i < 6; i++) {
      var px = 60 + i * 55;
      var py = 180 - (i % 2) * 20;
      var pw = 50, ph = 18;
      var baseColor = '#1a0d08';
      if (state.charLevel > 0.7) baseColor = '#0a0604';
      else if (state.charLevel > 0.4) baseColor = '#201510';
      else baseColor = '#3a2418';

      pctx.fillStyle = baseColor;
      pctx.fillRect(px - pw / 2, py - ph / 2, pw, ph);

      pctx.fillStyle = 'rgba(255, 180, 80, 0.3)';
      pctx.fillRect(px - pw / 2, py - ph / 2, pw, 2);

      if (result.score >= 70) {
        pctx.fillStyle = 'rgba(255, 200, 100, 0.15)';
        pctx.beginPath();
        pctx.arc(px, py, 30, 0, Math.PI * 2);
        pctx.fill();
      }

      if (state.crackLevel > 0.5) {
        pctx.strokeStyle = 'rgba(0,0,0,0.8)';
        pctx.lineWidth = 1;
        pctx.beginPath();
        pctx.moveTo(px - pw / 2 + 5, py);
        pctx.lineTo(px + pw / 2 - 5, py);
        pctx.stroke();
      }
    }

    pctx.fillStyle = '#ffb366';
    pctx.font = '14px sans-serif';
    pctx.textAlign = 'center';
    pctx.fillText(result.type + ' - ' + result.grade, 200, 30);
  }

  var lastTime = 0;
  function loop(now) {
    if (!lastTime) lastTime = now;
    var dt = (now - lastTime) / 1000;
    lastTime = now;
    if (dt > 0.1) dt = 0.1;
    if (!state.paused && state.running) {
      state.animTime += dt;
    }
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
