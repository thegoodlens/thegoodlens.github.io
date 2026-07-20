(function () {
  /* ---------- Theme toggle (icon-only sun/moon) ---------- */

  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var STORAGE_KEY = 'good-lens-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggle) {
      toggle.textContent = theme === 'dark' ? '\u2600' : '\u263E'; // sun : moon
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));

  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* ignore */ }
    });
  }

  /* ---------- Collapsing topbar on scroll (every page) ---------- */

  var topbar = document.querySelector('.topbar');
  if (topbar) {
    var SCROLL_THRESHOLD = 40;
    function updateTopbar() {
      topbar.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
    }
    window.addEventListener('scroll', updateTopbar, { passive: true });
    updateTopbar();
  }

  /* ---------- Entry pages: reading time + scroll progress bar ---------- */

  var readTimeEl = document.getElementById('read-time');
  var entryBody = document.querySelector('.entry-body');
  if (readTimeEl && entryBody) {
    var words = entryBody.textContent.trim().split(/\s+/).length;
    var minutes = Math.max(1, Math.round(words / 200));
    readTimeEl.textContent = minutes + ' min read';
  }

  var progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    function updateProgress() {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progressBar.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------- Shared entry-index helpers ---------- */

  var ENTRIES = window.GOOD_LENS_ENTRIES || [];
  // On an entry page (inside /entries/), links/images need a "../" prefix
  // to reach the site root; on the homepage they don't.
  var PREFIX = document.body.classList.contains('has-hero') ? '../' : '';

  function byDateDesc(a, b) { return new Date(b.date) - new Date(a.date); }

  function entryCardHTML(entry) {
  var href = PREFIX + 'entries/' + entry.file;
  return (
    '<article class="entry-card">' +
      '<a class="entry-card__thumb" href="' + href + '"><img src="' + PREFIX + entry.thumb + '" alt=""></a>' +
      '<h2 class="entry-card__title"><a href="' + href + '">' + entry.title + '</a></h2>' +
      '<p class="entry-card__date">' + entry.dateDisplay + '</p>' +
    '</article>'
  );
}

  /* ---------- Entry page: fill in this entry's own tags ---------- */

  var currentFile = document.body.dataset.entryFile;
  var tagsEl = document.getElementById('entry-tags');
  var currentEntry = currentFile ? ENTRIES.filter(function (e) { return e.file === currentFile; })[0] : null;

  if (tagsEl && currentEntry) {
    tagsEl.innerHTML = currentEntry.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('');
  }

  /* ---------- Entry page: "more to read" — related by shared tags ---------- */

  var relatedEl = document.getElementById('related-posts');
  if (relatedEl && currentEntry) {
    var others = ENTRIES.filter(function (e) { return e.file !== currentFile; });

    others.forEach(function (e) {
      e._score = e.tags.filter(function (t) { return currentEntry.tags.indexOf(t) !== -1; }).length;
    });

    others.sort(function (a, b) {
      if (b._score !== a._score) return b._score - a._score;
      return byDateDesc(a, b);
    });

    var picks = others.slice(0, 3);
    if (picks.length > 0) {
      relatedEl.innerHTML =
        '<p class="related-posts__label">More to read</p>' +
        '<div class="related-posts__grid">' + picks.map(entryCardHTML).join('') + '</div>';
    }
  }

  /* ---------- Homepage: entry grid (built from ENTRIES) + pagination ---------- */

  var grid = document.getElementById('entry-grid');
  if (!grid) return;

  var sorted = ENTRIES.slice().sort(byDateDesc);
  var PAGE_SIZE = 9;
  var currentPage = 1;

  var prevBtn = document.getElementById('page-prev');
  var nextBtn = document.getElementById('page-next');
  var pageLabel = document.getElementById('page-label');

  function render() {
    var totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);
    var start = (currentPage - 1) * PAGE_SIZE;
    var end = start + PAGE_SIZE;

    grid.innerHTML = sorted.slice(start, end).map(entryCardHTML).join('');

    pageLabel.textContent = 'Page ' + currentPage + ' of ' + totalPages;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
  }

  prevBtn.addEventListener('click', function () { currentPage--; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  nextBtn.addEventListener('click', function () { currentPage++; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

  render();
})();
