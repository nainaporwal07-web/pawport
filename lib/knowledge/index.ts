import { getGbifTaxonomyContext } from "@/lib/gbif";
import { getFallbackKnowledge } from "./fallback";
import { getDogBreedContext } from "./dogApi";
import { getGlobalAnimalGuideContext } from "./globalAnimalGuide";
import { getVeterinarySafetyContext } from "./veterinary";
import type { AnimalContextQuery, AnimalKnowledgeContext } from "./types";

function dedupe(values: string[]): string[] {
  return Array.from(new Set(values.filter((value) => value && value.trim().length > 0).map((value) => value.trim())));
}

function normalizeQuery(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export async function getAnimalContext({ userMessage, species, breed, conversation }: AnimalContextQuery): Promise<AnimalKnowledgeContext | null> {
  const querySource = [userMessage, species, breed, conversation].find((value) => typeof value === "string" && value.trim().length > 0);
  const query = querySource ? querySource.trim() : "";

  if (!query) {
    return null;
  }

  const generalFacts: string[] = [];
  const breedTendencies: string[] = [];
  const safetyNotes: string[] = [];
  const fallbackNotes: string[] = [];
  const sources: string[] = [];

  const gbifContext = await getGbifTaxonomyContext(query);
  if (gbifContext) {
    sources.push("gbif");
    const details = [
      gbifContext.scientificName ? `Scientific name: ${gbifContext.scientificName}.` : null,
      gbifContext.canonicalName ? `Canonical name: ${gbifContext.canonicalName}.` : null,
      gbifContext.rank ? `Taxonomic rank: ${gbifContext.rank}.` : null,
      gbifContext.family ? `Family: ${gbifContext.family}.` : null,
      gbifContext.genus ? `Genus: ${gbifContext.genus}.` : null,
      gbifContext.species ? `Species: ${gbifContext.species}.` : null,
    ].filter(Boolean) as string[];

    generalFacts.push(...details);
  }

  const dogContext = await getDogBreedContext(normalizeQuery(species) ? species : breed ?? query);
  if (dogContext) {
    sources.push("dog-api");
    breedTendencies.push(...dogContext);
  }

  const guideContext = await getGlobalAnimalGuideContext(normalizeQuery(species) ? species : breed ?? query);
  if (guideContext) {
    sources.push("global-animal-guide");
    generalFacts.push(...guideContext);
  }

  const fallback = getFallbackKnowledge(query);
  if (fallback) {
    sources.push("fallback");
    fallbackNotes.push(...fallback.general_care_notes, ...fallback.handover_questions.slice(0, 2));
  }

  const safetyContext = getVeterinarySafetyContext(query);
  if (safetyContext.length > 0) {
    sources.push("veterinary-safety");
    safetyNotes.push(...safetyContext);
  }

  const combined = dedupe([
    ...generalFacts,
    ...breedTendencies,
    ...fallbackNotes,
    ...safetyNotes,
  ]);

  if (combined.length === 0 && sources.length === 0) {
    return null;
  }

  const summary = combined.length > 0
    ? [
        "General species or breed context may be used only to ask better questions and provide broad context.",
        "This information must not be treated as evidence about the individual pet's preferences, routines, personality, behaviour, or medical condition.",
        ...combined,
      ].join(" ")
    : null;

  return {
    summary,
    sources: dedupe(sources),
    generalFacts: dedupe(generalFacts),
    breedTendencies: dedupe(breedTendencies),
    safetyNotes: dedupe(safetyNotes),
    fallbackNotes: dedupe(fallbackNotes),
  };
}
