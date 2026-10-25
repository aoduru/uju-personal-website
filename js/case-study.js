/* ===========================================================
   case-study.js — highlights the section you're reading in the
   "On this page" list. The list works as plain links without it.
   =========================================================== */

(function () {
  'use strict';

  var links = document.querySelectorAll('.cs-toc a[href^="#"]');
  if (!links.length || !('IntersectionObserver' in window)) return;

  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

  function mark(id) {
    links.forEach(function (a) { a.removeAttribute('aria-current'); });
    if (byId[id]) byId[id].setAttribute('aria-current', 'true');
  }

  // a section counts as "current" once its top passes the upper third of the screen
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) mark(entry.target.id);
    });
  }, { rootMargin: '-30% 0px -65% 0px' });

  Object.keys(byId).forEach(function (id) {
    var section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}());
