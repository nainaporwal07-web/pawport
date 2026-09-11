export type GbifTaxonomicContext = {
  scientificName?: string;
  canonicalName?: string;
  rank?: string;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
};

const GBIF_SPECIES_MATCH_URL = "https://api.gbif.org/v1/species/match";

const SPECIES_HINTS = [
  "dog",
  "puppy",
  "cat",
  "kitten",
  "horse",
  "bird",
  "parrot",
  "canary",
  "rabbit",
  "bunny",
  "hamster",
  "guinea pig",
  "guinea-pig",
  "mouse",
  "rat",
  "ferret",
  "fish",
  "goldfish",
  "turtle",
  "snake",
  "lizard",
  "gecko",
  "chameleon",
  "hedgehog",
  "frog",
  "axolotl",
  "bearded dragon",
  "cockatiel",
  "budgie",
  "tortoise",
  "sheep",
  "goat",
  "cow",
  "pig",
  "chicken",
  "duck",
  "alpaca",
  "llama",
  "donkey",
  "rabbit",
  "guppy",
  "betta",
  "beagle",
  "labrador",
  "bulldog",
  "poodle",
  "corgi",
  "german shepherd",
  "golden retriever",
  "husky",
  "siamese",
  "maine coon",
  "bengal",
  "tabby",
  "chihuahua",
  "border collie",
  "cockapoo",
  "dachshund",
  "shih tzu",
  "pomeranian",
  "french bulldog",
  "staffordshire bull terrier",
];

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCandidateTerm(message: string): string | null {
  const normalized = normalizeText(message);

  if (!normalized) {
    return null;
  }

  const speciesHintMatch = SPECIES_HINTS.find((hint) => normalized.includes(hint));
  if (speciesHintMatch) {
    return speciesHintMatch;
  }

  const breedOrSpeciesPattern = /(?:breed|species|type)\s+(?:is\s+)?([a-z0-9][a-z0-9\s-]{1,40})/i;
  const breedMatch = message.match(breedOrSpeciesPattern);
  if (breedMatch?.[1]) {
    return breedMatch[1].trim();
  }

  const directLookupPattern = /(?:my|our|pet|animal|dog|cat|puppy|kitten|bird|rabbit)\s+(?:is|named|called)\s+([a-z0-9][a-z0-9\s-]{1,40})/i;
  const directMatch = message.match(directLookupPattern);
  if (directMatch?.[1]) {
    return directMatch[1].trim();
  }

  return null;
}

export function shouldCheckSpeciesContext(message: string | null | undefined): boolean {
  if (!message) {
    return false;
  }

  const normalized = normalizeText(message);
  if (!normalized) {
    return false;
  }

  return SPECIES_HINTS.some((hint) => normalized.includes(hint));
}

export async function getGbifTaxonomyContext(message: string | null | undefined): Promise<GbifTaxonomicContext | null> {
  if (!message || !shouldCheckSpeciesContext(message)) {
    return null;
  }

  const candidate = extractCandidateTerm(message);
  if (!candidate) {
    return null;
  }

  const url = new URL(GBIF_SPECIES_MATCH_URL);
  url.searchParams.set("name", candidate);
  url.searchParams.set("strict", "false");
  url.searchParams.set("verbose", "true");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as Record<string, unknown>;
    if (!payload || typeof payload !== "object") {
      return null;
    }

    const scientificName = typeof payload.scientificName === "string" ? payload.scientificName.trim() : "";
    const canonicalName = typeof payload.canonicalName === "string" ? payload.canonicalName.trim() : scientificName;

    if (!scientificName && !canonicalName) {
      return null;
    }

    const context: GbifTaxonomicContext = {
      scientificName: scientificName || canonicalName,
      canonicalName: canonicalName || scientificName,
      rank: typeof payload.rank === "string" ? payload.rank : undefined,
      kingdom: typeof payload.kingdom === "string" ? payload.kingdom : undefined,
      phylum: typeof payload.phylum === "string" ? payload.phylum : undefined,
      class: typeof payload.class === "string" ? payload.class : undefined,
      order: typeof payload.order === "string" ? payload.order : undefined,
      family: typeof payload.family === "string" ? payload.family : undefined,
      genus: typeof payload.genus === "string" ? payload.genus : undefined,
      species: typeof payload.species === "string" ? payload.species : undefined,
    };

    const hasUsefulData = Object.values(context).some((value) => typeof value === "string" && value.trim().length > 0);
    return hasUsefulData ? context : null;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown GBIF API error";
    console.warn("[PawPort GBIF lookup failed]", {
      candidate,
      message,
    });
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
