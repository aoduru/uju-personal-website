/* ===========================================================
   stickers.js — peel a sticker, hear what it is

   Every interest has a distinct synthesised sound, so the page
   is playable today with no audio files at all:

     reading  page riffling          plane    engine spooling up
     singing  two sung notes         guitar   a strummed chord
     drawing  pencil on paper        games    coin / power-up blip

   Drop a real recording at assets/sound/<name>.mp3 and it plays
   that instead, automatically. Nothing here needs changing.

   Peeling plays a short crackle (the gesture) under the interest's own
   sound (the reward), then the sticker curls up and flies into the tray.

   Rules this follows:
     - peeling is a toy, not a door: it never navigates
     - sound stays off until a click, with a visible mute control
     - Uju is not a sticker and has no peel behaviour at all
   =========================================================== */

(function () {
  'use strict';

  var MAX_PLAY_MS = 1600;   // a pop is a punctuation mark, not a track
  var FADE_MS = 250;
  var playing = null;
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

    // a strummed chord: a pick transient, then four strings a beat apart,
    // each a decaying partial stack. Reads as a guitar, not as a synth note.
    guitar: function (ac, t) {
      var strings = [196.00, 246.94, 293.66, 392.00];   // G3 B3 D4 G4
      strings.forEach(function (freq, i) {
        var at = t + i * 0.045;

        // pick attack
        var click = noise(ac);
        var bp = ac.createBiquadFilter();
        var cg = ac.createGain();
        bp.type = 'bandpass';
        bp.frequency.value = freq * 6;
        bp.Q.value = 2;
        cg.gain.setValueAtTime(0.06, at);
        cg.gain.exponentialRampToValueAtTime(0.0001, at + 0.03);
        click.connect(bp).connect(cg).connect(ac.destination);
        click.start(at);
        click.stop(at + 0.04);

        // the string itself: fundamental plus two partials, decaying fast
        [[1, 0.13], [2, 0.05], [3, 0.025]].forEach(function (partial) {
          var osc = ac.createOscillator();
          var gain = ac.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq * partial[0], at);
          gain.gain.setValueAtTime(0.0001, at);
          gain.gain.exponentialRampToValueAtTime(partial[1], at + 0.006);
          gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.1);
          osc.connect(gain).connect(ac.destination);
          osc.start(at);
          osc.stop(at + 1.15);
        });
      });
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
    }
  };

  // The peel itself: a scatter of tiny clicks, irregular so it sounds like
  // backing paper letting go rather than a single tick.
  function crackle() {
    var ac = audio();
    if (!ac) return;
    var t = ac.currentTime + 0.01;
    for (var i = 0; i < 14; i++) {
      var at = t + i * 0.018 + Math.random() * 0.012;
      var src = noise(ac);
      var hp = ac.createBiquadFilter();
      var gain = ac.createGain();
      hp.type = 'highpass';
      hp.frequency.value = 2200 + Math.random() * 1800;
      var peak = 0.05 + Math.random() * 0.05;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(peak, at + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.03);
      src.connect(hp).connect(gain).connect(ac.destination);
      src.start(at);
      src.stop(at + 0.04);
    }
  }

  // The crackle rides its own channel so it layers under the interest sound
  // instead of cutting it off the way a second interest sound would.
  function peelSound() {
    if (muted) return;
    var file = new Audio('assets/sound/peel.mp3');
    file.volume = 0.5;
    var attempt = file.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(crackle);
  }

  function synth(name) {
    var ac = audio();
    if (!ac) return;
    var make = SOUNDS[name];
    try { (make || SOUNDS.games)(ac, ac.currentTime + 0.01); } catch (e) {}
  }

  // Fade a clip out and stop it, so a long file never outlives its bubble
  // and a second pop never stacks on top of the first.
  function stop(clip) {
    if (!clip || clip.paused) return;
    var steps = 10;
    var step = clip.volume / steps;
    var fade = window.setInterval(function () {
      clip.volume = Math.max(0, clip.volume - step);
      if (clip.volume <= 0.01) {
        window.clearInterval(fade);
        clip.pause();
      }
    }, FADE_MS / steps);
  }

  function play(name) {
    if (muted) return;
    if (!name) return synth('games');

    stop(playing);                     // whatever was ringing, let it go

    var clip = new Audio('assets/sound/' + name + '.mp3');
    clip.volume = 0.7;
    var attempt = clip.play();

    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () { synth(name); });   // no file yet → synthesise
    }

    playing = clip;
    window.setTimeout(function () {
      if (playing === clip) stop(clip);
    }, MAX_PLAY_MS - FADE_MS);
  }

  /* ---------- peel ---------- */
  var tray = document.getElementById('tray-items');
  var trayText = document.getElementById('tray-text');
  var trayCount = document.getElementById('tray-count');
  var restick = document.getElementById('restick');
  var stage = document.getElementById('stage');
  var stickers = stage ? [].slice.call(stage.querySelectorAll('.sticker')) : [];
  var peeled = [];

  function updateTray() {
    if (trayCount) trayCount.textContent = '(' + peeled.length + ' of ' + stickers.length + ')';
    // The only place the idea is ever said out loud, and only once the page is bare.
    if (trayText) {
      trayText.textContent = (peeled.length && peeled.length === stickers.length)
        ? 'things i like \u00b7 still here'
        : 'things i like';
    }
    if (restick) restick.hidden = peeled.length === 0;
  }

  function trayItem(sticker) {
    var li = document.createElement('li');
    li.className = 'tray-item';
    li.style.setProperty('--tint', getComputedStyle(sticker).getPropertyValue('--tint'));
    li.style.setProperty('--tilt', (Math.random() * 10 - 5).toFixed(1) + 'deg');
    var art = sticker.querySelector('.sticker-art');
    if (art) {
      var img = document.createElement('img');
      img.src = art.getAttribute('src');
      img.alt = '';
      li.appendChild(img);
    } else {
      li.textContent = sticker.textContent.trim().slice(0, 2);
    }
    li.title = sticker.textContent.trim();
    return li;
  }

  function peel(sticker) {
    if (sticker.classList.contains('is-peeling') || sticker.hidden) return;

    peelSound();
    play(sticker.dataset.sound);

    // Aim the flight at the tray, so it lands where the stickers collect.
    if (tray) {
      var from = sticker.getBoundingClientRect();
      var to = tray.getBoundingClientRect();
      var targetX = to.left + Math.min(to.width - 40, 28 + peeled.length * 58);
      sticker.style.setProperty('--fly-x', Math.round(targetX - from.left) + 'px');
      sticker.style.setProperty('--fly-y', Math.round(to.top + to.height / 2 - (from.top + from.height / 2)) + 'px');
    }

    sticker.classList.add('is-peeling');
    sticker.setAttribute('aria-pressed', 'true');

    var land = function () {
      sticker.removeEventListener('animationend', land);
      sticker.hidden = true;
      sticker.classList.remove('is-peeling');
      peeled.push(sticker);
      if (tray) tray.appendChild(trayItem(sticker));
      updateTray();
    };
    sticker.addEventListener('animationend', land);
  }

  stickers.forEach(function (sticker) {
    sticker.addEventListener('click', function () { peel(sticker); });
  });

  if (restick) {
    restick.addEventListener('click', function () {
      if (tray) tray.innerHTML = '';
      peeled = [];
      stickers.forEach(function (sticker) {
        sticker.hidden = false;
        sticker.removeAttribute('aria-pressed');
        sticker.style.removeProperty('--fly-x');
        sticker.style.removeProperty('--fly-y');
      });
      updateTray();
      crackle();
    });
  }

  updateTray();

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
}());
