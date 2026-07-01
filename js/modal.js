/**
 * Modal functionality
 */

function openModal(prompt) {
  var overlay = document.getElementById('modal-overlay');

  document.getElementById('modal-image').src = prompt.image;
  document.getElementById('modal-image').alt = prompt.title;
  document.getElementById('modal-title').textContent = prompt.title;
  document.getElementById('modal-category').textContent = prompt.category;
  document.getElementById('modal-model').textContent = prompt.model;
  document.getElementById('modal-ar').textContent = prompt.aspect_ratio;
  document.getElementById('modal-prompt').textContent = prompt.prompt;
  document.getElementById('modal-negative').textContent = prompt.negative_prompt;

  // Tags
  var tagsContainer = document.getElementById('modal-tags');
  tagsContainer.innerHTML = '';
  if (prompt.tags && prompt.tags.length) {
    prompt.tags.forEach(function (tag) {
      var span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });
  }

  // Copy button data
  var copyPromptBtn = document.getElementById('copy-prompt');
  var copyNegativeBtn = document.getElementById('copy-negative');

  copyPromptBtn.onclick = function () {
    copyToClipboard(prompt.prompt, copyPromptBtn);
  };

  copyNegativeBtn.onclick = function () {
    copyToClipboard(prompt.negative_prompt, copyNegativeBtn);
  };

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  var overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function copyToClipboard(text, btn) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () {
      showCopyFeedback(btn);
    }).catch(function () {
      fallbackCopy(text, btn);
    });
  } else {
    fallbackCopy(text, btn);
  }
}

function fallbackCopy(text, btn) {
  var textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showCopyFeedback(btn);
  } catch (e) {
    console.error('Copy failed:', e);
  }
  document.body.removeChild(textarea);
}

// showCopyFeedback uses innerHTML only with a static SVG template,
// not user-controlled content, so XSS is not a concern.
function showCopyFeedback(btn) {
  var originalText = btn.innerHTML;
  btn.classList.add('copied');
  btn.innerHTML =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<polyline points="20 6 9 17 4 12"></polyline>' +
    '</svg> Copied!';

  showToast();

  setTimeout(function () {
    btn.classList.remove('copied');
    btn.innerHTML = originalText;
  }, 2000);
}

function showToast() {
  var toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(function () {
    toast.classList.remove('show');
  }, 1500);
}

// Close on overlay click
document.getElementById('modal-overlay').addEventListener('click', function (e) {
  if (e.target === this) {
    closeModal();
  }
});

// Close on ESC
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// Close button
document.getElementById('modal-close').addEventListener('click', function () {
  closeModal();
});
