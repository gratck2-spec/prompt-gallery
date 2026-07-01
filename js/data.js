let promptsData = [];

const SUPABASE_URL = 'https://eywuqzlsaqtxcshuiqhu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5d3VxemxzYXF0eGNzaHVpcWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NzIwNTAsImV4cCI6MjA5ODQ0ODA1MH0.D4IeY083nAPOcSEWsQmg5G3gr_YkemU6TTS4BfwRj_A';

async function loadPrompts() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/prompts?select=*&published=eq.true&order=created_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );
    
    if (!res.ok) throw new Error('Failed to fetch');
    
    promptsData = await res.json();
    return promptsData;
  } catch (err) {
    console.error('Failed to load prompts from Supabase, falling back to static:', err);
    
    // Fallback to static JSON
    try {
      const res = await fetch('data/prompts.json');
      promptsData = await res.json();
      return promptsData;
    } catch (e) {
      console.error('Failed to load static prompts:', e);
      return [];
    }
  }
}
