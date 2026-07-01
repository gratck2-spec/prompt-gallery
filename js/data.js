let promptsData = [];

async function loadPrompts() {
  try {
    const res = await fetch('data/prompts.json');
    promptsData = await res.json();
    return promptsData;
  } catch (err) {
    console.error('Failed to load prompts:', err);
    return [];
  }
}
