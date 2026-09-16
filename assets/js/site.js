/* ============================================================
   IMHWS-1 — shared behaviour.
   With JavaScript unavailable the pages still render completely;
   only the live countdown and the map image are absent.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- countdown ---------- */
  // Perth is UTC+8 and does not observe daylight saving, so this offset is stable.
  var TARGET = new Date('2027-09-20T00:00:00+08:00').getTime();

  function pad(n) { return String(n).padStart(2, '0'); }

  function renderCountdown(el) {
    var diff = TARGET - Date.now();

    if (diff <= 0) {
      el.textContent = 'The symposium is here';
      return false;
    }

    var s = Math.floor(diff / 1000);
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600);  s -= h * 3600;
    var m = Math.floor(s / 60);
    var sec = s - m * 60;

    // Matches the live site's format: 369d  7h  35m  53s
    el.innerHTML = '<span>' + d + 'd</span>' +
                   '<span>' + h + 'h</span>' +
                   '<span>' + pad(m) + 'm</span>' +
                   '<span>' + pad(sec) + 's</span>';
    return true;
  }

  var countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    renderCountdown(countdownEl);
    var timer = setInterval(function () {
      if (!renderCountdown(countdownEl)) clearInterval(timer);
    }, 1000);
  }

  /* ---------- live marine heatwave map ---------- */
  // Regenerated daily on our own host at about 05:00 UTC. The date query string
  // means each visitor fetches it at most once per UTC day.
  var mapEl = document.getElementById('mhw-map');
  if (mapEl) {
    mapEl.addEventListener('error', function () {
      var panel = document.getElementById('map-panel');
      if (panel) panel.classList.add('is-failed');
    });
    mapEl.src = 'https://timesareachangin.com/MarineHeatwaves/MHWlive/latest.png?_='
              + new Date().toISOString().slice(0, 10);
  }

  /* ---------- Perth page: activity filtering ---------- */
  // The filter bar starts hidden in the HTML and is revealed here, so with
  // JavaScript unavailable visitors see every card and no dead controls.
  var bar = document.getElementById('filterbar');
  if (bar) {
    var chips   = Array.prototype.slice.call(bar.querySelectorAll('.chip'));
    var spots   = Array.prototype.slice.call(document.querySelectorAll('.spot'));
    var lists   = Array.prototype.slice.call(document.querySelectorAll('[data-cards]'));
    var heads   = Array.prototype.slice.call(document.querySelectorAll('[data-band]'));
    var notes   = Array.prototype.slice.call(document.querySelectorAll('[data-band-note]'));
    var count   = document.getElementById('filtercount');
    var empty   = document.getElementById('emptynote');
    var active  = [];

    bar.hidden = false;

    function tagsOf(el) {
      return (el.getAttribute('data-tags') || '').split(/\s+/).filter(Boolean);
    }

    function apply() {
      var shown = 0;

      spots.forEach(function (spot) {
        // No filter selected shows everything; otherwise match ANY selected tag,
        // which is more useful here than requiring all of them.
        var match = active.length === 0 || tagsOf(spot).some(function (t) {
          return active.indexOf(t) !== -1;
        });
        spot.hidden = !match;
        if (match) shown++;
      });

      // Collapse a whole band when nothing in it survived the filter.
      lists.forEach(function (list, i) {
        var any = Array.prototype.some.call(list.querySelectorAll('.spot'), function (s) {
          return !s.hidden;
        });
        list.hidden = !any;
        if (heads[i]) heads[i].hidden = !any;
        if (notes[i]) notes[i].hidden = !any;
      });

      if (empty) empty.style.display = shown === 0 ? 'block' : 'none';

      if (count) {
        count.textContent = active.length === 0
          ? 'Showing all ' + spots.length + ' places.'
          : 'Showing ' + shown + ' of ' + spots.length + ' places.';
      }

      chips.forEach(function (c) {
        var f = c.getAttribute('data-filter');
        c.setAttribute('aria-pressed',
          f === 'all' ? String(active.length === 0) : String(active.indexOf(f) !== -1));
      });
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-filter');
        if (f === 'all') {
          active = [];
        } else {
          var i = active.indexOf(f);
          if (i === -1) active.push(f); else active.splice(i, 1);
        }
        apply();
      });
    });

    apply();
  }

  /* ---------- optional images ---------- */
  // Each slot names a file. If the file exists it replaces the placeholder;
  // if not, the labelled placeholder stays and nothing looks broken.
  var slots = document.querySelectorAll('[data-shot]');
  Array.prototype.forEach.call(slots, function (slot) {
    var file = slot.getAttribute('data-shot');
    // Slots default to the Perth card folder; data-dir overrides it.
    var dir  = slot.getAttribute('data-dir') || 'assets/img/perth/';
    var src  = dir + file;
    var probe = new Image();
    probe.onload = function () {
      var img = document.createElement('img');
      img.src = src;
      img.className = 'shot';
      img.loading = 'lazy';
      img.alt = slot.getAttribute('data-alt') || '';

      // Most Commons licences require visible attribution. If the slot carries a
      // credit, render it under the image; the wrapper keeps them together.
      var credit = slot.getAttribute('data-credit');
      if (credit) {
        var box = document.createElement('div');
        box.className = 'shot-wrap';
        var cap = document.createElement('p');
        cap.className = 'shot-credit';
        var url = slot.getAttribute('data-credit-url');
        if (url) {
          var a = document.createElement('a');
          a.href = url; a.target = '_blank'; a.rel = 'noopener';
          a.textContent = credit;
          cap.appendChild(a);
        } else {
          cap.textContent = credit;
        }
        box.appendChild(img);
        box.appendChild(cap);
        slot.replaceWith(box);
      } else {
        slot.replaceWith(img);
      }
    };
    probe.src = src;
  });
})();


/* ============================================================
   EXPANDABLE BIOGRAPHIES — printing
   ------------------------------------------------------------
   A collapsed <details> hides its contents in a way CSS cannot override, so
   printing the keynotes page would otherwise produce names with no text under
   them. Open everything before the print dialog and restore afterwards, so the
   reader's own open/closed choices survive.
   ============================================================ */
(function () {
  var panels = document.querySelectorAll('details.bio');
  if (!panels.length || !window.matchMedia) return;

  var wasOpen = [];

  function expand() {
    wasOpen = [];
    Array.prototype.forEach.call(panels, function (d, i) {
      wasOpen[i] = d.open;
      d.open = true;
    });
  }
  function restore() {
    Array.prototype.forEach.call(panels, function (d, i) { d.open = wasOpen[i]; });
  }

  window.addEventListener('beforeprint', expand);
  window.addEventListener('afterprint', restore);

  /* Safari fires neither event; it only flips the print media query. */
  var mq = window.matchMedia('print');
  var onChange = function (e) { (e.matches ? expand : restore)(); };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener) mq.addListener(onChange);
})();
