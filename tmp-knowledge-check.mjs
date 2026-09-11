import { getAnimalContext } from './lib/knowledge/index.ts';
import { getGbifTaxonomyContext, shouldCheckSpeciesContext } from './lib/gbif.ts';

const scenarios = [
  'I have a Labrador named Bruno.',
  'My Labrador hates hand-feeding.',
  'My Labrador only eats when I hand-feed him.',
  "My Labrador isn't eating today.",
  'I have a cockatiel named Rio.',
  "Rio doesn't like being touched.",
  'I have a Sulcata tortoise.',
  'My rabbit likes being held.',
  'My rabbit hates being held.',
  "My dog hasn't eaten for two days and is vomiting."
];

for (const text of scenarios) {
  const shouldCheck = shouldCheckSpeciesContext(text);
  const gbif = shouldCheck ? await getGbifTaxonomyContext(text) : null;
  const animal = shouldCheck ? await getAnimalContext({ userMessage: text, conversation: text }) : null;

  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: text }]
    })
  });

  const payload = await response.json();

  console.log(JSON.stringify({
    scenario: text,
    status: response.status,
    providerUsed: animal?.sources ?? [],
    gbif,
    knowledgeSummary: animal?.summary ?? null,
    geminiResponse: payload,
    shouldCheckSpeciesContext: shouldCheck,
    fallbackTriggered: !animal || animal.sources.includes('fallback')
  }, null, 2));
}
