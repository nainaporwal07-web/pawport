export type PetProfileValue = string | null;

export type IndividualPetProfile = {
  identity: {
    name: PetProfileValue;
    species: PetProfileValue;
    sex: PetProfileValue;
    age: PetProfileValue;
  };
  speciesBreed: {
    breed: PetProfileValue;
    mixedBreed: PetProfileValue;
    primaryBreed: PetProfileValue;
  };
  feeding: {
    food: PetProfileValue;
    mealCount: PetProfileValue;
    mealTimes: PetProfileValue;
    quantity: PetProfileValue;
    treats: PetProfileValue;
    foodsToAvoid: PetProfileValue;
    handFeeding: PetProfileValue;
  };
  water: {
    access: PetProfileValue;
    amount: PetProfileValue;
    frequency: PetProfileValue;
    preference: PetProfileValue;
  };
  exercise: {
    routine: PetProfileValue;
    frequency: PetProfileValue;
    duration: PetProfileValue;
    needs: PetProfileValue;
  };
  sleep: {
    schedule: PetProfileValue;
    location: PetProfileValue;
    preferences: PetProfileValue;
  };
  grooming: {
    brushing: PetProfileValue;
    bathing: PetProfileValue;
    coatCare: PetProfileValue;
    products: PetProfileValue;
  };
  behaviour: {
    aroundPeople: PetProfileValue;
    aroundAnimals: PetProfileValue;
    aggression: PetProfileValue;
    reactivity: PetProfileValue;
    separationAnxiety: PetProfileValue;
    quirks: PetProfileValue;
  };
  likes: {
    toys: PetProfileValue;
    treats: PetProfileValue;
    touch: PetProfileValue;
    handFeeding: PetProfileValue;
    affection: PetProfileValue;
  };
  dislikes: {
    touch: PetProfileValue;
    handFeeding: PetProfileValue;
    noises: PetProfileValue;
    beingHeld: PetProfileValue;
    other: PetProfileValue;
  };
  triggers: {
    noises: PetProfileValue;
    strangers: PetProfileValue;
    touch: PetProfileValue;
    other: PetProfileValue;
  };
  comfortPreferences: {
    restingPlaces: PetProfileValue;
    settlingMethods: PetProfileValue;
    objects: PetProfileValue;
  };
  socialPreferences: {
    interaction: PetProfileValue;
    company: PetProfileValue;
    handling: PetProfileValue;
  };
  medicalInformation: {
    conditions: PetProfileValue;
    notes: PetProfileValue;
    mobility: PetProfileValue;
    emergencyInstructions: PetProfileValue;
  };
  medications: {
    current: PetProfileValue;
    schedule: PetProfileValue;
    administration: PetProfileValue;
  };
  allergies: {
    foods: PetProfileValue;
    medications: PetProfileValue;
    environmental: PetProfileValue;
  };
  vaccinations: {
    status: PetProfileValue;
    lastUpdated: PetProfileValue;
  };
  environment: {
    homeSetup: PetProfileValue;
    preferredSpace: PetProfileValue;
    hazards: PetProfileValue;
  };
  specialInstructions: {
    careNotes: PetProfileValue;
    handlingNotes: PetProfileValue;
    routines: PetProfileValue;
  };
};

export type PetProfileUpdate = {
  identity?: Partial<IndividualPetProfile["identity"]>;
  speciesBreed?: Partial<IndividualPetProfile["speciesBreed"]>;
  feeding?: Partial<IndividualPetProfile["feeding"]>;
  water?: Partial<IndividualPetProfile["water"]>;
  exercise?: Partial<IndividualPetProfile["exercise"]>;
  sleep?: Partial<IndividualPetProfile["sleep"]>;
  grooming?: Partial<IndividualPetProfile["grooming"]>;
  behaviour?: Partial<IndividualPetProfile["behaviour"]>;
  likes?: Partial<IndividualPetProfile["likes"]>;
  dislikes?: Partial<IndividualPetProfile["dislikes"]>;
  triggers?: Partial<IndividualPetProfile["triggers"]>;
  comfortPreferences?: Partial<IndividualPetProfile["comfortPreferences"]>;
  socialPreferences?: Partial<IndividualPetProfile["socialPreferences"]>;
  medicalInformation?: Partial<IndividualPetProfile["medicalInformation"]>;
  medications?: Partial<IndividualPetProfile["medications"]>;
  allergies?: Partial<IndividualPetProfile["allergies"]>;
  vaccinations?: Partial<IndividualPetProfile["vaccinations"]>;
  environment?: Partial<IndividualPetProfile["environment"]>;
  specialInstructions?: Partial<IndividualPetProfile["specialInstructions"]>;
};

export type PetProfileMemory = {
  ownerProvidedFacts: IndividualPetProfile;
  generalKnowledge: {
    summary: string | null;
    sources: string[];
    safetyNotes: string[];
  };
  safetyGuidance: string[];
};

const SPECIES_KEYWORDS = [
  "cockatiel",
  "tortoise",
  "rabbit",
  "dog",
  "cat",
  "bird",
  "hamster",
  "guinea pig",
  "fish",
  "ferret",
  "reptile",
  "turtle",
  "snake",
  "lizard",
  "parrot",
  "mouse",
  "rat",
  "hedgehog",
  "frog",
  "axolotl",
  "budgie",
  "canary",
  "bearded dragon",
  "gecko",
  "chameleon",
];

export function createEmptyPetProfile(): IndividualPetProfile {
  return {
    identity: {
      name: null,
      species: null,
      sex: null,
      age: null,
    },
    speciesBreed: {
      breed: null,
      mixedBreed: null,
      primaryBreed: null,
    },
    feeding: {
      food: null,
      mealCount: null,
      mealTimes: null,
      quantity: null,
      treats: null,
      foodsToAvoid: null,
      handFeeding: null,
    },
    water: {
      access: null,
      amount: null,
      frequency: null,
      preference: null,
    },
    exercise: {
      routine: null,
      frequency: null,
      duration: null,
      needs: null,
    },
    sleep: {
      schedule: null,
      location: null,
      preferences: null,
    },
    grooming: {
      brushing: null,
      bathing: null,
      coatCare: null,
      products: null,
    },
    behaviour: {
      aroundPeople: null,
      aroundAnimals: null,
      aggression: null,
      reactivity: null,
      separationAnxiety: null,
      quirks: null,
    },
    likes: {
      toys: null,
      treats: null,
      touch: null,
      handFeeding: null,
      affection: null,
    },
    dislikes: {
      touch: null,
      handFeeding: null,
      noises: null,
      beingHeld: null,
      other: null,
    },
    triggers: {
      noises: null,
      strangers: null,
      touch: null,
      other: null,
    },
    comfortPreferences: {
      restingPlaces: null,
      settlingMethods: null,
      objects: null,
    },
    socialPreferences: {
      interaction: null,
      company: null,
      handling: null,
    },
    medicalInformation: {
      conditions: null,
      notes: null,
      mobility: null,
      emergencyInstructions: null,
    },
    medications: {
      current: null,
      schedule: null,
      administration: null,
    },
    allergies: {
      foods: null,
      medications: null,
      environmental: null,
    },
    vaccinations: {
      status: null,
      lastUpdated: null,
    },
    environment: {
      homeSetup: null,
      preferredSpace: null,
      hazards: null,
    },
    specialInstructions: {
      careNotes: null,
      handlingNotes: null,
      routines: null,
    },
  };
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function pickFirstExplicitName(content: string, species?: string | null): string | null {
  const directNamed = content.match(/(?:my|our|pet|dog|cat|rabbit|bird|cockatiel|tortoise)\s+(?:named|called)\s+([A-Z][A-Za-z'-]+)/i);
  if (directNamed?.[1]) {
    return directNamed[1].trim();
  }

  const explicitAnimalNamePatterns = [
    /\b(?:my|our|pet)\s+(?:[A-Za-z'-]+\s+)?([A-Z][A-Za-z'-]+)\b/i,
    /\b(?:dog|cat|bird|rabbit|cockatiel|tortoise|labrador|labrador\s+retriever|golden\s+retriever)\s+([A-Z][A-Za-z'-]+)\b/i,
  ];

  for (const pattern of explicitAnimalNamePatterns) {
    const match = content.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  if (species) {
    const speciesPattern = new RegExp(`${escapeRegExp(species)}\\s+([A-Z][A-Za-z'-]+)\\b`, "i");
    const speciesMatch = content.match(speciesPattern);
    if (speciesMatch?.[1]) {
      return speciesMatch[1].trim();
    }
  }

  const names = Array.from(content.matchAll(/\b([A-Z][A-Za-z'-]+)\b/g)).map((match) => match[1]);
  const likelyName = names.find((candidate) => candidate && !/^(My|I|He|She|The|This|That|They|We|Our|His|Her|Their|Actually)$/i.test(candidate));
  return likelyName ?? null;
}

function resolveSpeciesAndBreed(content: string): { species: string | null; breed: string | null } {
  const normalized = normalizeText(content);

  if (/\blabrador(?:\s+retriever)?\b/i.test(content)) {
    return { species: "dog", breed: "Labrador Retriever" };
  }

  if (/\bgolden\s+retriever\b/i.test(content)) {
    return { species: "dog", breed: "Golden Retriever" };
  }

  if (/\b(?:beagle|poodle|bulldog|border\s+collie|chihuahua|shepherd|husky|dachshund|pomeranian|siamese|maine\s+coon|bengal)\b/i.test(content)) {
    const breed = content.match(/\b(?:beagle|poodle|bulldog|border\s+collie|chihuahua|shepherd|husky|dachshund|pomeranian|siamese|maine\s+coon|bengal)\b/i)?.[0];
    if (breed) {
      return { species: "dog", breed: breed.charAt(0).toUpperCase() + breed.slice(1) };
    }
  }

  if (/\bcockatiel\b/i.test(content)) {
    return { species: "bird", breed: null };
  }

  if (/\bsulcata\b.*\btortoise\b|\btortoise\b/i.test(content)) {
    return { species: "tortoise", breed: null };
  }

  if (/\brabbit\b/i.test(content)) {
    return { species: "rabbit", breed: null };
  }

  if (/\bdog\b/i.test(content)) {
    return { species: "dog", breed: null };
  }

  if (/\bcat\b/i.test(content)) {
    return { species: "cat", breed: null };
  }

  if (/\bbird\b|\bparrot\b|\bcanary\b|\bbudgie\b/i.test(content)) {
    return { species: "bird", breed: null };
  }

  if (/\b(?:fish|goldfish|guppy|betta)\b/i.test(content)) {
    return { species: "fish", breed: null };
  }

  if (/\b(?:turtle|reptile|snake|lizard|gecko|chameleon|bearded dragon|hedgehog|frog|axolotl)\b/i.test(content)) {
    return { species: "reptile", breed: null };
  }

  const species = [...SPECIES_KEYWORDS]
    .sort((a, b) => b.length - a.length)
    .find((keyword) => normalized.includes(keyword.toLowerCase()));

  return { species: species ? species.replace(/\s+/g, " ").trim() : null, breed: null };
}

function applyObjectUpdate<T extends Record<string, string | null | undefined>>(
  target: T,
  patch: Partial<T> | undefined
): T {
  if (!patch) {
    return target;
  }

  for (const key of Object.keys(patch) as Array<keyof T>) {
    const value = patch[key];
    if (value !== undefined) {
      target[key] = value;
    }
  }

  return target;
}

export function applyPetProfileUpdate(current: IndividualPetProfile, update: PetProfileUpdate): IndividualPetProfile {
  if (update.identity) {
    current.identity = applyObjectUpdate(current.identity, update.identity);
  }

  if (update.speciesBreed) {
    current.speciesBreed = applyObjectUpdate(current.speciesBreed, update.speciesBreed);
  }

  if (update.feeding) {
    current.feeding = applyObjectUpdate(current.feeding, update.feeding);
  }

  if (update.water) {
    current.water = applyObjectUpdate(current.water, update.water);
  }

  if (update.exercise) {
    current.exercise = applyObjectUpdate(current.exercise, update.exercise);
  }

  if (update.sleep) {
    current.sleep = applyObjectUpdate(current.sleep, update.sleep);
  }

  if (update.grooming) {
    current.grooming = applyObjectUpdate(current.grooming, update.grooming);
  }

  if (update.behaviour) {
    current.behaviour = applyObjectUpdate(current.behaviour, update.behaviour);
  }

  if (update.likes) {
    current.likes = applyObjectUpdate(current.likes, update.likes);
  }

  if (update.dislikes) {
    current.dislikes = applyObjectUpdate(current.dislikes, update.dislikes);
  }

  if (update.triggers) {
    current.triggers = applyObjectUpdate(current.triggers, update.triggers);
  }

  if (update.comfortPreferences) {
    current.comfortPreferences = applyObjectUpdate(current.comfortPreferences, update.comfortPreferences);
  }

  if (update.socialPreferences) {
    current.socialPreferences = applyObjectUpdate(current.socialPreferences, update.socialPreferences);
  }

  if (update.medicalInformation) {
    current.medicalInformation = applyObjectUpdate(current.medicalInformation, update.medicalInformation);
  }

  if (update.medications) {
    current.medications = applyObjectUpdate(current.medications, update.medications);
  }

  if (update.allergies) {
    current.allergies = applyObjectUpdate(current.allergies, update.allergies);
  }

  if (update.vaccinations) {
    current.vaccinations = applyObjectUpdate(current.vaccinations, update.vaccinations);
  }

  if (update.environment) {
    current.environment = applyObjectUpdate(current.environment, update.environment);
  }

  if (update.specialInstructions) {
    current.specialInstructions = applyObjectUpdate(current.specialInstructions, update.specialInstructions);
  }

  return current;
}

export function extractProfileFactsFromMessage(message: string): PetProfileUpdate {
  const trimmed = message.trim();
  if (!trimmed) {
    return {};
  }

  const { species, breed } = resolveSpeciesAndBreed(trimmed);
  const name = pickFirstExplicitName(trimmed, species);

  const update: PetProfileUpdate = {
    identity: {} as Partial<IndividualPetProfile["identity"]>,
    speciesBreed: {} as Partial<IndividualPetProfile["speciesBreed"]>,
    feeding: {} as Partial<IndividualPetProfile["feeding"]>,
    likes: {} as Partial<IndividualPetProfile["likes"]>,
    dislikes: {} as Partial<IndividualPetProfile["dislikes"]>,
    behaviour: {} as Partial<IndividualPetProfile["behaviour"]>,
    medicalInformation: {} as Partial<IndividualPetProfile["medicalInformation"]>,
    specialInstructions: {} as Partial<IndividualPetProfile["specialInstructions"]>,
  };

  if (name) {
    update.identity = { ...(update.identity ?? {}), name } as Partial<IndividualPetProfile["identity"]>;
  }

  if (species) {
    update.identity = { ...(update.identity ?? {}), species } as Partial<IndividualPetProfile["identity"]>;
  }

  if (breed) {
    update.speciesBreed = { ...(update.speciesBreed ?? {}), breed } as Partial<IndividualPetProfile["speciesBreed"]>;
  }

  if (/\b(?:he|she|him|her)\b.*\b(?:male|female)\b|\b(?:male|female)\b/i.test(trimmed)) {
    const sexMatch = trimmed.match(/\b(?:male|female)\b/i);
    if (sexMatch) {
      update.identity = { ...(update.identity ?? {}), sex: sexMatch[0] } as Partial<IndividualPetProfile["identity"]>;
    }
  }

  const handFeedingAttraction = /(?:only eats when|eats only when|will only eat when)(?:\s+(?:i|we|he|she|they))?\s+(?:i\s+)?hand[- ]feed(?:s|ing)?\s+(?:him|her|them|the pet)?/i;
  const handFeedingDislike = /(?:hates|dislikes|doesn't like|does not like|won't eat if)\s+(?:hand[- ]feeding|being hand[- ]fed|hand[- ]feed)/i;
  const handFeedingIndependent = /(?:now\s+)?eats\s+(?:independently|on\s+his\s+own|on\s+her\s+own|without\s+hand[- ]feeding)|(?:actually|now),?\s+(?:he|she)\s+(?:eats|eating)\s+(?:independently|without\s+hand[- ]feeding)/i;

  if (handFeedingDislike.test(trimmed)) {
    update.dislikes = { ...(update.dislikes ?? {}), handFeeding: "Hand-feeding" } as Partial<IndividualPetProfile["dislikes"]>;
    update.feeding = { ...(update.feeding ?? {}), handFeeding: "Explicitly dislikes hand-feeding." } as Partial<IndividualPetProfile["feeding"]>;
  }

  if (handFeedingAttraction.test(trimmed)) {
    update.likes = { ...(update.likes ?? {}), handFeeding: "Hand-feeding" } as Partial<IndividualPetProfile["likes"]>;
    update.dislikes = { ...(update.dislikes ?? {}), handFeeding: null } as Partial<IndividualPetProfile["dislikes"]>;
    update.feeding = { ...(update.feeding ?? {}), handFeeding: "Only eats when hand-fed." } as Partial<IndividualPetProfile["feeding"]>;
  }

  if (handFeedingIndependent.test(trimmed)) {
    update.likes = { ...(update.likes ?? {}), handFeeding: null } as Partial<IndividualPetProfile["likes"]>;
    update.dislikes = { ...(update.dislikes ?? {}), handFeeding: null } as Partial<IndividualPetProfile["dislikes"]>;
    update.feeding = { ...(update.feeding ?? {}), handFeeding: "Eats independently now." } as Partial<IndividualPetProfile["feeding"]>;
  }

  if (/\b(?:hates|dislikes|doesn't like|does not like)\s+being\s+held\b/i.test(trimmed)) {
    update.dislikes = { ...(update.dislikes ?? {}), beingHeld: "Being held" } as Partial<IndividualPetProfile["dislikes"]>;
  }

  if (/\blikes\s+being\s+held\b|\b(?:prefers|likes)\s+(?:being\s+held|touch)/i.test(trimmed)) {
    update.likes = { ...(update.likes ?? {}), touch: "Enjoys being held" } as Partial<IndividualPetProfile["likes"]>;
  }

  if (/\b(?:doesn't like|does not like|dislikes)\s+being\s+touched\b|\b(?:hates|dislikes)\s+touch/i.test(trimmed)) {
    update.dislikes = { ...(update.dislikes ?? {}), touch: "Being touched" } as Partial<IndividualPetProfile["dislikes"]>;
  }

  if (/\b(?:not eating|hasn't eaten|has not eaten|refusing food|won't eat)\b/i.test(trimmed) && /\b(?:vomiting|vomit|vomited)\b/i.test(trimmed)) {
    update.medicalInformation = {
      ...(update.medicalInformation ?? {}),
      notes: "Owner reported a possible appetite change with vomiting.",
    } as Partial<IndividualPetProfile["medicalInformation"]>;
  }

  if (/\b(?:doesn't like|does not like|dislikes|hates)\s+(?:noise|noises|loud\s+noises|strangers)\b/i.test(trimmed)) {
    update.triggers = { ...(update.triggers ?? {}), noises: "Avoids noise triggers" } as Partial<IndividualPetProfile["triggers"]>;
  }

  if (/\b(?:prefers|likes|loves)\s+(?:quiet|calm|routine)\b/i.test(trimmed)) {
    update.specialInstructions = { ...(update.specialInstructions ?? {}), routines: "Owner reports the pet prefers calm routines." } as Partial<IndividualPetProfile["specialInstructions"]>;
  }

  return update;
}

export function buildPetProfileFromConversation(messages: Array<{ role?: string; content?: string }>): IndividualPetProfile {
  const profile = createEmptyPetProfile();

  for (const message of messages) {
    if (message.role !== "user" || typeof message.content !== "string") {
      continue;
    }

    const update = extractProfileFactsFromMessage(message.content);
    applyPetProfileUpdate(profile, update);
  }

  return profile;
}

export function toLegacyProfileUpdate(profile: IndividualPetProfile): Record<string, unknown> {
  return {
    identity: {
      name: profile.identity.name,
      species: profile.identity.species,
      breed: profile.speciesBreed.breed,
      age: profile.identity.age,
      gender: profile.identity.sex,
    },
    feeding: {
      food: profile.feeding.food,
      mealTimings: profile.feeding.mealTimes,
      quantity: profile.feeding.quantity,
      treats: profile.feeding.treats,
      foodsToAvoid: profile.feeding.foodsToAvoid,
      handFeeding: profile.feeding.handFeeding,
    },
    routine: {
      wakeUp: null,
      walks: null,
      toilet: null,
      sleep: profile.sleep.schedule,
    },
    behaviour: {
      aroundPeople: profile.behaviour.aroundPeople,
      aroundAnimals: profile.behaviour.aroundAnimals,
      triggers: profile.triggers.other ?? profile.triggers.noises ?? profile.triggers.touch ?? null,
      otherQuirks: profile.behaviour.quirks,
      separationAnxiety: profile.behaviour.separationAnxiety,
      aggression: profile.behaviour.aggression,
    },
    comfort: {
      favouriteToys: profile.likes.toys,
      comfortObjects: profile.comfortPreferences.objects,
      calmingPreferences: profile.comfortPreferences.settlingMethods,
      dislikes: profile.dislikes.other ?? profile.dislikes.beingHeld ?? profile.dislikes.touch ?? null,
    },
    alerts: [
      profile.medicalInformation.notes,
      profile.allergies.foods,
      profile.medicalInformation.emergencyInstructions,
    ].filter((value): value is string => typeof value === "string" && value.trim().length > 0),
  };
}
