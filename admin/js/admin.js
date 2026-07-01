/* ============================================
   ADMIN — Step Wizard Logic
   ============================================ */

(function() {
  'use strict';

  // ---- State ----
  let currentStep = 1;
  const totalSteps = 4;
  const state = {
    imageFile: null,
    imageUrl: null,
    thumbnailUrl: null,
    prompt: '',
    negative: '',
    model: 'Midjourney v6',
    category: 'portrait',
    title: '',
    tags: [],
    aspectRatio: '1:1'
  };

  // ---- Supabase Config ----
  const SUPABASE_URL = 'https://eywuqzlsaqtxcshuiqhu.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5d3VxemxzYXF0eGNzaHVpcWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NzIwNTAsImV4cCI6MjA5ODQ0ODA1MH0.D4IeY083nAPOcSEWsQmg5G3gr_YkemU6TTS4BfwRj_A';
  const STORAGE_BUCKET = 'images';

  function getClient() {
    return window._supabaseClient;
  }

  // ---- Notification ----
  function notify(message, type) {
    const el = document.getElementById('notification');
    el.textContent = message;
    el.className = 'notification ' + type;
    el.classList.add('show');
    setTimeout(() => { el.classList.remove('show'); }, 3000);
  }

  // ---- Loading ----
  function showLoading(text) {
    document.getElementById('loading-text').textContent = text || 'Loading...';
    document.getElementById('loading-overlay').style.display = 'flex';
  }
  function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
  }

  // ---- Step Navigation ----
  function goToStep(step) {
    if (step < 1 || step > totalSteps) return;
    if (step > currentStep + 1) return; // can't skip ahead

    currentStep = step;

    // Update wizard steps
    document.querySelectorAll('.wizard-step').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.step) === step);
    });

    // Update step indicator
    document.querySelectorAll('.step-item').forEach(el => {
      const s = parseInt(el.dataset.step);
      el.classList.remove('active', 'completed');
      if (s === step) el.classList.add('active');
      else if (s < step) el.classList.add('completed');
    });

    // Update buttons
    document.getElementById('btn-back').style.visibility = step === 1 ? 'hidden' : 'visible';

    const nextBtn = document.getElementById('btn-next');
    const publishBtn = document.getElementById('btn-publish');

    if (step === totalSteps) {
      nextBtn.style.display = 'none';
      publishBtn.style.display = 'inline-flex';
    } else {
      nextBtn.style.display = 'inline-flex';
      publishBtn.style.display = 'none';
    }

    // Update preview on step 4
    if (step === 4) {
      renderPreview();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function validateStep(step) {
    clearErrors();
    let valid = true;

    if (step === 1) {
      if (!state.imageFile) {
        notify('Please upload an image', 'error');
        valid = false;
      }
    } else if (step === 2) {
      const prompt = document.getElementById('prompt-text');
      state.prompt = prompt.value.trim();
      if (!state.prompt) {
        prompt.classList.add('invalid');
        valid = false;
      }
      state.negative = document.getElementById('negative-prompt').value.trim();
      state.model = document.getElementById('model-select').value;
      state.category = document.getElementById('category-select').value;
    } else if (step === 3) {
      const title = document.getElementById('title-input');
      state.title = title.value.trim();
      if (!state.title) {
        title.classList.add('invalid');
        valid = false;
      }
      const tagsStr = document.getElementById('tags-input').value.trim();
      state.tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];
      state.aspectRatio = document.querySelector('input[name="aspect"]:checked')?.value || '1:1';
    }

    if (!valid) {
      notify('Please fill in all required fields', 'error');
    }
    return valid;
  }

  function clearErrors() {
    document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
  }

  // ---- Image Upload ----
  function initUpload() {
    const zone = document.getElementById('upload-zone');
    const input = document.getElementById('file-input');
    const content = document.getElementById('upload-content');
    const preview = document.getElementById('upload-preview');
    const previewImg = document.getElementById('preview-image');
    const removeBtn = document.getElementById('remove-image');

    zone.addEventListener('click', (e) => {
      if (e.target === removeBtn || removeBtn.contains(e.target)) return;
      input.click();
    });

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleImage(file);
      }
    });

    input.addEventListener('change', () => {
      if (input.files[0]) {
        handleImage(input.files[0]);
      }
    });

    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.imageFile = null;
      state.imageUrl = null;
      state.thumbnailUrl = null;
      content.style.display = 'flex';
      preview.style.display = 'none';
      input.value = '';
    });
  }

  function handleImage(file) {
    if (file.size > 10 * 1024 * 1024) {
      notify('Image must be under 10MB', 'error');
      return;
    }
    state.imageFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('preview-image').src = e.target.result;
      document.getElementById('upload-content').style.display = 'none';
      document.getElementById('upload-preview').style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }

  // ---- Thumbnail Generation ----
  function generateThumbnail(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 600;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round(h * maxDim / w);
              w = maxDim;
            } else {
              w = Math.round(w * maxDim / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          canvas.toBlob((blob) => {
            resolve(new File([blob], 'thumb_' + file.name, { type: 'image/jpeg' }));
          }, 'image/jpeg', 0.8);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // ---- Upload to Supabase Storage ----
  async function uploadImage(file, path) {
    const client = getClient();
    const { data, error } = await client.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { upsert: false });

    if (error) throw error;

    const { data: urlData } = client.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(path);

    return urlData.publicUrl;
  }

  // ---- Preview ----
  function renderPreview() {
    document.getElementById('preview-final').src = state.imageUrl;
    document.getElementById('preview-category').textContent = state.category;
    document.getElementById('preview-model').textContent = state.model;
    document.getElementById('preview-ar').textContent = state.aspectRatio;
    document.getElementById('preview-title').textContent = state.title || 'Untitled';
    document.getElementById('preview-prompt').textContent = state.prompt || '—';
    document.getElementById('preview-negative').textContent = state.negative || '—';

    const tagsEl = document.getElementById('preview-tags');
    tagsEl.innerHTML = '';
    state.tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'preview-tag';
      span.textContent = tag;
      tagsEl.appendChild(span);
    });
  }

  // ---- Publish ----
  async function publish() {
    showLoading('Publishing...');
    try {
      const client = getClient();

      const { error } = await client.from('prompts').insert({
        image_url: state.imageUrl,
        thumbnail_url: state.thumbnailUrl,
        prompt: state.prompt,
        negative_prompt: state.negative,
        model: state.model,
        category: state.category,
        title: state.title,
        tags: state.tags,
        aspect_ratio: state.aspectRatio,
        published: true,
        created_at: new Date().toISOString()
      });

      hideLoading();

      if (error) throw error;

      document.getElementById('success-overlay').style.display = 'flex';
    } catch (err) {
      hideLoading();
      notify(err.message || 'Failed to publish', 'error');
    }
  }

  // ---- Reset for "Add Another" ----
  function resetWizard() {
    currentStep = 1;
    state.imageFile = null;
    state.imageUrl = null;
    state.thumbnailUrl = null;
    state.prompt = '';
    state.negative = '';
    state.model = 'Midjourney v6';
    state.category = 'portrait';
    state.title = '';
    state.tags = [];
    state.aspectRatio = '1:1';

    // Reset UI
    document.getElementById('file-input').value = '';
    document.getElementById('upload-content').style.display = 'flex';
    document.getElementById('upload-preview').style.display = 'none';
    document.getElementById('preview-image').src = '';
    document.getElementById('prompt-text').value = '';
    document.getElementById('negative-prompt').value = '';
    document.getElementById('model-select').value = 'Midjourney v6';
    document.getElementById('category-select').value = 'portrait';
    document.getElementById('title-input').value = '';
    document.getElementById('tags-input').value = '';
    const defaultRadio = document.querySelector('input[name="aspect"][value="1:1"]');
    if (defaultRadio) defaultRadio.checked = true;

    document.getElementById('success-overlay').style.display = 'none';
    goToStep(1);
  }

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', () => {
    initUpload();

    // Next button
    document.getElementById('btn-next').addEventListener('click', async () => {
      if (!validateStep(currentStep)) return;

      if (currentStep === 1 && state.imageFile && !state.imageUrl) {
        // Upload image on first advance from step 1
        showLoading('Uploading image...');
        try {
          const timestamp = Date.now();
          const ext = state.imageFile.name.split('.').pop() || 'jpg';
          const filePath = `uploads/${timestamp}.${ext}`;

          state.imageUrl = await uploadImage(state.imageFile, filePath);

          // Generate and upload thumbnail
          const thumb = await generateThumbnail(state.imageFile);
          const thumbPath = `uploads/thumb_${timestamp}.jpg`;
          state.thumbnailUrl = await uploadImage(thumb, thumbPath);

          hideLoading();
        } catch (err) {
          hideLoading();
          notify(err.message || 'Upload failed', 'error');
          return;
        }
      }

      goToStep(currentStep + 1);
    });

    // Back button
    document.getElementById('btn-back').addEventListener('click', () => {
      goToStep(currentStep - 1);
    });

    // Publish button
    document.getElementById('btn-publish').addEventListener('click', publish);

    // Add Another
    document.getElementById('btn-add-another').addEventListener('click', resetWizard);

    // Go to step 1
    goToStep(1);
  });
})();
