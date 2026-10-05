/**
 * SecangLab & E-LKPD Etnosains Kimia - Application Logic
 * Integrasi Riset Eksperimen Laboratorium & Etnosains Batik Nusantara
 * Universitas Negeri Semarang (UNNES)
 */

const app = (() => {
  // --- RESEARCH DATA (Ground truth from miniriset laboratorium RAL / UNNES) ---
  const empiricalData = {
    water: [
      { temp: 40, yieldVal: 8.45, lambda: 443, abs: 0.420, cieA: 24.2, hex: '#f59e0b', name: 'Kuning jingga terang' },
      { temp: 50, yieldVal: 11.20, lambda: 445, abs: 0.610, cieA: 32.5, hex: '#ea580c', name: 'Jingga kemerahan' },
      { temp: 60, yieldVal: 13.85, lambda: 446, abs: 0.782, cieA: 38.4, hex: '#c52439', name: 'Merah segar delima (Optimum)' },
      { temp: 70, yieldVal: 14.10, lambda: 448, abs: 0.720, cieA: 35.1, hex: '#8f1525', name: 'Merah agak gelap' },
      { temp: 80, yieldVal: 13.20, lambda: 452, abs: 0.640, cieA: 30.8, hex: '#5c0d17', name: 'Merah kecokelatan' },
      { temp: 100, yieldVal: 9.50, lambda: 458, abs: 0.342, cieA: 18.4, hex: '#451a03', name: 'Cokelat keruh butek (Degradasi Termal)' }
    ],
    ethanol: [
      { temp: 40, yieldVal: 10.50, lambda: 444, abs: 0.520, cieA: 28.1, hex: '#f97316', name: 'Jingga kemerahan cerah' },
      { temp: 50, yieldVal: 13.40, lambda: 446, abs: 0.710, cieA: 36.2, hex: '#e11d48', name: 'Merah cerah' },
      { temp: 60, yieldVal: 15.95, lambda: 447, abs: 0.895, cieA: 42.0, hex: '#be123c', name: 'Merah pekat (Tertinggi)' },
      { temp: 70, yieldVal: 15.10, lambda: 450, abs: 0.830, cieA: 38.7, hex: '#9f1239', name: 'Merah tua pekat' },
      { temp: 80, yieldVal: 14.20, lambda: 455, abs: 0.750, cieA: 33.5, hex: '#881337', name: 'Cokelat kemerahan pekat' },
      { temp: 100, yieldVal: 10.10, lambda: 460, abs: 0.410, cieA: 21.0, hex: '#3d1217', name: 'Cokelat gelap pekat' }
    ]
  };

  // State variables
  let currentTemp = 60;
  let currentSolvent = 'water';
  let currentRatio = 10;
  let currentTime = 30;

  // Web Audio API Synthesizer (Laboratory Sound Effects)
  let audioContext = null;
  let audioEnabled = localStorage.getItem('secang_audio') !== 'false';

  function initAudio() {
    if (!audioContext && (window.AudioContext || window.webkitAudioContext)) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  function playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.06) {
    if (!audioEnabled) return;
    try {
      initAudio();
      if (!audioContext) return;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);
      gain.gain.setValueAtTime(gainVal, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      osc.stop(audioContext.currentTime + duration);
    } catch (e) {}
  }

  function playBubbleSound() {
    if (!audioEnabled) return;
    try {
      initAudio();
      if (!audioContext) return;
      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320 + Math.random() * 120, now);
      osc.frequency.exponentialRampToValueAtTime(750 + Math.random() * 150, now + 0.1);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  function playChimeSound() {
    if (!audioEnabled) return;
    try {
      initAudio();
      if (!audioContext) return;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          playTone(freq, 'triangle', 0.35, 0.07);
        }, idx * 95);
      });
    } catch (e) {}
  }

  // DOM Elements
  const tabs = document.querySelectorAll('.nav-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const sliderTemp = document.getElementById('sliderTemp');
  const lblTemp = document.getElementById('lblTemp');
  const displayBathTemp = document.getElementById('displayBathTemp');
  const flaskLiquid = document.getElementById('flaskLiquid');
  const liquidStatusDesc = document.getElementById('liquidStatusDesc');
  const readoutLambda = document.getElementById('readoutLambda');
  const readoutAbs = document.getElementById('readoutAbs');
  const readoutYield = document.getElementById('readoutYield');
  const readoutCieA = document.getElementById('readoutCieA');
  const selectRatio = document.getElementById('selectRatio');
  const lblRatio = document.getElementById('lblRatio');
  const sliderTime = document.getElementById('sliderTime');
  const lblTime = document.getElementById('lblTime');
  const canvasSpectrum = document.getElementById('spectrumChart');
  const btnTransferToLKPD = document.getElementById('btnTransferToLKPD');
  const transferFeedback = document.getElementById('transferFeedback');
  const tableBodyRows = document.getElementById('tableBodyRows');
  const btnQuickPrint = document.getElementById('btnQuickPrint');
  const btnResetData = document.getElementById('btnResetData');
  const btnImportFromSim = document.getElementById('btnImportFromSim');
  const btnFillSampleData = document.getElementById('btnFillSampleData');
  const btnFillPdfSampleData = document.getElementById('btnFillPdfSampleData');

  // Modal Dialog Elements
  const mordantModalOverlay = document.getElementById('mordantModalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalSwatch = document.getElementById('modalSwatch');
  const modalColorName = document.getElementById('modalColorName');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalClothStrip = document.getElementById('modalClothStrip');
  const modalDipLiquid = document.getElementById('modalDipLiquid');
  const modalFastnessFill = document.getElementById('modalFastnessFill');
  const modalFastnessScore = document.getElementById('modalFastnessScore');
  const modalChemEquation = document.getElementById('modalChemEquation');

  // Toast Notification
  function showToast(message) {
    const toast = document.getElementById('toastNotice');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

  // Interpolate simulation data based on temperature
  function getSimulatedValues(temp, solvent) {
    const dataSet = empiricalData[solvent];
    let lower = dataSet[0];
    let upper = dataSet[dataSet.length - 1];

    for (let i = 0; i < dataSet.length - 1; i++) {
      if (temp >= dataSet[i].temp && temp <= dataSet[i + 1].temp) {
        lower = dataSet[i];
        upper = dataSet[i + 1];
        break;
      }
    }

    if (temp <= lower.temp) return lower;
    if (temp >= upper.temp) return upper;

    const fraction = (temp - lower.temp) / (upper.temp - lower.temp);
    
    // Linear interpolation
    const yieldVal = (lower.yieldVal + fraction * (upper.yieldVal - lower.yieldVal)).toFixed(2);
    const lambda = Math.round(lower.lambda + fraction * (upper.lambda - lower.lambda));
    const abs = (lower.abs + fraction * (upper.abs - lower.abs)).toFixed(3);
    const cieA = (lower.cieA + fraction * (upper.cieA - lower.cieA)).toFixed(1);

    // Color transition interpolation
    let hex = lower.hex;
    let name = lower.name;
    if (fraction > 0.5) {
      hex = upper.hex;
      name = upper.name;
    }

    return {
      temp,
      yieldVal: parseFloat(yieldVal),
      lambda,
      abs: parseFloat(abs),
      cieA: parseFloat(cieA),
      hex,
      name
    };
  }

  // Update simulator UI
  function updateSimulation() {
    if (lblTemp) lblTemp.textContent = `${currentTemp} °C`;
    if (displayBathTemp) displayBathTemp.textContent = `${currentTemp}.0`;
    
    const sim = getSimulatedValues(currentTemp, currentSolvent);

    // Apply color to liquid flask
    if (flaskLiquid) flaskLiquid.style.backgroundColor = sim.hex;
    if (liquidStatusDesc) liquidStatusDesc.innerHTML = `Kondisi: <strong>${sim.name}</strong>`;

    // Update Precision Thermometer & Steam Wisps
    const thermometerMercury = document.getElementById('thermometerMercury');
    if (thermometerMercury) {
      const mercuryHeight = Math.max(15, Math.min(95, ((currentTemp - 20) / 80) * 100));
      thermometerMercury.style.height = `${mercuryHeight}%`;
    }

    const steamContainer = document.getElementById('steamContainer');
    if (steamContainer) {
      steamContainer.classList.toggle('active', currentTemp >= 70);
    }

    // Update Spectrophotometer Readouts
    if (readoutLambda) readoutLambda.textContent = `${sim.lambda} nm`;
    if (readoutAbs) readoutAbs.textContent = sim.abs.toFixed(3);
    if (readoutYield) readoutYield.textContent = `${sim.yieldVal}%`;
    if (readoutCieA) readoutCieA.textContent = `+${sim.cieA}`;

    // Update preset buttons active state
    document.querySelectorAll('.btn-preset').forEach(btn => {
      const bTemp = parseInt(btn.dataset.temp);
      if (bTemp === currentTemp) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Draw spectrum chart
    drawSpectrum(sim.lambda, sim.abs);

    // Update fabric swatches
    updateSwatches(sim.hex);
  }

  // Interactive Extraction Cycle Simulation Trigger
  function runExtractionCycle() {
    const btn = document.getElementById('btnRunExtractionSim');
    const lbl = document.getElementById('lblRunExtraction');
    const stirBar = document.getElementById('magneticStirBar');
    const displayRpm = document.getElementById('displayBathRpm');
    if (!btn || btn.classList.contains('running')) return;

    btn.classList.add('running');
    if (lbl) lbl.textContent = 'Mengekstraksi Pigmen (Pemanasan & Difusi)...';
    if (displayRpm) displayRpm.textContent = '450 RPM (TURBO)';
    if (stirBar) stirBar.style.animationDuration = '0.35s';

    playBubbleSound();
    let bubbleCount = 0;
    const soundInterval = setInterval(() => {
      playBubbleSound();
      bubbleCount++;
      if (bubbleCount >= 6) clearInterval(soundInterval);
    }, 380);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      if (lbl) lbl.textContent = `Mengekstraksi... ${progress}%`;
      if (progress >= 100) {
        clearInterval(interval);
        clearInterval(soundInterval);

        btn.classList.remove('running');
        if (lbl) lbl.textContent = 'Siklus Ekstraksi Selesai (Klik untuk Ulang)';
        if (displayRpm) displayRpm.textContent = '150 RPM';
        if (stirBar) stirBar.style.animationDuration = '1.4s';

        updateSimulation();
        animateSpectrumLaserSweep(currentSim.lambdaMax, currentSim.absorbance);
        playChimeSound();
        showToast('Ekstraksi Berhasil! Spektrofotometer Terkalibrasi.');
      }
    }, 500);
  }

  // Interactive Molecular Resonance & Structure Explorer (Triad Sub-mikroskopis)
  function toggleMolecule(type) {
    const btnBrazilin = document.getElementById('btnMolBrazilin');
    const btnBrazilein = document.getElementById('btnMolBrazilein');
    const svgContainer = document.getElementById('molSvgContainer');
    const infoPanel = document.getElementById('molInfoPanel');
    if (!svgContainer || !infoPanel) return;

    if (btnBrazilin && btnBrazilein) {
      if (type === 'brazilin') {
        btnBrazilin.classList.add('active');
        btnBrazilein.classList.remove('active');
      } else {
        btnBrazilein.classList.add('active');
        btnBrazilin.classList.remove('active');
      }
    }

    playTone(520, 'sine', 0.08, 0.04);

    if (type === 'brazilin') {
      svgContainer.innerHTML = `
        <svg viewBox="0 0 320 180" width="100%" height="180" style="max-width: 320px;">
          <!-- Ring A: Resorcinol -->
          <polygon points="50,90 80,72 110,90 110,125 80,142 50,125" fill="#fefce8" stroke="#ca8a04" stroke-width="2"/>
          <line x1="80" y1="78" x2="104" y2="92" stroke="#ca8a04" stroke-width="1.5"/>
          <line x1="104" y1="122" x2="80" y2="136" stroke="#ca8a04" stroke-width="1.5"/>
          <line x1="56" y1="122" x2="56" y2="93" stroke="#ca8a04" stroke-width="1.5"/>
          
          <text x="20" y="132" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#a16207">HO-</text>
          <text x="20" y="94" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#a16207">HO-</text>
          
          <!-- Ring B (Chroman heterocyclic with O) -->
          <polygon points="110,90 145,70 175,90 175,125 145,142 110,125" fill="#fefce8" stroke="#ca8a04" stroke-width="2"/>
          <circle cx="145" cy="70" r="9" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
          <text x="141" y="74" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="800" fill="#854d0e">O</text>
          
          <line x1="145" y1="142" x2="145" y2="162" stroke="#ca8a04" stroke-width="2"/>
          <text x="135" y="174" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#a16207">-OH</text>
          
          <!-- Ring C -->
          <polygon points="175,90 210,72 245,90 245,125 210,142 175,125" fill="#fefce8" stroke="#ca8a04" stroke-width="2"/>
          <line x1="210" y1="78" x2="239" y2="92" stroke="#ca8a04" stroke-width="1.5"/>
          <line x1="239" y1="122" x2="210" y2="136" stroke="#ca8a04" stroke-width="1.5"/>
          
          <text x="252" y="94" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#a16207">-OH</text>
          <text x="252" y="132" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#a16207">-OH</text>
          
          <rect x="75" y="12" width="170" height="24" rx="4" fill="#fef9c3" stroke="#fde047" stroke-width="1"/>
          <text x="160" y="28" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="#854d0e" text-anchor="middle">Brazilin (C₁₆H₁₄O₅) - Tereduksi</text>
        </svg>
      `;

      infoPanel.innerHTML = `
        <div class="mol-param-badge" style="background:#fefce8; border-color:#fef08a; color:#854d0e;">
          Bentuk Tereduksi &bull; &lambda;maks = 280 nm (UV)
        </div>
        <p><strong>Ciri Submikroskopis:</strong> Memiliki 4 gugus hidroksil (–OH) dan atom karbon sp³ tetrahedral. Ikatan terkonjugasi terputus sehingga tidak terjadi resonansi elektron &pi; penuh.</p>
        <p><strong>Dampak Optik Spektroskopi:</strong> Celah energi (&Delta;E) lebar sehingga hanya mampu menyerap foton ultraviolet tak kasat mata (&sim;280 nm). Larutan tampak <em>kuning muda terang / bening</em>.</p>
      `;
    } else {
      svgContainer.innerHTML = `
        <svg viewBox="0 0 320 180" width="100%" height="180" style="max-width: 320px;">
          <!-- Ring A: Quinone Chromophore -->
          <polygon points="50,90 80,72 110,90 110,125 80,142 50,125" fill="#ffe4e6" stroke="#e11d48" stroke-width="2.2"/>
          <line x1="80" y1="78" x2="104" y2="92" stroke="#be123c" stroke-width="2"/>
          <line x1="104" y1="122" x2="80" y2="136" stroke="#be123c" stroke-width="2"/>
          <line x1="56" y1="122" x2="56" y2="93" stroke="#be123c" stroke-width="2"/>
          
          <!-- Carbonyl (=O) Group on Ring A -->
          <line x1="50" y1="90" x2="28" y2="82" stroke="#be123c" stroke-width="2.5"/>
          <line x1="52" y1="94" x2="30" y2="86" stroke="#be123c" stroke-width="2.5"/>
          <text x="12" y="88" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="900" fill="#9f1239">=O</text>
          
          <text x="20" y="134" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#be123c">HO-</text>
          
          <!-- Ring B (Conjugated Pyran) -->
          <polygon points="110,90 145,70 175,90 175,125 145,142 110,125" fill="#ffe4e6" stroke="#e11d48" stroke-width="2.2"/>
          <circle cx="145" cy="70" r="9" fill="#fecdd3" stroke="#e11d48" stroke-width="1.5"/>
          <text x="141" y="74" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="800" fill="#9f1239">O</text>
          
          <line x1="145" y1="142" x2="145" y2="162" stroke="#e11d48" stroke-width="2"/>
          <text x="135" y="174" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#be123c">-OH</text>
          
          <!-- Ring C: Fully Conjugated Resorcinol -->
          <polygon points="175,90 210,72 245,90 245,125 210,142 175,125" fill="#ffe4e6" stroke="#e11d48" stroke-width="2.2"/>
          <line x1="210" y1="78" x2="239" y2="92" stroke="#be123c" stroke-width="2"/>
          <line x1="239" y1="122" x2="210" y2="136" stroke="#be123c" stroke-width="2"/>
          
          <text x="252" y="94" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#be123c">-OH</text>
          <text x="252" y="132" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#be123c">-OH</text>
          
          <rect x="75" y="12" width="170" height="24" rx="4" fill="#fee2e2" stroke="#fca5a5" stroke-width="1"/>
          <text x="160" y="28" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="#991b1b" text-anchor="middle">Brazilein (C₁₆H₁₂O₅) - Teroksidasi</text>
        </svg>
      `;

      infoPanel.innerHTML = `
        <div class="mol-param-badge" style="background:#fee2e2; border-color:#fca5a5; color:#991b1b;">
          Bentuk Teroksidasi (Kromofor Kuinon) &bull; &lambda;maks = 446 nm (Visibel)
        </div>
        <p><strong>Ciri Submikroskopis:</strong> Kehilangan 2 proton dan 2 elektron (–2H⁺ – 2e⁻) membentuk gugus karbonil kuinon (=O). Sistem ikatan rangkap terkonjugasi penuh melintasi cincin heterosiklik.</p>
        <p><strong>Dampak Optik Spektroskopi:</strong> Terjadi transisi elektronik &pi; &rarr; &pi;* dengan energi eksitasi rendah. Molekul menyerap kuat foton biru (&sim;446 nm) dan memantulkan spektrum komplementer merah, menghasilkan warna <em>merah segar delima berintensitas tinggi</em>.</p>
      `;
    }
  }

  // Interactive Live LKPD Progress Tracker
  function updateLkpdProgress() {
    const milestones = [
      { id: 'msIdentitas', target: 'lkpd-identitas', check: () => {
        const sch = document.getElementById('schoolName')?.value;
        const grp = document.getElementById('groupName')?.value;
        return (sch && sch.trim().length > 0) || (grp && grp.trim().length > 0);
      }},
      { id: 'msMasalah', target: 'lkpd-masalah', check: () => {
        const val = document.getElementById('txtRumusanMasalah')?.value;
        return val && val.trim().length > 8;
      }},
      { id: 'msHipotesis', target: 'lkpd-hipotesis', check: () => {
        return !!document.querySelector('input[name="hypoTemp"]:checked');
      }},
      { id: 'msTabel', target: 'lkpd-tabel', check: () => {
        const rows = document.querySelectorAll('#tableBodyRows tr');
        let filled = 0;
        rows.forEach(tr => {
          const y = tr.querySelector('.col-yield')?.value;
          if (y && y.trim().length > 0) filled++;
        });
        return filled >= 3;
      }},
      { id: 'msAnalisis', target: 'lkpd-analisis', check: () => {
        const q1 = document.getElementById('txtAnalisis1')?.value;
        return q1 && q1.trim().length > 10;
      }},
      { id: 'msHots', target: 'lkpd-hots', check: () => {
        const h1 = document.getElementById('txtHots1')?.value;
        return h1 && h1.trim().length > 8;
      }},
      { id: 'msKesimpulan', target: 'lkpd-kesimpulan', check: () => {
        const k = document.getElementById('txtKesimpulanAkhir')?.value;
        return k && k.trim().length > 10;
      }}
    ];

    let completed = 0;
    milestones.forEach(m => {
      const el = document.getElementById(m.id);
      const isDone = m.check();
      if (isDone) {
        completed++;
        if (el) el.classList.add('done');
      } else {
        if (el) el.classList.remove('done');
      }
    });

    const percent = Math.round((completed / milestones.length) * 100);
    const badge = document.getElementById('progressCounterBadge');
    const fill = document.getElementById('lkpdProgressBarFill');
    const summary = document.getElementById('progressSummaryText');

    if (badge) {
      badge.textContent = `${percent}% Selesai`;
      badge.classList.toggle('complete', percent === 100);
    }
    if (fill) {
      fill.style.width = `${percent}%`;
    }
    if (summary) {
      summary.textContent = `${completed} dari ${milestones.length} Komponen Utama Terisi`;
    }
  }

  // Celebratory Confetti Particle System for Quiz Mastery
  function triggerCelebrationConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';

    const particles = [];
    const colors = ['#dc2626', '#f59e0b', '#f43f5e', '#b91c1c', '#fbbf24', '#059669'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
        y: window.innerHeight / 2 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.8) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let frameCount = 0;
    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28;
        p.rotation += p.vRot;
        if (frameCount > 60) p.opacity -= 0.015;

        if (p.opacity > 0 && p.y < canvas.height) {
          aliveCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      frameCount++;
      if (aliveCount > 0 && frameCount < 180) {
        requestAnimationFrame(renderConfetti);
      } else {
        canvas.style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(renderConfetti);
  }

  // Draw UV-Vis Absorption Spectrum on Canvas with Academic Styling & Real-time Laser Sweep
  function drawSpectrum(lambdaMax, absVal, scanProgress = 1) {
    if (!canvasSpectrum) return;
    const ctx = canvasSpectrum.getContext('2d');
    const width = canvasSpectrum.width;
    const height = canvasSpectrum.height;

    ctx.clearRect(0, 0, width, height);

    // Margin & Dimensions
    const margin = { top: 22, right: 30, bottom: 35, left: 48 };
    const chartW = width - margin.left - margin.right;
    const chartH = height - margin.top - margin.bottom;

    const minLambda = 380;
    const maxLambda = 620;
    const maxAbs = 1.0;

    // Draw grid lines
    ctx.strokeStyle = '#e6ded3';
    ctx.lineWidth = 1;

    for (let l = 400; l <= 600; l += 50) {
      const x = margin.left + ((l - minLambda) / (maxLambda - minLambda)) * chartW;
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, margin.top + chartH);
      ctx.stroke();

      // Label x
      ctx.fillStyle = '#7d6b6d';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(l.toString(), x, margin.top + chartH + 16);
    }

    for (let a = 0.2; a <= 1.0; a += 0.2) {
      const y = margin.top + chartH - (a / maxAbs) * chartH;
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + chartW, y);
      ctx.stroke();

      // Label y
      ctx.fillStyle = '#7d6b6d';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(a.toFixed(1), margin.left - 7, y + 4);
    }

    // Axes lines
    ctx.strokeStyle = '#211516';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + chartH);
    ctx.lineTo(margin.left + chartW, margin.top + chartH);
    ctx.stroke();

    // Axis titles
    ctx.fillStyle = '#211516';
    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Panjang Gelombang λ (nm)', margin.left + chartW / 2, height - 6);

    ctx.save();
    ctx.translate(14, margin.top + chartH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Absorbansi (A)', 0, 0);
    ctx.restore();

    // Gaussian Curve generation (Brazilein peak profile)
    ctx.beginPath();
    const sigma = 35; // Peak width (FWHM)
    const baseline = 0.04;

    const maxPx = chartW * Math.min(1, Math.max(0, scanProgress));
    let lastPx = 0;
    let lastPy = margin.top + chartH;

    for (let px = 0; px <= maxPx; px += 2) {
      const lambda = minLambda + (px / chartW) * (maxLambda - minLambda);
      const diff = lambda - lambdaMax;
      const gaussian = (absVal - baseline) * Math.exp(-(diff * diff) / (2 * sigma * sigma));
      const calculatedAbs = Math.max(0, gaussian + baseline);

      const py = margin.top + chartH - (calculatedAbs / maxAbs) * chartH;
      lastPx = px;
      lastPy = py;
      if (px === 0) {
        ctx.moveTo(margin.left + px, py);
      } else {
        ctx.lineTo(margin.left + px, py);
      }
    }

    // Curve line stroke
    ctx.strokeStyle = '#8f1525';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Fill area under curve with ruby gradient
    ctx.lineTo(margin.left + lastPx, margin.top + chartH);
    ctx.lineTo(margin.left, margin.top + chartH);
    ctx.closePath();
    const fillGrad = ctx.createLinearGradient(0, margin.top, 0, margin.top + chartH);
    fillGrad.addColorStop(0, 'rgba(143, 21, 37, 0.40)');
    fillGrad.addColorStop(1, 'rgba(143, 21, 37, 0.03)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Peak Marker Dot
    const peakRatio = (lambdaMax - minLambda) / (maxLambda - minLambda);
    const peakX = margin.left + peakRatio * chartW;
    const peakY = margin.top + chartH - (absVal / maxAbs) * chartH;

    if (scanProgress >= peakRatio) {
      ctx.fillStyle = '#aa1b2d';
      ctx.beginPath();
      ctx.arc(peakX, peakY, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Peak callout badge
      ctx.fillStyle = '#480a11';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`λ maks = ${lambdaMax} nm (A = ${absVal.toFixed(3)})`, peakX, Math.max(margin.top + 14, peakY - 12));
    }

    // Laser scan sweep line during scan animation
    if (scanProgress < 1 && scanProgress > 0) {
      const laserX = margin.left + maxPx;
      const laserGrad = ctx.createLinearGradient(laserX, margin.top, laserX, margin.top + chartH);
      laserGrad.addColorStop(0, 'rgba(6, 182, 212, 0.95)');
      laserGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.9)');
      laserGrad.addColorStop(1, 'rgba(6, 182, 212, 0.1)');

      ctx.save();
      ctx.strokeStyle = laserGrad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(laserX, margin.top);
      ctx.lineTo(laserX, margin.top + chartH);
      ctx.stroke();

      // Laser dot on current curve position
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(laserX, lastPy, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function animateSpectrumLaserSweep(lambdaMax, absVal) {
    if (!canvasSpectrum) return;
    let scanPercent = 0;
    const startTime = performance.now();
    const duration = 1100; // 1.1s smooth sweep

    function frame(now) {
      const elapsed = now - startTime;
      scanPercent = Math.min(1, elapsed / duration);
      drawSpectrum(lambdaMax, absVal, scanPercent);
      if (scanPercent < 1) {
        requestAnimationFrame(frame);
      }
    }
    requestAnimationFrame(frame);
  }

  // Update mordant fabric swatches
  function updateSwatches(baseHex) {
    const swatchPlain = document.getElementById('swatchPlain');
    const swatchAlum = document.getElementById('swatchAlum');
    const swatchLime = document.getElementById('swatchLime');
    const swatchAcid = document.getElementById('swatchAcid');

    if (swatchPlain) swatchPlain.style.backgroundColor = baseHex;
    if (swatchAlum) swatchAlum.style.backgroundColor = '#f43f5e';
    if (swatchLime) swatchLime.style.backgroundColor = '#831843';
    if (swatchAcid) swatchAcid.style.backgroundColor = '#f59e0b';
  }

  // Interactive mordant testing function with Custom Academic Modal & Dipping Studio
  function testMordant(type) {
    const sim = getSimulatedValues(currentTemp, currentSolvent);
    let title = '';
    let desc = '';
    let colorHex = '';
    let colorName = '';
    let fastnessPercent = 85;
    let fastnessLabel = 'Skala 4-5 (Sangat Baik)';
    let chemFormula = '';

    if (type === 'plain') {
      title = 'Pewarnaan Tanpa Mordan (Kontrol)';
      desc = `Warna kain mori secara langsung mengikuti sifat fisik ekstrak hasil ekstraksi Anda (${sim.name}). Molekul pigmen hanya menempel secara adsorpsi fisika pada pori serat selulosa tanpa ikatan koordinasi logam, sehingga memiliki ketahanan luntur pencucian yang sangat rendah.`;
      colorHex = sim.hex;
      colorName = sim.name;
      fastnessPercent = 25;
      fastnessLabel = 'Skala 1-2 (Rendah / Mudah Luntur)';
      chemFormula = 'Interaksi: Serat-Selulosa ••• Brazilein (Gaya Van der Waals Lemah)';
    } else if (type === 'alum') {
      title = 'Fiksasi Mordan Tawas (Al³⁺)';
      desc = 'Ion aluminium (Al³⁺) dari tawas kalium sulfat bertindak sebagai asam Lewis multivalent. Terjadi reaksi pembentukan kompleks khelat koordinasi antara ion Al³⁺ dengan pasangan elektron bebas pada gugus fenolik dan karbonil kuinon brazilein. Ikatan jembatan ini mengunci molekul pewarna pada rantai selulosa kain mori, menghasilkan rona merah muda cerah yang tahan lama terhadap paparan sinar matahari dan pencucian berulang.';
      colorHex = '#f43f5e';
      colorName = 'Merah Muda Cerah Awet (Pink Krasak Batik)';
      fastnessPercent = 90;
      fastnessLabel = 'Skala 4-5 (Sangat Baik / Tahan Cuci)';
      chemFormula = 'Reaksi: Al³⁺ + 2 Brazilein ⇄ [Al(Brazilein)₂]⁺ (Khelat Koordinasi Oktahedral)';
    } else if (type === 'lime') {
      title = 'Fiksasi Mordan Air Kapur Sirih (Ca(OH)₂)';
      desc = 'Suasana basa dari ion hidroksida (OH⁻) memicu deprotonasi gugus fenol brazilein menjadi ion fenolat. Terjadi delokalisasi elektron pi (π) yang lebih luas melintasi cincin kuinon (efek batokromik), menggeser serapan foton ke panjang gelombang lebih panjang. Kain batik mori menghasilkan warna merah tua keunguan (maroon pekat) yang eksotis dan sakral khas kain keraton.';
      colorHex = '#831843';
      colorName = 'Merah Tua Keunguan (Maroon Klasik Keraton)';
      fastnessPercent = 80;
      fastnessLabel = 'Skala 4 (Baik / Tahan Sinar)';
      chemFormula = 'Reaksi: Ca²⁺ + 2 Brazilein⁻ ⇄ Ca(Brazilein)₂ (Efek Batokromik Basa)';
    } else if (type === 'acid') {
      title = 'Uji Kepekaan Asam (Air Perasan Jeruk Nipis)';
      desc = 'Penambahan asam sitrat mendonorkan proton (H⁺) ke dalam larutan sehingga gugus kromofor kuinon brazilein terprotonasi kembali. Fenomena ini mengurangi kerapatan delokalisasi elektron pi, menyebabkan pergeseran hipsokromik (blue shift) ke panjang gelombang lebih pendek. Kain berubah warna menjadi kuning jingga muda terang.';
      colorHex = '#f59e0b';
      colorName = 'Kuning Jingga Muda Terang';
      fastnessPercent = 45;
      fastnessLabel = 'Skala 2-3 (Sensitif Terhadap pH Asam)';
      chemFormula = 'Reaksi: Brazilein + H⁺ ⇄ [Brazilein-H]⁺ (Pergeseran Hipsokromik / Blue Shift)';
    }

    playTone(440, 'sine', 0.12, 0.05);

    if (mordantModalOverlay && modalTitle && modalDesc && modalSwatch && modalColorName) {
      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modalSwatch.style.backgroundColor = colorHex;
      modalColorName.textContent = colorName;

      if (modalDipLiquid) modalDipLiquid.style.backgroundColor = colorHex;
      if (modalClothStrip) {
        modalClothStrip.style.background = `linear-gradient(180deg, #fdfbf7 25%, ${colorHex} 85%)`;
      }
      if (modalFastnessFill) modalFastnessFill.style.width = `${fastnessPercent}%`;
      if (modalFastnessScore) modalFastnessScore.textContent = fastnessLabel;
      if (modalChemEquation) modalChemEquation.textContent = chemFormula;

      mordantModalOverlay.classList.add('active');
    }
  }

  // --- INTERACTIVE LKPD OBSERVATION TABLE & CHART LOGIC ---

  // Recalculate % Rendemen for a specific table row: (Extract Weight / Simplisia Weight) * 100%
  function recalculateRowYield(tr) {
    if (!tr) return;
    const simplisiaInp = tr.querySelector('.col-simplisia');
    const extractInp = tr.querySelector('.col-extract');
    const yieldInp = tr.querySelector('.col-yield');

    if (simplisiaInp && extractInp && yieldInp) {
      const sVal = parseFloat(simplisiaInp.value.replace(/[^0-9.]/g, ''));
      const eVal = parseFloat(extractInp.value.replace(/[^0-9.]/g, ''));
      if (!isNaN(sVal) && !isNaN(eVal) && sVal > 0) {
        const yieldPercent = ((eVal / sVal) * 100).toFixed(2);
        yieldInp.value = `${yieldPercent}%`;
      }
    }
  }

  // Draw Temperature vs Absorbance (A) & Rendemen (%) curve directly in the LKPD sheet
  function drawLkpdTempChart(isPrintMode = false) {
    const canvas = document.getElementById('lkpdTempChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Handle high DPI (Retina displays or ultra-crisp A4 print)
    const dpr = isPrintMode ? 2.5 : (window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    const displayWidth = rect.width > 0 ? rect.width : 700;
    const displayHeight = isPrintMode ? 190 : 230;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    ctx.scale(dpr, dpr);

    const width = displayWidth;
    const height = displayHeight;

    ctx.clearRect(0, 0, width, height);

    // Read data points from the observation table
    const points = [];
    if (tableBodyRows) {
      tableBodyRows.querySelectorAll('tr').forEach(tr => {
        const tempInput = tr.querySelector('.col-temp');
        const absInput = tr.querySelector('.col-abs');
        const yieldInput = tr.querySelector('.col-yield');

        const tempVal = parseFloat(tempInput?.value);
        const absVal = parseFloat(absInput?.value);
        let yieldVal = parseFloat(yieldInput?.value);
        if (isNaN(yieldVal) && yieldInput?.value) {
          yieldVal = parseFloat(yieldInput.value.replace('%', ''));
        }

        if (!isNaN(tempVal) && !isNaN(absVal)) {
          points.push({
            temp: tempVal,
            abs: absVal,
            yieldVal: !isNaN(yieldVal) ? yieldVal : 0
          });
        }
      });
    }

    // Sort chronologically by temperature
    points.sort((a, b) => a.temp - b.temp);

    // Margins & Dimensions
    const m = isPrintMode 
      ? { top: 24, right: 50, bottom: 32, left: 48 }
      : { top: 28, right: 55, bottom: 38, left: 52 };
    const cw = width - m.left - m.right;
    const ch = height - m.top - m.bottom;

    // Background fill (pure white on print for crisp output)
    ctx.fillStyle = isPrintMode ? '#ffffff' : '#fdfbf7';
    ctx.fillRect(m.left, m.top, cw, ch);

    // Axis limits
    const minT = 30;
    const maxT = 110;
    const maxAbs = 1.0;
    const maxYield = 20.0; // right axis max 20%

    // Coordinates mapping
    const getX = (t) => m.left + ((t - minT) / (maxT - minT)) * cw;
    const getYAbs = (a) => m.top + ch - (Math.min(Math.max(a, 0), maxAbs) / maxAbs) * ch;
    const getYYield = (y) => m.top + ch - (Math.min(Math.max(y, 0), maxYield) / maxYield) * ch;

    // Draw horizontal grid lines
    ctx.strokeStyle = isPrintMode ? '#dcd6cb' : '#ebe3d7';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);

    for (let a = 0.2; a <= 1.0; a += 0.2) {
      const y = getYAbs(a);
      ctx.beginPath();
      ctx.moveTo(m.left, y);
      ctx.lineTo(m.left + cw, y);
      ctx.stroke();

      // Left axis label (Absorbance)
      ctx.fillStyle = '#475569';
      ctx.font = isPrintMode ? '9px "JetBrains Mono", monospace' : '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(a.toFixed(1), m.left - 6, y);

      // Right axis label (Yield %)
      const yPercent = (a * maxYield).toFixed(0) + '%';
      ctx.fillStyle = '#b45309';
      ctx.textAlign = 'left';
      ctx.fillText(yPercent, m.left + cw + 6, y);
    }

    // Base line (Y = 0)
    const y0 = getYAbs(0);
    ctx.strokeStyle = '#c5b9a8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(m.left, y0);
    ctx.lineTo(m.left + cw, y0);
    ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.textAlign = 'right';
    ctx.fillText('0.0', m.left - 6, y0);
    ctx.fillStyle = '#b45309';
    ctx.textAlign = 'left';
    ctx.fillText('0%', m.left + cw + 6, y0);

    // Vertical grid lines for temperature (40°C to 100°C)
    for (let t = 40; t <= 100; t += 10) {
      const x = getX(t);
      ctx.strokeStyle = isPrintMode ? '#ebe4d8' : '#f1eae0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, m.top);
      ctx.lineTo(x, m.top + ch);
      ctx.stroke();

      // X-axis label
      ctx.fillStyle = '#334155';
      ctx.font = isPrintMode ? '9.5px "Plus Jakarta Sans", sans-serif' : '11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`${t}°C`, x, m.top + ch + 5);
    }

    // Axis titles
    ctx.save();
    ctx.fillStyle = '#8f1525';
    ctx.font = isPrintMode ? 'bold 9px "Plus Jakarta Sans", sans-serif' : 'bold 10px "Plus Jakarta Sans", sans-serif';
    ctx.translate(14, m.top + ch / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Absorbansi (A)', 0, 0);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#b45309';
    ctx.font = isPrintMode ? 'bold 9px "Plus Jakarta Sans", sans-serif' : 'bold 10px "Plus Jakarta Sans", sans-serif';
    ctx.translate(width - 12, m.top + ch / 2);
    ctx.rotate(Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Rendemen (%)', 0, 0);
    ctx.restore();

    ctx.fillStyle = '#334155';
    ctx.font = isPrintMode ? 'bold 9px "Plus Jakarta Sans", sans-serif' : 'bold 10px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Suhu Ekstraksi Termostatik (°C)', m.left + cw / 2, height - (isPrintMode ? 6 : 8));

    if (points.length >= 2) {
      // 1. Draw Rendemen Curve (Amber Gold, dashed)
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      points.forEach((p, i) => {
        const x = getX(p.temp);
        const y = getYYield(p.yieldVal);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Rendemen point markers (squares)
      points.forEach(p => {
        const x = getX(p.temp);
        const y = getYYield(p.yieldVal);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.fillRect(x - 3, y - 3, 6, 6);
        ctx.strokeRect(x - 3, y - 3, 6, 6);
      });

      // 2. Draw Absorbance Area & Curve (Brazilein Red)
      const grad = ctx.createLinearGradient(0, m.top, 0, m.top + ch);
      grad.addColorStop(0, 'rgba(197, 36, 57, 0.16)');
      grad.addColorStop(1, 'rgba(197, 36, 57, 0.01)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(getX(points[0].temp), getYAbs(0));
      points.forEach(p => {
        ctx.lineTo(getX(p.temp), getYAbs(p.abs));
      });
      ctx.lineTo(getX(points[points.length - 1].temp), getYAbs(0));
      ctx.closePath();
      ctx.fill();

      // Stroke Absorbance line
      ctx.strokeStyle = '#c52439';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      points.forEach((p, i) => {
        const x = getX(p.temp);
        const y = getYAbs(p.abs);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw Absorbance point markers (circles) & find max
      let maxP = points[0];
      points.forEach(p => {
        if (p.abs > maxP.abs) maxP = p;
        const x = getX(p.temp);
        const y = getYAbs(p.abs);
        ctx.fillStyle = '#c52439';
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // Highlight peak point (Optimum)
      if (maxP) {
        const mx = getX(maxP.temp);
        const my = getYAbs(maxP.abs);

        // Halo ring
        ctx.beginPath();
        ctx.arc(mx, my, 7, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(197, 36, 57, 0.45)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Annotation banner
        const tagText = `Puncak Optimum: ${maxP.temp}°C (A = ${maxP.abs.toFixed(3)})`;
        ctx.font = isPrintMode ? 'bold 8.5px "Plus Jakarta Sans", sans-serif' : 'bold 9.5px "Plus Jakarta Sans", sans-serif';
        const tagW = ctx.measureText(tagText).width + 10;
        const tagX = Math.min(Math.max(mx - tagW / 2, m.left + 5), m.left + cw - tagW - 5);
        const tagY = my - 20;

        ctx.fillStyle = '#8f1525';
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(tagX, tagY, tagW, 16, 2);
        } else {
          ctx.rect(tagX, tagY, tagW, 16);
        }
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tagText, tagX + tagW / 2, tagY + 8);
      }
    }

    // Legend at Top Left
    const legX = m.left + 8;
    const legY = m.top - 14;

    // Absorbance legend item
    ctx.strokeStyle = '#c52439';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(legX, legY);
    ctx.lineTo(legX + 14, legY);
    ctx.stroke();

    ctx.fillStyle = '#c52439';
    ctx.beginPath();
    ctx.arc(legX + 7, legY, 2.5, 0, Math.PI * 2);
    ctx.fill();

    const firstLambda = tableBodyRows?.querySelector('.col-lambda')?.value?.trim();
    const lambdaLabel = firstLambda ? `λ ${firstLambda} nm` : 'λ maks';
    ctx.fillText(`Absorbansi (A, ${lambdaLabel})`, legX + 18, legY);

    // Yield legend item
    const legX2 = legX + 145;
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(legX2, legY);
    ctx.lineTo(legX2 + 14, legY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.2;
    ctx.fillRect(legX2 + 4, legY - 2.5, 5, 5);
    ctx.strokeRect(legX2 + 4, legY - 2.5, 5, 5);

    ctx.fillStyle = '#1e293b';
    ctx.fillText('Rendemen Ekstrak (%)', legX2 + 18, legY);
  }

  // Update all textarea print mirror divs so student answers print completely without scrollbars
  function updateTextareaPrintMirrors() {
    const textareas = document.querySelectorAll('#tab-lkpd textarea');
    textareas.forEach(ta => {
      let mirror = ta.nextElementSibling;
      if (!mirror || !mirror.classList.contains('print-textarea-mirror')) {
        mirror = document.createElement('div');
        mirror.className = 'print-textarea-mirror';
        ta.parentNode.insertBefore(mirror, ta.nextSibling);
      }

      const val = ta.value.trim();
      if (val.length > 0) {
        mirror.textContent = val;
        mirror.classList.remove('print-textarea-empty');
      } else {
        mirror.textContent = '';
        mirror.classList.add('print-textarea-empty');
      }
    });
  }

  // Dedicated High-Fidelity A4 Print & PDF Exporter
  function prepareAndPrintLkpd() {
    const lkpdTab = document.querySelector('.nav-tab[data-tab="tab-lkpd"]');
    if (lkpdTab && !lkpdTab.classList.contains('active')) {
      lkpdTab.click();
    }

    // Check student identity fields and notify if empty
    const studentGroup = document.getElementById('studentGroup')?.value?.trim();
    const studentClass = document.getElementById('studentClass')?.value?.trim();
    const studentMembers = document.getElementById('studentMembers')?.value?.trim();

    if (!studentGroup && !studentMembers) {
      showToast('Peringatan: Identitas kelompok praktikan belum lengkap! Disarankan mengisi pada Bagian A sebelum mencetak.', 4000);
    }

    updateTextareaPrintMirrors();
    drawLkpdTempChart(true);

    setTimeout(() => {
      window.print();
    }, 200);
  }

  // Transfer Virtual Lab result to LKPD observation table
  function transferResultToLKPD() {
    const sim = getSimulatedValues(currentTemp, currentSolvent);
    const solventLabel = currentSolvent === 'water' ? 'Akuades' : 'Bio-Etanol 50%';
    const simplisia = 10.0;
    const extractWeight = ((simplisia * sim.yieldVal) / 100).toFixed(3);

    const tr = document.createElement('tr');
    const rowCount = tableBodyRows.querySelectorAll('tr').length + 1;
    tr.innerHTML = `
      <td>${rowCount}</td>
      <td><input type="text" class="table-input" value="${solventLabel}"></td>
      <td><input type="number" class="table-input col-temp" value="${sim.temp}"></td>
      <td><input type="text" class="table-input col-simplisia" value="${simplisia.toFixed(2)}"></td>
      <td><input type="text" class="table-input col-extract" value="${extractWeight}"></td>
      <td><input type="text" class="table-input col-yield" value="${sim.yieldVal}%" readonly style="background:#fafafa; font-weight:700;"></td>
      <td><input type="text" class="table-input col-lambda" value="${sim.lambda}"></td>
      <td><input type="text" class="table-input col-abs" value="${sim.abs.toFixed(3)}"></td>
      <td><span class="color-preview-chip" style="background:${sim.hex};"></span>${sim.name}</td>
    `;
    tableBodyRows.appendChild(tr);

    recalculateRowYield(tr);
    drawLkpdTempChart();
    saveFormToStorage();
    showToast(`Data uji ${sim.temp}°C (${solventLabel}) disalin ke Tabel LKPD`);
  }

  // Add new experimental row
  function addTableRow() {
    if (!tableBodyRows) return;
    const rows = tableBodyRows.querySelectorAll('tr');
    const rowNum = rows.length + 1;
    const lastRow = rows[rows.length - 1];
    let nextTemp = 60;
    if (lastRow) {
      const lastTempInp = lastRow.querySelector('.col-temp');
      const lastTemp = parseInt(lastTempInp?.value);
      if (!isNaN(lastTemp)) nextTemp = Math.min(lastTemp + 10, 100);
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${rowNum}</td>
      <td><input type="text" class="table-input" value="Akuades"></td>
      <td><input type="number" class="table-input col-temp" value="${nextTemp}"></td>
      <td><input type="text" class="table-input col-simplisia" value="10.00"></td>
      <td><input type="text" class="table-input col-extract" value="1.000"></td>
      <td><input type="text" class="table-input col-yield" value="10.00%" readonly style="background:#fafafa; font-weight:700;"></td>
      <td><input type="text" class="table-input col-lambda" value="446"></td>
      <td><input type="text" class="table-input col-abs" value="0.500"></td>
      <td><span class="color-preview-chip" style="background:#ea580c;"></span>Merah jingga</td>
    `;
    tableBodyRows.appendChild(tr);
    recalculateRowYield(tr);
    drawLkpdTempChart();
    saveFormToStorage();
    showToast(`Baris ke-${rowNum} berhasil ditambahkan`);
  }

  // Remove last experimental row
  function removeTableRow() {
    if (!tableBodyRows) return;
    const rows = tableBodyRows.querySelectorAll('tr');
    if (rows.length <= 1) {
      showToast('Minimal harus ada 1 baris data percobaan!');
      return;
    }
    const lastRow = rows[rows.length - 1];
    lastRow.remove();
    drawLkpdTempChart();
    saveFormToStorage();
    showToast('Baris data terakhir dihapus');
  }

  // Fill default authentic research data into the table
  function fillEmpiricalSampleData() {
    tableBodyRows.innerHTML = `
      <tr>
        <td>1</td>
        <td><input type="text" class="table-input" value="Akuades"></td>
        <td><input type="number" class="table-input col-temp" value="40"></td>
        <td><input type="text" class="table-input col-simplisia" value="10.00"></td>
        <td><input type="text" class="table-input col-extract" value="0.845"></td>
        <td><input type="text" class="table-input col-yield" value="8.45%" readonly style="background:#fafafa; font-weight:700;"></td>
        <td><input type="text" class="table-input col-lambda" value="443"></td>
        <td><input type="text" class="table-input col-abs" value="0.420"></td>
        <td><span class="color-preview-chip" style="background:#f59e0b;"></span>Kuning jingga terang</td>
      </tr>
      <tr>
        <td>2</td>
        <td><input type="text" class="table-input" value="Akuades"></td>
        <td><input type="number" class="table-input col-temp" value="50"></td>
        <td><input type="text" class="table-input col-simplisia" value="10.00"></td>
        <td><input type="text" class="table-input col-extract" value="1.120"></td>
        <td><input type="text" class="table-input col-yield" value="11.20%" readonly style="background:#fafafa; font-weight:700;"></td>
        <td><input type="text" class="table-input col-lambda" value="445"></td>
        <td><input type="text" class="table-input col-abs" value="0.610"></td>
        <td><span class="color-preview-chip" style="background:#ea580c;"></span>Jingga kemerahan</td>
      </tr>
      <tr>
        <td>3</td>
        <td><input type="text" class="table-input" value="Akuades"></td>
        <td><input type="number" class="table-input col-temp" value="60"></td>
        <td><input type="text" class="table-input col-simplisia" value="10.00"></td>
        <td><input type="text" class="table-input col-extract" value="1.385"></td>
        <td><input type="text" class="table-input col-yield" value="13.85%" readonly style="background:#fafafa; font-weight:700;"></td>
        <td><input type="text" class="table-input col-lambda" value="446"></td>
        <td><input type="text" class="table-input col-abs" value="0.782"></td>
        <td><span class="color-preview-chip" style="background:#c52439;"></span><strong>Merah segar delima (Optimum)</strong></td>
      </tr>
      <tr>
        <td>4</td>
        <td><input type="text" class="table-input" value="Akuades"></td>
        <td><input type="number" class="table-input col-temp" value="70"></td>
        <td><input type="text" class="table-input col-simplisia" value="10.00"></td>
        <td><input type="text" class="table-input col-extract" value="1.410"></td>
        <td><input type="text" class="table-input col-yield" value="14.10%" readonly style="background:#fafafa; font-weight:700;"></td>
        <td><input type="text" class="table-input col-lambda" value="448"></td>
        <td><input type="text" class="table-input col-abs" value="0.720"></td>
        <td><span class="color-preview-chip" style="background:#8f1525;"></span>Merah agak gelap</td>
      </tr>
      <tr>
        <td>5</td>
        <td><input type="text" class="table-input" value="Akuades"></td>
        <td><input type="number" class="table-input col-temp" value="80"></td>
        <td><input type="text" class="table-input col-simplisia" value="10.00"></td>
        <td><input type="text" class="table-input col-extract" value="1.320"></td>
        <td><input type="text" class="table-input col-yield" value="13.20%" readonly style="background:#fafafa; font-weight:700;"></td>
        <td><input type="text" class="table-input col-lambda" value="452"></td>
        <td><input type="text" class="table-input col-abs" value="0.640"></td>
        <td><span class="color-preview-chip" style="background:#5c0d17;"></span>Merah kecokelatan kusam</td>
      </tr>
    `;
    drawLkpdTempChart();
    saveFormToStorage();
    showToast('Data empiris laboratorium UNNES berhasil dimuat');
  }

  // Fill authentic blueprint data from Prototyping 1 PDF (40°C–100°C, λ 530 nm, Puncak 80°C)
  function fillPdfSampleData() {
    tableBodyRows.innerHTML = `
      <tr>
        <td>1</td>
        <td><input type="text" class="table-input" value="Akuades"></td>
        <td><input type="number" class="table-input col-temp" value="40"></td>
        <td><input type="text" class="table-input col-simplisia" value="10.00"></td>
        <td><input type="text" class="table-input col-extract" value="0.720"></td>
        <td><input type="text" class="table-input col-yield" value="7.20%" readonly style="background:#fafafa; font-weight:700;"></td>
        <td><input type="text" class="table-input col-lambda" value="530"></td>
        <td><input type="text" class="table-input col-abs" value="0.285"></td>
        <td><span class="color-preview-chip" style="background:#fca5a5;"></span>Merah muda kekuningan pudar</td>
      </tr>
      <tr>
        <td>2</td>
        <td><input type="text" class="table-input" value="Akuades"></td>
        <td><input type="number" class="table-input col-temp" value="50"></td>
        <td><input type="text" class="table-input col-simplisia" value="10.00"></td>
        <td><input type="text" class="table-input col-extract" value="0.950"></td>
        <td><input type="text" class="table-input col-yield" value="9.50%" readonly style="background:#fafafa; font-weight:700;"></td>
        <td><input type="text" class="table-input col-lambda" value="530"></td>
        <td><input type="text" class="table-input col-abs" value="0.442"></td>
        <td><span class="color-preview-chip" style="background:#f87171;"></span>Merah jingga sedang</td>
      </tr>
      <tr>
        <td>3</td>
        <td><input type="text" class="table-input" value="Akuades"></td>
        <td><input type="number" class="table-input col-temp" value="60"></td>
        <td><input type="text" class="table-input col-simplisia" value="10.00"></td>
        <td><input type="text" class="table-input col-extract" value="1.180"></td>
        <td><input type="text" class="table-input col-yield" value="11.80%" readonly style="background:#fafafa; font-weight:700;"></td>
        <td><input type="text" class="table-input col-lambda" value="530"></td>
        <td><input type="text" class="table-input col-abs" value="0.650"></td>
        <td><span class="color-preview-chip" style="background:#ef4444;"></span>Merah cerah</td>
      </tr>
      <tr>
        <td>4</td>
        <td><input type="text" class="table-input" value="Akuades"></td>
        <td><input type="number" class="table-input col-temp" value="70"></td>
        <td><input type="text" class="table-input col-simplisia" value="10.00"></td>
        <td><input type="text" class="table-input col-extract" value="1.420"></td>
        <td><input type="text" class="table-input col-yield" value="14.20%" readonly style="background:#fafafa; font-weight:700;"></td>
        <td><input type="text" class="table-input col-lambda" value="530"></td>
        <td><input type="text" class="table-input col-abs" value="0.810"></td>
        <td><span class="color-preview-chip" style="background:#dc2626;"></span>Merah tua jernih</td>
      </tr>
      <tr>
        <td>5</td>
        <td><input type="text" class="table-input" value="Akuades"></td>
        <td><input type="number" class="table-input col-temp" value="80"></td>
        <td><input type="text" class="table-input col-simplisia" value="10.00"></td>
        <td><input type="text" class="table-input col-extract" value="1.600"></td>
        <td><input type="text" class="table-input col-yield" value="16.00%" readonly style="background:#fafafa; font-weight:700;"></td>
        <td><input type="text" class="table-input col-lambda" value="530"></td>
        <td><input type="text" class="table-input col-abs" value="0.895"></td>
        <td><span class="color-preview-chip" style="background:#991b1b;"></span><strong>Merah ruby intens (Puncak Optimum)</strong></td>
      </tr>
      <tr>
        <td>6</td>
        <td><input type="text" class="table-input" value="Akuades"></td>
        <td><input type="number" class="table-input col-temp" value="90"></td>
        <td><input type="text" class="table-input col-simplisia" value="10.00"></td>
        <td><input type="text" class="table-input col-extract" value="1.350"></td>
        <td><input type="text" class="table-input col-yield" value="13.50%" readonly style="background:#fafafa; font-weight:700;"></td>
        <td><input type="text" class="table-input col-lambda" value="530"></td>
        <td><input type="text" class="table-input col-abs" value="0.720"></td>
        <td><span class="color-preview-chip" style="background:#7f1d1d;"></span>Merah gelap kecokelatan</td>
      </tr>
      <tr>
        <td>7</td>
        <td><input type="text" class="table-input" value="Akuades"></td>
        <td><input type="number" class="table-input col-temp" value="100"></td>
        <td><input type="text" class="table-input col-simplisia" value="10.00"></td>
        <td><input type="text" class="table-input col-extract" value="1.020"></td>
        <td><input type="text" class="table-input col-yield" value="10.20%" readonly style="background:#fafafa; font-weight:700;"></td>
        <td><input type="text" class="table-input col-lambda" value="530"></td>
        <td><input type="text" class="table-input col-abs" value="0.510"></td>
        <td><span class="color-preview-chip" style="background:#451a03;"></span>Cokelat kemerahan gelap/kusam (Degradasi)</td>
      </tr>
    `;
    drawLkpdTempChart();
    saveFormToStorage();
    showToast('Data rujukan blueprint (λ=530 nm, Suhu 40°C–100°C) berhasil dimuat');
  }

  // --- LOCAL STORAGE AUTO-SAVE ---
  const STORAGE_KEY = 'SECANG_LKPD_STUDENT_DATA_V2';

  function saveFormToStorage() {
    const inputs = document.querySelectorAll('#tab-lkpd input:not([type="file"]), #tab-lkpd textarea');
    const data = {};
    inputs.forEach(el => {
      if (el.id) {
        if (el.type === 'checkbox') {
          data[el.id] = el.checked;
        } else {
          data[el.id] = el.value;
        }
      }
    });

    // Save table rows
    const rows = [];
    if (tableBodyRows) {
      tableBodyRows.querySelectorAll('tr').forEach(tr => {
        const rowInputs = tr.querySelectorAll('input');
        if (rowInputs.length > 0) {
          rows.push({
            solvent: rowInputs[0]?.value || '',
            temp: rowInputs[1]?.value || '',
            simplisia: rowInputs[2]?.value || '',
            extract: rowInputs[3]?.value || '',
            yield: rowInputs[4]?.value || '',
            lambda: rowInputs[5]?.value || '',
            abs: rowInputs[6]?.value || '',
            desc: tr.cells[8]?.textContent?.trim() || ''
          });
        }
      });
    }
    data._tableRows = rows;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    const saveStatus = document.getElementById('saveStatus');
    if (saveStatus) {
      saveStatus.textContent = `Tersimpan (${new Date().toLocaleTimeString('id-ID')})`;
    }
  }

  function loadFormFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      drawLkpdTempChart();
      return;
    }
    try {
      const data = JSON.parse(saved);
      Object.keys(data).forEach(id => {
        if (id === '_tableRows') {
          if (data._tableRows && data._tableRows.length > 0 && tableBodyRows) {
            tableBodyRows.innerHTML = '';
            data._tableRows.forEach((r, idx) => {
              const tr = document.createElement('tr');
              tr.innerHTML = `
                <td>${idx + 1}</td>
                <td><input type="text" class="table-input" value="${r.solvent}"></td>
                <td><input type="number" class="table-input col-temp" value="${r.temp}"></td>
                <td><input type="text" class="table-input col-simplisia" value="${r.simplisia}"></td>
                <td><input type="text" class="table-input col-extract" value="${r.extract}"></td>
                <td><input type="text" class="table-input col-yield" value="${r.yield}" readonly style="background:#fafafa; font-weight:700;"></td>
                <td><input type="text" class="table-input col-lambda" value="${r.lambda}"></td>
                <td><input type="text" class="table-input col-abs" value="${r.abs}"></td>
                <td>${r.desc}</td>
              `;
              tableBodyRows.appendChild(tr);
            });
          }
        } else {
          const el = document.getElementById(id);
          if (el) {
            if (el.type === 'checkbox') {
              el.checked = Boolean(data[id]);
            } else {
              el.value = data[id];
            }
          }
        }
      });
      drawLkpdTempChart();
    } catch (e) {
      console.warn('Could not parse saved LKPD data', e);
      drawLkpdTempChart();
    }
  }

  // Export LKPD as JSON file
  function exportLkpdJson() {
    saveFormToStorage();
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      showToast('Belum ada data isian LKPD untuk diekspor!');
      return;
    }
    const data = JSON.parse(saved);
    const groupName = (data.studentGroup || 'Kelompok').replace(/[^a-zA-Z0-9_-]/g, '_');
    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `LKPD_Secang_${groupName}_${dateStr}.json`;

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Data LKPD berhasil dicadangkan sebagai ${fileName}`);
  }

  // Import LKPD from JSON file
  function importLkpdJson(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(importedData));
        loadFormFromStorage();
        showToast('Data LKPD berhasil dipulihkan dari berkas cadangan!');
      } catch (err) {
        showToast('Gagal memuat berkas: Format JSON tidak valid');
        console.error(err);
      }
    };
    reader.readAsText(file);
  }

  function resetForm() {
    if (confirm('Apakah Anda yakin ingin mengosongkan seluruh isian Lembar Kerja Peserta Didik (LKPD)?')) {
      localStorage.removeItem(STORAGE_KEY);
      document.querySelectorAll('#tab-lkpd input:not(.table-input):not([type="file"]), #tab-lkpd textarea').forEach(el => el.value = '');
      fillEmpiricalSampleData();
      showToast('Form LKPD telah diatur ulang ke kondisi awal');
    }
  }

  // --- QUIZ & EVALUATION MODULE ---
  const quizData = [
    {
      question: '1. Berdasarkan data eksperimen spektrofotometri UV-Vis, mengapa suhu 60&deg;C ditetapkan sebagai suhu ekstraksi optimum untuk pigmen kayu secang dengan pelarut akuades?',
      options: [
        'A. Karena pada suhu 60&deg;C simplisia kayu secang mulai larut seutuhnya ke dalam air.',
        'B. Karena menghasilkan absorbansi pigmen brazilein tertinggi (<em>A</em> = 0,782) dan warna merah paling segar tanpa memicu degradasi termolabil.',
        'C. Karena pada suhu 60&deg;C pelarut air mendidih sehingga laju difusi Fick mencapai nilai tak terhingga.',
        'D. Karena pada suhu 60&deg;C molekul brazilin berubah menjadi asam sitrat yang menstabilkan warna.'
      ],
      correct: 1,
      explanation: 'Tepat! Pada 60&deg;C, energi kinetik telah memadai untuk mendifusikan pigmen brazilin dan memfasilitasi oksidasi menjadi brazilein (<em>A</em> = 0,782), namun belum mencapai batas energi aktivasi dekomposisi termal cincin kuinon.'
    },
    {
      question: '2. Mengapa perebusan yang terlalu mendidih (100&deg;C) dalam waktu lama menyebabkan ekstrak berubah menjadi "cokelat butek" dan nilai absorbansi menurun drastis?',
      options: [
        'A. Terjadi pemutusan cincin piran (termolabilitas) pada brazilein dan polimerisasi kondensasi fenolik menjadi pigmen cokelat tak aktif.',
        'B. Pelarut air habis menguap dan kristal kayu secang mengendap di dasar beker.',
        'C. Terjadi reduksi spontan brazilein menjadi gas oksigen.',
        'D. Cahaya matahari menguraikan ion kalsium di dalam rebusan.'
      ],
      correct: 0,
      explanation: 'Tepat! Pemanasan berlebih di atas 80&deg;C memberikan energi termal berlebih yang memecah cincin heterosiklik piran (termolabil) brazilein, memicu kondensasi dan degradasi menjadi turunan fenolik cokelat kusam.'
    },
    {
      question: '3. Bagaimanakah mekanisme kimia fiksasi mordan tawas (KAl(SO<sub>4</sub>)<sub>2</sub>&middot;12H<sub>2</sub>O) dalam mempertahankan kecerahan warna merah pada kain batik?',
      options: [
        'A. Ion Al<sup>3+</sup> mengikat serat kain dan memutihkan warna serat.',
        'B. Ion Al<sup>3+</sup> membentuk kompleks khelat koordinasi dengan gugus fenolik dan karbonil brazilein, mengunci pigmen pada serat selulosa.',
        'C. Ion sulfat melarutkan kembali brazilin agar mudah menguap ke udara.',
        'D. Tawas menaikkan pH larutan menjadi basa kuat sehingga terjadi efek batokromik.'
      ],
      correct: 1,
      explanation: 'Tepat! Ion logam Al<sup>3+</sup> bertindak sebagai asam Lewis multivalent yang membentuk ikatan koordinasi kelat dengan gugus donor elektron pada brazilein, menciptakan ikatan jembatan kuat dengan serat mori.'
    },
    {
      question: '4. Apa yang mendasari transformasi warna dari kuning pucat (brazilin) menjadi merah delima menyala (brazilein) selama ekstraksi berlangsung?',
      options: [
        'A. Reaksi oksidasi cincin dihidropiran yang membentuk kromofor kuinon planar dengan sistem ikatan terkonjugasi penuh (&pi; &rarr; &pi;*).',
        'B. Penambahan zat pewarna sintetis dari udara.',
        'C. Reaksi pembentukan ikatan kovalen raksasa antar partikel selulosa.',
        'D. Penurunan massa jenis cairan akibat pengadukan motor.'
      ],
      correct: 0,
      explanation: 'Tepat! Oksidasi non-enzimatik melepaskan 2 proton dan 2 elektron, membentuk cincin kuinon terkonjugasi penuh. Hal ini mempersempit celah energi HOMO-LUMO sehingga molekul menyerap spektrum biru (446 nm) dan memancarkan warna komplementer merah.'
    },
    {
      question: '5. Berdasarkan prinsip Kimia Hijau (Green Chemistry), mengapa pemanfaatan kayu secang dengan pelarut akuades dan suhu terkontrol 60&deg;C sangat direkomendasikan untuk praktikum kimia sekolah?',
      options: [
        'A. Menghasilkan limbah B3 asam pekat yang berguna untuk membersihkan lantai laboratorium.',
        'B. Menggunakan pelarut tidak beracun (non-toxic), bahan baku hayati terbarukan, hemat energi termal, dan aman bagi siswa.',
        'C. Membutuhkan instrumen bertekanan tinggi yang menguji ketahanan fisik siswa.',
        'D. Karena kayu secang merupakan bahan kimia sintetis murni buatan pabrik.'
      ],
      correct: 1,
      explanation: 'Tepat! Praktikum ini menerapkan 4 pilar Kimia Hijau utama: penggunaan bahan terbarukan (renewable feedstocks), pelarut aman ramah lingkungan (safer solvents/akuades), efisiensi energi (energy efficiency pada 60&deg;C), dan pencegahan limbah beracun.'
    }
  ];

  function renderQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;

    quizContainer.innerHTML = quizData.map((q, qIdx) => `
      <div class="quiz-card" data-qidx="${qIdx}">
        <div class="quiz-question">${q.question}</div>
        <div class="quiz-options">
          ${q.options.map((opt, optIdx) => `
            <div class="quiz-opt" data-optidx="${optIdx}" onclick="app.selectQuizOption(${qIdx}, ${optIdx})">
              <span>${opt}</span>
            </div>
          `).join('')}
        </div>
        <div class="quiz-explanation" id="quizExp_${qIdx}"></div>
      </div>
    `).join('');
  }

  const selectedAnswers = {};

  function selectQuizOption(qIdx, optIdx) {
    selectedAnswers[qIdx] = optIdx;
    const card = document.querySelector(`.quiz-card[data-qidx="${qIdx}"]`);
    if (!card) return;
    card.querySelectorAll('.quiz-opt').forEach((optEl, i) => {
      if (i === optIdx) {
        optEl.classList.add('selected');
      } else {
        optEl.classList.remove('selected');
      }
    });
  }

  function submitQuiz() {
    let score = 0;
    const total = quizData.length;

    quizData.forEach((q, qIdx) => {
      const card = document.querySelector(`.quiz-card[data-qidx="${qIdx}"]`);
      const expEl = document.getElementById(`quizExp_${qIdx}`);
      const userAns = selectedAnswers[qIdx];

      if (card) {
        card.querySelectorAll('.quiz-opt').forEach((optEl, i) => {
          optEl.classList.remove('correct', 'incorrect');
          if (i === q.correct) {
            optEl.classList.add('correct');
          } else if (i === userAns) {
            optEl.classList.add('incorrect');
          }
        });
      }

      if (userAns === q.correct) {
        score += 1;
      }

      if (expEl) {
        expEl.style.display = 'block';
        expEl.innerHTML = `<strong>Pembahasan Ilmiah:</strong> ${q.explanation}`;
      }
    });

    const finalScore = Math.round((score / total) * 100);
    const quizResultBox = document.getElementById('quizResultBox');
    const quizScoreText = document.getElementById('quizScoreText');
    const quizScoreFeedback = document.getElementById('quizScoreFeedback');

    if (quizResultBox) {
      quizResultBox.style.display = 'block';
      quizScoreText.textContent = `Skor Pemahaman Anda: ${finalScore} / 100`;

      if (finalScore >= 80) {
        quizScoreFeedback.textContent = 'Luar Biasa! Pemahaman Anda sangat mendalam mengenai kimia bahan alam, kinetika termal, spektroskopi UV-Vis, dan etnosains kayu secang!';
        playChimeSound();
        triggerCelebrationConfetti();
      } else if (finalScore >= 60) {
        quizScoreFeedback.textContent = 'Baik! Anda telah memahami konsep dasar ekstraksi secang. Tinjau kembali pembahasan di atas untuk memperdalam konsep termolabilitas dan mordan!';
        playTone(600, 'sine', 0.2, 0.05);
      } else {
        quizScoreFeedback.textContent = 'Perlu Dipelajari Kembali: Silakan baca kembali tab "Triad Representasi Kimia" dan coba kembali simulasi pada "Laboratorium Ekstraksi".';
        playTone(300, 'sine', 0.25, 0.05);
      }

      quizResultBox.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // --- INITIALIZATION ---
  function init() {
    // Audio Toggle Button
    const btnAudioToggle = document.getElementById('btnAudioToggle');
    const lblAudioToggle = document.getElementById('lblAudioToggle');
    if (btnAudioToggle) {
      btnAudioToggle.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        localStorage.setItem('secang_audio', audioEnabled);
        btnAudioToggle.classList.toggle('audio-muted', !audioEnabled);
        if (lblAudioToggle) {
          lblAudioToggle.textContent = audioEnabled ? 'Audio: Aktif' : 'Audio: Mati';
        }
        if (audioEnabled) {
          playTone(660, 'sine', 0.1, 0.06);
          showToast('Efek suara laboratorium diaktifkan');
        } else {
          showToast('Efek suara laboratorium dinonaktifkan');
        }
      });
      btnAudioToggle.classList.toggle('audio-muted', !audioEnabled);
      if (lblAudioToggle) {
        lblAudioToggle.textContent = audioEnabled ? 'Audio: Aktif' : 'Audio: Mati';
      }
    }

    // Tab switching
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        playTone(540, 'sine', 0.04, 0.025);
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tabPanes.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const targetId = tab.dataset.tab;
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add('active');
        }

        // Redraw canvas charts on tab switch
        if (targetId === 'tab-lab') {
          setTimeout(updateSimulation, 50);
        } else if (targetId === 'tab-lkpd') {
          setTimeout(drawLkpdTempChart, 50);
          setTimeout(updateLkpdProgress, 50);
        } else if (targetId === 'tab-triad') {
          setTimeout(() => toggleMolecule('brazilein'), 50);
        }
      });
    });

    // Slider Temp
    if (sliderTemp) {
      sliderTemp.addEventListener('input', (e) => {
        currentTemp = parseInt(e.target.value);
        updateSimulation();
      });
    }

    // Preset buttons
    document.querySelectorAll('.btn-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTemp = parseInt(btn.dataset.temp);
        if (sliderTemp) sliderTemp.value = currentTemp;
        updateSimulation();
      });
    });

    // Solvent Radios
    document.querySelectorAll('input[name="solventType"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        currentSolvent = e.target.value;
        updateSimulation();
      });
    });

    // Ratio Select
    if (selectRatio) {
      selectRatio.addEventListener('change', (e) => {
        currentRatio = parseInt(e.target.value);
        if (lblRatio) lblRatio.textContent = `1 : ${currentRatio} (g/mL)`;
      });
    }

    // Time Slider
    if (sliderTime) {
      sliderTime.addEventListener('input', (e) => {
        currentTime = parseInt(e.target.value);
        if (lblTime) lblTime.textContent = `${currentTime} Menit`;
      });
    }

    // Transfer result button
    if (btnTransferToLKPD) {
      btnTransferToLKPD.addEventListener('click', transferResultToLKPD);
    }

    // Import from simulation button on LKPD tab
    if (btnImportFromSim) {
      btnImportFromSim.addEventListener('click', () => {
        transferResultToLKPD();
      });
    }

    // Fill sample data
    if (btnFillSampleData) {
      btnFillSampleData.addEventListener('click', fillEmpiricalSampleData);
    }
    if (btnFillPdfSampleData) {
      btnFillPdfSampleData.addEventListener('click', fillPdfSampleData);
    }

    // Reset button
    if (btnResetData) {
      btnResetData.addEventListener('click', resetForm);
    }

    // Dedicated High-Fidelity A4 Print & PDF Download Buttons
    if (btnQuickPrint) {
      btnQuickPrint.addEventListener('click', prepareAndPrintLkpd);
    }
    const btnSidebarPrint = document.getElementById('btnSidebarPrint');
    if (btnSidebarPrint) {
      btnSidebarPrint.addEventListener('click', prepareAndPrintLkpd);
    }

    // Auto-update print mirrors on native browser Ctrl+P / Cmd+P
    window.addEventListener('beforeprint', () => {
      updateTextareaPrintMirrors();
      drawLkpdTempChart(true);
    });

    window.addEventListener('afterprint', () => {
      drawLkpdTempChart(false);
    });

    // Modal Close
    if (modalCloseBtn && mordantModalOverlay) {
      modalCloseBtn.addEventListener('click', () => {
        mordantModalOverlay.classList.remove('active');
      });
      mordantModalOverlay.addEventListener('click', (e) => {
        if (e.target === mordantModalOverlay) {
          mordantModalOverlay.classList.remove('active');
        }
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mordantModalOverlay.classList.contains('active')) {
          mordantModalOverlay.classList.remove('active');
        }
      });
    }

    // LKPD Table Action Buttons
    const btnAddRow = document.getElementById('btnAddRow');
    if (btnAddRow) {
      btnAddRow.addEventListener('click', addTableRow);
    }

    const btnRemoveRow = document.getElementById('btnRemoveRow');
    if (btnRemoveRow) {
      btnRemoveRow.addEventListener('click', removeTableRow);
    }

    // Export & Import LKPD JSON Buttons
    const btnExportJson = document.getElementById('btnExportJson');
    if (btnExportJson) {
      btnExportJson.addEventListener('click', exportLkpdJson);
    }

    const btnTriggerImport = document.getElementById('btnTriggerImport');
    const inputImportJson = document.getElementById('inputImportJson');
    if (btnTriggerImport && inputImportJson) {
      btnTriggerImport.addEventListener('click', () => {
        inputImportJson.click();
      });
      inputImportJson.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          importLkpdJson(e.target.files[0]);
          e.target.value = ''; // Reset input
        }
      });
    }

    const btnResetDataSidebar = document.getElementById('btnResetDataSidebar');
    if (btnResetDataSidebar) {
      btnResetDataSidebar.addEventListener('click', resetForm);
    }

    // Dynamic calculation and chart update on table editing
    if (tableBodyRows) {
      tableBodyRows.addEventListener('input', (e) => {
        const target = e.target;
        const tr = target.closest('tr');
        if (target.classList.contains('col-simplisia') || target.classList.contains('col-extract')) {
          recalculateRowYield(tr);
        }
        drawLkpdTempChart();
      });
    }

    // Window resize redraw for both charts
    window.addEventListener('resize', () => {
      drawLkpdTempChart();
      const sim = getSimulatedValues(currentTemp, currentSolvent);
      drawSpectrum(sim.lambda, sim.abs);
    });

    // Auto-save form changes
    document.addEventListener('input', (e) => {
      if (e.target.closest('#tab-lkpd')) {
        saveFormToStorage();
      }
    });

    // Dedicated Interactive Extraction Action Button
    const btnRunExtraction = document.getElementById('btnRunExtractionSim');
    if (btnRunExtraction) {
      btnRunExtraction.addEventListener('click', runExtractionCycle);
    }

    // LKPD Progress Tracking on form input/change
    const tabLkpd = document.getElementById('tab-lkpd');
    if (tabLkpd) {
      tabLkpd.addEventListener('input', updateLkpdProgress);
      tabLkpd.addEventListener('change', updateLkpdProgress);
    }

    // Milestone chips navigation
    document.querySelectorAll('.milestone-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        playTone(520, 'sine', 0.05, 0.03);
        const targetId = chip.dataset.target;
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          targetEl.style.transition = 'box-shadow 0.3s ease';
          targetEl.style.boxShadow = '0 0 0 3px var(--secang-400)';
          setTimeout(() => {
            targetEl.style.boxShadow = '';
          }, 1400);
        }
      });
    });

    // TOC ScrollSpy with IntersectionObserver
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            document.querySelectorAll('.lkpd-toc a').forEach(a => {
              if (a.getAttribute('href') === `#${id}`) {
                a.classList.add('active');
              } else {
                a.classList.remove('active');
              }
            });
          }
        });
      }, { rootMargin: '-20% 0px -65% 0px' });

      document.querySelectorAll('.lkpd-section[id]').forEach(sec => {
        observer.observe(sec);
      });
    }

    // Submit Quiz button
    const btnSubmitQuiz = document.getElementById('btnSubmitQuiz');
    if (btnSubmitQuiz) {
      btnSubmitQuiz.addEventListener('click', submitQuiz);
    }

    // 2026 Modern Motion Additions (WeAreBrand & Garry Audie Inspiration)
    initHeroRefractionCanvas();
    initSpotlightCards();
    initExpandingCards();
    initTiltCards();
    initFloatingTopButton();

    // Load saved data and initial simulation
    loadFormFromStorage();
    updateSimulation();
    renderQuiz();
    toggleMolecule('brazilein');
    updateLkpdProgress();
    setTimeout(drawLkpdTempChart, 100);
  }

  // -------------------------------------------------------------
  // 2026 Motion Engine: Refraction Canvas, Telemetry & Accordion
  // -------------------------------------------------------------

  function playSubtleHapticSound(freq = 440, duration = 0.05) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!window.__appAudioCtx) {
        window.__appAudioCtx = new AudioCtx();
      }
      const ctx = window.__appAudioCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  function initHeroRefractionCanvas() {
    const canvas = document.getElementById('heroRefractionCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth || 900;
    let height = canvas.height = canvas.offsetHeight || 280;

    function resizeCanvas() {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 900;
      height = canvas.height = canvas.offsetHeight || 280;
    }
    window.addEventListener('resize', resizeCanvas);

    let mouseX = width * 0.72;
    let mouseY = height * 0.5;
    let targetX = mouseX;
    let targetY = mouseY;
    let angle = 0;

    const heroCard = canvas.closest('.hero-card');
    const hudCoords = document.getElementById('hudCoords');
    const hudClock = document.getElementById('hudClock');

    if (heroCard) {
      heroCard.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        if (hudCoords) {
          hudCoords.textContent = `X: ${Math.round(targetX).toString().padStart(3, '0')} | Y: ${Math.round(targetY).toString().padStart(3, '0')}`;
        }
      });
      heroCard.addEventListener('mouseleave', () => {
        targetX = width * 0.72;
        targetY = height * 0.5;
      });
    }

    // Update HUD Clock every second
    setInterval(() => {
      if (hudClock) {
        const now = new Date();
        hudClock.textContent = now.toTimeString().split(' ')[0] + ' WIB';
      }
    }, 1000);

    function renderRefractionLoop() {
      ctx.clearRect(0, 0, width, height);

      // Smooth lerp mouse
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;
      angle += 0.009;

      // Chromophore molecular center
      const cx = width > 700 ? width * 0.76 : width * 0.5;
      const cy = height * 0.52;

      // 1. Light incident beam from top-left toward cursor
      const gradBeam = ctx.createLinearGradient(0, 0, mouseX, mouseY);
      gradBeam.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      gradBeam.addColorStop(0.65, 'rgba(239, 68, 68, 0.2)');
      gradBeam.addColorStop(1, 'rgba(190, 18, 60, 0.75)');

      ctx.save();
      ctx.strokeStyle = gradBeam;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(width * 0.04, height * 0.12);
      ctx.quadraticCurveTo(width * 0.35, height * 0.18, mouseX, mouseY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 2. Chromatic Dispersion Waves (Absorption λ = 446 nm blue + Transmission 650 nm red)
      for (let i = 0; i < 3; i++) {
        const radius = 38 + i * 26 + Math.sin(angle * 2.2 + i) * 6;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(1, radius), 0, Math.PI * 2);
        ctx.strokeStyle = i === 1 
          ? 'rgba(59, 130, 246, 0.35)' // 446 nm blue absorption
          : `rgba(220, 38, 38, ${0.32 - i * 0.09})`; // 650 nm red transmission
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 3. Rotating 3D Chromophore Lattice (Benzene ring + Quinone core)
      const points = 6;
      const rLattice = 54;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      ctx.beginPath();
      for (let p = 0; p <= points; p++) {
        const a = (p * 2 * Math.PI) / points;
        const px = Math.cos(a) * rLattice;
        const py = Math.sin(a) * rLattice * 0.65; // isometric perspective tilt
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(159, 18, 57, 0.65)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner aromatic resonance ring
      ctx.beginPath();
      ctx.arc(0, 0, rLattice * 0.38, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Nodes (atoms)
      for (let p = 0; p < points; p++) {
        const a = (p * 2 * Math.PI) / points;
        const px = Math.cos(a) * rLattice;
        const py = Math.sin(a) * rLattice * 0.65;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = p % 2 === 0 ? '#dc2626' : '#fda4af';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();

      // 4. Subtle Refraction Dispersion flare connecting mouse to core
      const flareGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 80);
      flareGrad.addColorStop(0, 'rgba(255, 228, 230, 0.35)');
      flareGrad.addColorStop(0.5, 'rgba(244, 63, 94, 0.15)');
      flareGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = flareGrad;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 80, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(renderRefractionLoop);
    }

    renderRefractionLoop();
  }

  function initSpotlightCards() {
    document.querySelectorAll('.spotlight-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  function initExpandingCards() {
    const cards = document.querySelectorAll('.expand-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (window.innerWidth > 900) {
          window.activateExpandCard(card);
        }
      });
    });
  }

  window.activateExpandCard = function(card) {
    if (!card) return;
    const grid = card.closest('.expanding-cards-grid');
    if (!grid) return;
    grid.querySelectorAll('.expand-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    playSubtleHapticSound(520, 0.05);
  };

  function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-3d-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 900) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotX = ((y - centerY) / centerY) * -4.5;
        const rotY = ((x - centerX) / centerX) * 4.5;
        card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-2px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  function initFloatingTopButton() {
    const btn = document.getElementById('btnFloatingTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 320) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    testMordant,
    selectQuizOption,
    submitQuiz,
    addTableRow,
    removeTableRow,
    exportLkpdJson,
    resetForm,
    drawLkpdTempChart,
    prepareAndPrintLkpd,
    runExtractionCycle,
    toggleMolecule,
    updateLkpdProgress
  };
})();

// Global video player activation for procedure thumbnail
window.startVideoPlayer = function() {
  const thumbBox = document.getElementById('videoThumbnailBox');
  const playerCont = document.getElementById('videoPlayerContainer');
  const iframe = document.getElementById('youtubeIframe');
  if (thumbBox && playerCont && iframe) {
    thumbBox.style.display = 'none';
    playerCont.style.display = 'block';
    if (!iframe.src && iframe.dataset.src) {
      iframe.src = iframe.dataset.src;
    }
  }
};
