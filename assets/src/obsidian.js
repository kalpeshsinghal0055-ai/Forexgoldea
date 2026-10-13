/**
 * Homepage behaviour: mobile menu, motion toggle, scroll reveals, hero pointer depth.
 *
 * Readable source. The served file is assets/obsidian.js, built and hashed by
 * scripts/build-home.mjs - edit this one, never that one.
 *
 * Every lookup is guarded: this runs on the homepage only, and a missing element must
 * not take the rest of the script (and with it the reveal animations) down with it.
 */
(function () {
  'use strict';

  var menu = document.querySelector('.menu');
  var navigation = document.querySelector('#navigation');
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function closeMenu() {
    if (!navigation || !menu) return;
    navigation.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.textContent = 'Menu';
  }

  if (menu && navigation) {
    menu.addEventListener('click', function () {
      var expanded = menu.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('aria-expanded', String(!expanded));
      navigation.classList.toggle('open', !expanded);
      menu.textContent = expanded ? 'Menu' : 'Close';
    });
    navigation.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navigation.classList.contains('open')) {
        closeMenu();
        menu.focus();
      }
    });
  }

  var motion = document.querySelector('#motion');
  if (motion) {
    if (reduced) {
      document.body.classList.add('paused');
      motion.textContent = 'Reduced motion on';
      motion.disabled = true;
      motion.setAttribute('aria-pressed', 'true');
    }
    motion.addEventListener('click', function () {
      var paused = document.body.classList.toggle('paused');
      motion.setAttribute('aria-pressed', String(paused));
      motion.textContent = paused ? 'Resume motion ▷' : 'Pause motion Ⅱ';
    });
  }

  // the reveal class hides its element, so it is only ever applied when something is
  // guaranteed to take it off again
  if ('IntersectionObserver' in window && !reduced) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.section-top,.two-col,.flow article,.accounts>a,.onboarding li,.closing h2')
      .forEach(function (el) {
        el.classList.add('reveal');
        observer.observe(el);
      });
  }

  var hero = document.querySelector('.hero');
  if (hero && !reduced && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    hero.addEventListener('pointermove', function (event) {
      if (document.body.classList.contains('paused')) return;
      var rect = hero.getBoundingClientRect();
      hero.style.setProperty('--hero-x', ((event.clientX - rect.left) / rect.width - 0.5) * 14 + 'px');
      hero.style.setProperty('--hero-y', ((event.clientY - rect.top) / rect.height - 0.5) * 10 + 'px');
    });
    hero.addEventListener('pointerleave', function () {
      hero.style.setProperty('--hero-x', '0px');
      hero.style.setProperty('--hero-y', '0px');
    });
  }
})();
