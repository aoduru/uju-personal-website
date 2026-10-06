/* ===========================================================
   bubbles.js — each bubble pops with its own sound

   Every interest has a distinct synthesised sound, so the page
   is playable today with no audio files at all:

     reading  page riffling          plane    engine spooling up
     singing  two sung notes         drawing  pencil on paper
     games    coin / power-up blip   cooking  a pan sizzling

   Drop a real recording at assets/sound/<name>.mp3 and it plays
   that instead, automatically. Nothing here needs changing.

   Storyboard rules this follows:
     - popping is a toy, not a door: it never navigates
     - sound stays off until a click, with a visible mute control
   =========================================================== */

(function () {
  'use strict';

  var RESPAWN_MS = 1400;
  var muted = false;
  var ctx = null;

  try { muted = window.localStorage.getItem('uju-muted') === '1'; } catch (e) {}

  function audio() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* ---------- building blocks ---------- */

  // a buffer of white noise, reused for anything papery or sizzly
  var noiseBuffer = null;
  function noise(ac) {
    if (!noiseBuffer) {
      noiseBuffer = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
      var data = noiseBuffer.getChannelData(0);
      for (var i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    var src = ac.createBufferSource();
    src.buffer = noiseBuffer;
    src.loop = true;
    return src;
  }

  function tone(ac, type, freq, start, dur, peak) {
    var osc = ac.createOscillator();
    var gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start(start);
    osc.stop(start + dur + 0.02);
    return osc;
  }

  /* ---------- one per interest ---------- */

  var SOUNDS = {
    // pages riffling: four short bandpassed noise swishes
    reading: function (ac, t) {
      for (var i = 0; i < 4; i++) {
        var at = t + i * 0.085;
        var src = noise(ac);
        var bp = ac.createBiquadFilter();
        var gain = ac.createGain();
        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(1800, at);
        bp.frequency.exponentialRampToValueAtTime(3600, at + 0.05);
        bp.Q.value = 1.4;
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(0.16, at + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.07);
        src.connect(bp).connect(gain).connect(ac.destination);
        src.start(at);
        src.stop(at + 0.09);
      }
    },

    // engine spooling up: low saw rising under filtered noise
    plane: function (ac, t) {
      var osc = ac.createOscillator();
      var oscGain = ac.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(42, t);
      osc.frequency.exponentialRampToValueAtTime(96, t + 1.1);
      oscGain.gain.setValueAtTime(0.0001, t);
      oscGain.gain.exponentialRampToValueAtTime(0.12, t + 0.35);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.3);
      osc.connect(oscGain).connect(ac.destination);
      osc.start(t);
      osc.stop(t + 1.35);

      var src = noise(ac);
      var lp = ac.createBiquadFilter();
      var nGain = ac.createGain();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(400, t);
      lp.frequency.exponentialRampToValueAtTime(1600, t + 1.1);
      nGain.gain.setValueAtTime(0.0001, t);
      nGain.gain.exponentialRampToValueAtTime(0.07, t + 0.4);
      nGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.3);
      src.connect(lp).connect(nGain).connect(ac.destination);
      src.start(t);
      src.stop(t + 1.35);
    },

    // two sung notes, A4 up to C#5, with a little vibrato
    singing: function (ac, t) {
      [[440, t, 0.42], [554.37, t + 0.3, 0.6]].forEach(function (note) {
        var osc = tone(ac, 'triangle', note[0], note[1], note[2], 0.17);
        var vib = ac.createOscillator();
        var vibGain = ac.createGain();
        vib.frequency.value = 5.5;
        vibGain.gain.value = 4;
        vib.connect(vibGain).connect(osc.frequency);
        vib.start(note[1]);
        vib.stop(note[1] + note[2]);
      });
    },

    // pencil on paper: short high scratches, irregular
    drawing: function (ac, t) {
      for (var i = 0; i < 5; i++) {
        var at = t + i * 0.06 + Math.random() * 0.02;
        var src = noise(ac);
        var hp = ac.createBiquadFilter();
        var gain = ac.createGain();
        hp.type = 'highpass';
        hp.frequency.value = 2600;
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(0.1, at + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.045);
        src.connect(hp).connect(gain).connect(ac.destination);
        src.start(at);
        src.stop(at + 0.06);
      }
    },

    // coin blip: two square notes, fast
    games: function (ac, t) {
      tone(ac, 'square', 988, t, 0.08, 0.12);
      tone(ac, 'square', 1319, t + 0.07, 0.22, 0.12);
    },

    // sizzle: band-limited noise, slow fade
    cooking: function (ac, t) {
      var src = noise(ac);
      var hp = ac.createBiquadFilter();
      var gain = ac.createGain();
      hp.type = 'highpass';
      hp.frequency.value = 1800;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.1, t + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      src.connect(hp).connect(gain).connect(ac.destination);
      src.start(t);
      src.stop(t + 0.95);
    }
  };

  function synth(name) {
    var ac = audio();
    if (!ac) return;
    var make = SOUNDS[name];
    try { (make || SOUNDS.games)(ac, ac.currentTime + 0.01); } catch (e) {}
  }

  function play(name) {
    if (muted) return;
    if (!name) return synth('games');
    var file = new Audio('assets/sound/' + name + '.mp3');
    file.volume = 0.7;
    var attempt = file.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () { synth(name); });   // no file yet → synthesise
    }
  }

  /* ---------- pop ---------- */
  function pop(bubble) {
    if (bubble.classList.contains('is-popped')) return;
    play(bubble.dataset.sound);
    bubble.classList.add('is-popped');
    bubble.setAttribute('aria-pressed', 'true');
    window.setTimeout(function () {
      bubble.classList.remove('is-popped');
      bubble.removeAttribute('aria-pressed');
    }, RESPAWN_MS);
  }

  var stage = document.getElementById('stage');
  if (stage) {
    stage.addEventListener('click', function (event) {
      var bubble = event.target.closest('.bubble');
      if (bubble) pop(bubble);
    });
  }

  /* ---------- mute ---------- */
  var muteBtn = document.getElementById('mute');
  if (muteBtn) {
    muteBtn.setAttribute('aria-pressed', String(muted));
    muteBtn.addEventListener('click', function () {
      muted = !muted;
      muteBtn.setAttribute('aria-pressed', String(muted));
      try { window.localStorage.setItem('uju-muted', muted ? '1' : '0'); } catch (e) {}
    });
  }

  /* ---------- theme: auto -> light -> dark, remembered ---------- */
  var themeBtn = document.getElementById('theme');
  var MODES = ['auto', 'light', 'dark'];
  var mode = 'auto';
  try { mode = window.localStorage.getItem('uju-theme') || 'auto'; } catch (e) {}

  function applyTheme() {
    if (mode === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', mode);
    if (themeBtn) themeBtn.textContent = 'Theme: ' + mode;
  }
  applyTheme();

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      mode = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
      try { window.localStorage.setItem('uju-theme', mode); } catch (e) {}
      applyTheme();
    });
  }

  /* ---------- compare page bases: ?bg=cream | white | sky ---------- */
  var bg = new URLSearchParams(window.location.search).get('bg');
  if (bg && ['cream', 'white', 'sky'].indexOf(bg) !== -1) {
    document.documentElement.setAttribute('data-bg', bg);
  }

  /* ---------- try the display fonts: ?font=museo ---------- */
  var FONTS = {
    albert:      ['Albert Sans',       'Albert+Sans:wght@400;500;800'],
    alexandria:  ['Alexandria',        'Alexandria:wght@400;500;800'],
    hanken:      ['Hanken Grotesk',    'Hanken+Grotesk:wght@400;500;800'],
    maven:       ['Maven Pro',         'Maven+Pro:wght@400;500;800'],
    merriweather:['Merriweather Sans', 'Merriweather+Sans:wght@400;500;800'],
    mona:        ['Mona Sans',         'Mona+Sans:wght@400;500;800'],
    museo:       ['MuseoModerno',      'MuseoModerno:wght@400;500;800']
  };

  var pick = new URLSearchParams(window.location.search).get('font');
  if (pick && FONTS[pick]) {
    document.getElementById('display-font').href =
      'https://fonts.googleapis.com/css2?family=' + FONTS[pick][1] + '&display=swap';
    document.documentElement.style.setProperty(
      '--font-display', "'" + FONTS[pick][0] + "', system-ui, sans-serif"
    );
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}());
