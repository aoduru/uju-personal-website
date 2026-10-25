/* ===========================================================
   carousel.js — the case study cards

   Swiping, trackpad scrolling and snapping are all native CSS
   (scroll-snap), so the cards work with no JS at all. This file
   only adds the arrow buttons and greys them out at either end.
   =========================================================== */

(function () {
  'use strict';

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('.card-track');
    var prev = root.querySelector('[data-dir="prev"]');
    var next = root.querySelector('[data-dir="next"]');
    if (!track || !prev || !next) return;

    // one card plus its gap, so each click lands on the next snap point
    function step() {
      var card = track.querySelector('.project-card');
      if (!card) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    }

    function update() {
      var max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
      // nothing to scroll → hide the arrows entirely
      root.classList.toggle('is-static', max <= 0);
    }

    prev.addEventListener('click', function () {
      track.scrollBy({ left: -step(), behavior: calm ? 'auto' : 'smooth' });
    });
    next.addEventListener('click', function () {
      track.scrollBy({ left: step(), behavior: calm ? 'auto' : 'smooth' });
    });

    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
}());
