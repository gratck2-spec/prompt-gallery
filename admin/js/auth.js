/* ============================================
   AUTH — Simple auth via Supabase + localStorage
   ============================================ */

const AUTH_KEY = 'prompt_gallery_session';

function getSupabaseClient() {
  return window._supabaseClient;
}

function isLoggedIn() {
  const session = localStorage.getItem(AUTH_KEY);
  if (!session) return false;
  try {
    const data = JSON.parse(session);
    if (data.expires_at && data.expires_at * 1000 < Date.now()) {
      localStorage.removeItem(AUTH_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function saveSession(session) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(AUTH_KEY);
}

function showLogin() {
  document.getElementById('login-overlay').style.display = 'flex';
  document.getElementById('admin-panel').style.display = 'none';
}

function hideLogin() {
  document.getElementById('login-overlay').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'block';
}

/* Initialize auth on DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  const SUPABASE_URL = 'https://eywuqzlsaqtxcshuiqhu.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5d3VxemxzYXF0eGNzaHVpcWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NzIwNTAsImV4cCI6MjA5ODQ0ODA1MH0.D4IeY083nAPOcSEWsQmg5G3gr_YkemU6TTS4BfwRj_A';

  window._supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // Check session
  if (isLoggedIn()) {
    hideLogin();
  } else {
    showLogin();
  }

  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const errorEl = document.getElementById('login-error');
      errorEl.textContent = '';

      if (!email || !password) {
        errorEl.textContent = 'Email and password are required';
        return;
      }

      const client = getSupabaseClient();
      const { data, error } = await client.auth.signInWithPassword({ email, password });

      if (error) {
        errorEl.textContent = error.message || 'Invalid credentials';
        return;
      }

      if (data && data.session) {
        saveSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at
        });
        hideLogin();
      }
    });
  }

  // Sign out
  const signOutBtn = document.getElementById('sign-out');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
      const client = getSupabaseClient();
      await client.auth.signOut();
      clearSession();
      showLogin();
    });
  }
});
