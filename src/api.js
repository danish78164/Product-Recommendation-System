import PRODUCTS from './products';

const CATALOG_JSON = JSON.stringify(
  PRODUCTS.map(({ id, name, category, price, rating, tags }) => ({
    id, name, category, price, rating, tags,
  }))
);

/**
 * Calls Groq AI API (100% FREE) with the user's query.
 * Returns { ids: number[], reasoning: string }
 */
export async function getRecommendations(userQuery) {
  const apiKey = process.env.REACT_APP_GROQ_API_KEY;

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error('Missing API key. Add your Groq key to the .env file.');
  }

  const systemPrompt = `You are a helpful product recommendation assistant.
Given a product catalog and a user preference query, return ONLY a valid JSON object — no markdown, no backticks, no extra text.

Format:
{
  "ids": [list of recommended product IDs, most relevant first, max 6],
  "reasoning": "one-sentence explanation of why these match"
}

Product Catalog:
${CATALOG_JSON}`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userQuery },
      ],
      temperature: 0.3,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err?.error?.message || `API error ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json();
  const raw = data?.choices?.[0]?.message?.content || '';
  const clean = raw.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(clean);
  } catch {
    throw new Error('Could not parse AI response. Please try again.');
  }
}
