export type KnowledgeItem = {
  label: string;
  detail: string;
};

export type AnimalKnowledgeContext = {
  summary: string | null;
  sources: string[];
  generalFacts: string[];
  breedTendencies: string[];
  safetyNotes: string[];
  fallbackNotes: string[];
};

export type AnimalContextQuery = {
  userMessage?: string | null;
  species?: string | null;
  breed?: string | null;
  conversation?: string | null;
};
