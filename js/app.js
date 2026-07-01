/**
 * Main initialization
 */

(function () {
  'use strict';

  var currentCategory = 'all';
  var debounceTimer = null;

  // --- Theme ---
  function initTheme() {
    var saved = localStorage.getItem('prompt-gallery-theme');
    if (saved === 'light') {
      document.body.classList.add('light-mode');
    }
  }

  function toggleTheme() {
    document.body.classList.toggle('light-mode');
    var isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('prompt-gallery-theme', isLight ? 'light' : 'dark');
  }

  // --- Search debounce ---
  function debounce(fn, delay) {
    return function () {
      var args = arguments;
      var context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  // --- Init ---
  async function init() {
    initTheme();

    var prompts = await loadPrompts();
    renderGallery(prompts);

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Search
    var searchInput = document.getElementById('search');
    var debouncedSearch = debounce(function () {
      searchPrompts(searchInput.value);
    }, 300);
    searchInput.addEventListener('input', debouncedSearch);

    // Category filters
    var catBtns = document.querySelectorAll('.filter-btn:not(.model-filter)');
    catBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        catBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        filterByCategory(currentCategory);

        // Also re-run search if there's a query
        var query = searchInput.value.trim();
        if (query) {
          searchPrompts(query);
        }
      });
    });

    // Model filters
    var modelBtns = document.querySelectorAll('.model-filter');
    modelBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        modelBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        filterByModel(btn.dataset.model);
      });
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
