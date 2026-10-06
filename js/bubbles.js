/* ===========================================================
   bubbles.js — pop a bubble, hear a sound
   Right now each bubble synthesises a pop with the Web Audio API,
   so the interaction works before any audio files exist.
   Drop a file at assets/sound/<data-sound>.mp3 and it plays that
   instead, automatically. No code change needed.
   =========================================================== */

(function () {
  'use strict';

  var RESPAWN_MS = 1400;
  var ctx = null;

  /* ---------- fallback pop, synthesised ---------- */
  function synthPop() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = ctx || new AC();
      if (ctx.state === 'suspended') ctx.resume();

      var now = ctx.currentTime;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(820, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.11);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.22, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) { /* audio is a nicety, never a failure */ }
  }

  /* ---------- real file if there is one ---------- */
  function playSound(name) {
    if (!name) return synthPop();
    var audio = new Audio('assets/sound/' + name + '.mp3');
    audio.volume = 0.7;
    var attempt = audio.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(synthPop);   // file missing or blocked → synth
    }
  }

  /* ---------- pop ---------- */
  function pop(bubble) {
    if (bubble.classList.contains('is-popped')) return;
    playSound(bubble.dataset.sound);
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
    var link = document.getElementById('display-font');
    link.href = 'https://fonts.googleapis.com/css2?family=' + FONTS[pick][1] + '&display=swap';
    document.documentElement.style.setProperty(
      '--font-display', "'" + FONTS[pick][0] + "', system-ui, sans-serif"
    );
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}());
