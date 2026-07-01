/**
 * Gallery rendering and filtering
 */

function renderGallery(prompts) {
  const grid = document.getElementById('gallery');
  const emptyState = document.getElementById('empty-state');
  grid.innerHTML = '';

  if (!prompts || prompts.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  grid.style.display = '';
  emptyState.style.display = 'none';

  prompts.forEach(function (p) {
    var card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = p.id;
    card.dataset.category = p.category;
    card.dataset.tags = (p.tags || []).join(',');

    card.innerHTML =
      '<div class="card-image-wrap">' +
        '<img class="card-image" src="' + p.thumbnail + '" alt="' + escapeHtml(p.title) + '" loading="lazy">' +
        '<div class="card-overlay">' +
          '<span class="card-title-overlay">' + escapeHtml(p.title) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="card-footer">' +
        '<span class="card-title">' + escapeHtml(p.title) + '</span>' +
        '<span class="card-badge">' + escapeHtml(p.category) + '</span>' +
      '</div>';

    card.addEventListener('click', function () {
      openModal(p);
    });

    grid.appendChild(card);
  });
}

function filterByCategory(cat) {
  var cards = document.querySelectorAll('.card');
  var hasVisible = false;

  cards.forEach(function (card) {
    if (cat === 'all' || card.dataset.category === cat) {
      card.classList.remove('hidden');
      hasVisible = true;
    } else {
      card.classList.add('hidden');
    }
  });

  var emptyState = document.getElementById('empty-state');
  var grid = document.getElementById('gallery');
  if (hasVisible) {
    grid.style.display = '';
    emptyState.style.display = 'none';
  } else {
    grid.style.display = 'none';
    emptyState.style.display = 'block';
  }
}

function searchPrompts(query) {
  var q = (query || '').toLowerCase().trim();
  var cards = document.querySelectorAll('.card');
  var hasVisible = false;

  if (!q) {
    cards.forEach(function (card) {
      card.classList.remove('hidden');
    });
    document.getElementById('gallery').style.display = '';
    document.getElementById('empty-state').style.display = 'none';
    return;
  }

  cards.forEach(function (card) {
    var title = card.querySelector('.card-title').textContent.toLowerCase();
    var tags = card.dataset.tags.toLowerCase();
    var category = card.dataset.category.toLowerCase();

    if (title.indexOf(q) !== -1 || tags.indexOf(q) !== -1 || category.indexOf(q) !== -1) {
      card.classList.remove('hidden');
      hasVisible = true;
    } else {
      card.classList.add('hidden');
    }
  });

  var emptyState = document.getElementById('empty-state');
  var grid = document.getElementById('gallery');
  if (hasVisible) {
    grid.style.display = '';
    emptyState.style.display = 'none';
  } else {
    grid.style.display = 'none';
    emptyState.style.display = 'block';
  }
}

// escapeHtml returns safely escaped text from a DOM text node.
// innerHTML assignments below only use this + static template strings,
// not raw user input, so XSS is not a concern here.
function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
