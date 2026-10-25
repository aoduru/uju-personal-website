/* ===========================================================
   site.js — runs on every page: theme, page base, font trial,
   footer year. Page-specific behaviour lives in its own file.
   =========================================================== */

(function () {
  'use strict';

  /* ---------- theme: light -> dark -> auto, remembered ---------- */
  var themeBtn = document.getElementById('theme');
  var MODES = ['light', 'dark', 'auto'];
  var mode = 'light';
  try { mode = window.localStorage.getItem('uju-theme') || 'light'; } catch (e) {}
  if (MODES.indexOf(mode) === -1) mode = 'light';

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', mode);
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
  var fontLink = document.getElementById('display-font');
  if (pick && FONTS[pick] && fontLink) {
    fontLink.href =
      'https://fonts.googleapis.com/css2?family=' + FONTS[pick][1] + '&display=swap';
    document.documentElement.style.setProperty(
      '--font-display', "'" + FONTS[pick][0] + "', system-ui, sans-serif"
    );
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}());
