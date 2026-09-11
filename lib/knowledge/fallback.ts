const FALLBACK_KNOWLEDGE: Record<
  string,
  {
    category: string;
    care_domains: string[];
    handover_questions: string[];
    safety_considerations: string[];
    general_care_notes: string[];
  }
> = {
  dog: {
    category: "dog",
    care_domains: ["feeding", "exercise", "sleep", "grooming", "behaviour", "medical", "environment"],
    handover_questions: [
      "What does the pet normally eat?",
      "How often does the pet eat?",
      "Does the pet have any feeding preferences or dislikes?",
      "What situations make the pet uncomfortable?",
      "What does the pet usually do during a normal day?",
    ],
    safety_considerations: [
      "Record any changes in appetite, energy, breathing, hydration, or behaviour.",
      "Ask whether symptoms are recent or ongoing before treating them as routine.",
    ],
    general_care_notes: [
      "Dogs generally need consistent routines for feeding, exercise, rest, and safe environments.",
      "Care details should be confirmed with the owner before being treated as facts about the individual pet.",
    ],
  },
  cat: {
    category: "cat",
    care_domains: ["feeding", "litter", "sleep", "behaviour", "grooming", "medical", "environment"],
    handover_questions: [
      "What does the pet usually eat and when?",
      "Where does the pet usually sleep or rest?",
      "What does the pet dislike or avoid?",
      "What kinds of activities or spaces help the pet feel safe?",
    ],
    safety_considerations: [
      "Ask whether appetite, litter habits, hydration, or mobility have changed recently.",
      "Flag sudden hiding, lethargy, vomiting, or breathing issues for veterinary attention.",
    ],
    general_care_notes: [
      "Cats often have strong preferences for routine, resting spaces, and environmental comfort.",
      "A cat's individual routine and preferences should be captured from the owner rather than assumed.",
    ],
  },
  bird: {
    category: "bird",
    care_domains: ["feeding", "sleep", "environment", "social", "behaviour", "medical"],
    handover_questions: [
      "What does the pet normally eat and how often?",
      "What noises, handling patterns, or routines help the pet feel safe?",
      "Does the pet prefer interaction, quiet time, or specific spaces?",
    ],
    safety_considerations: [
      "Monitor changes in vocalising, appetite, droppings, or activity level.",
      "Ask whether the bird's behaviour is typical or a recent change.",
    ],
    general_care_notes: [
      "Birds can be highly sensitive to routine, environmental changes, and social handling.",
      "General care information should not replace the owner's details about the individual bird.",
    ],
  },
  rabbit: {
    category: "rabbit",
    care_domains: ["feeding", "exercise", "grooming", "social", "environment", "medical"],
    handover_questions: [
      "What is the rabbit's usual feeding routine?",
      "Does the rabbit prefer quiet spaces, company, or independent time?",
      "What makes the rabbit settle or feel comfortable?",
    ],
    safety_considerations: [
      "Ask whether appetite, droppings, or social behaviour has changed.",
      "Sudden lethargy or reduced eating should be treated as a veterinary concern.",
    ],
    general_care_notes: [
      "Rabbits usually benefit from calm routines, safe spaces, and predictable feeding and social patterns.",
      "Owner-provided habits should take priority over general rabbit care assumptions.",
    ],
  },
  guinea_pig: {
    category: "guinea_pig",
    care_domains: ["feeding", "sleep", "social", "environment", "grooming", "medical"],
    handover_questions: [
      "What does the pet normally eat and how often?",
      "Does the pet prefer social time or quiet time?",
      "What sounds or spaces make the pet feel relaxed?",
    ],
    safety_considerations: [
      "Check for appetite changes, vocalising changes, or reduced movement.",
      "If the pet is unwell for more than a brief period, ask the owner to contact a vet.",
    ],
    general_care_notes: [
      "Guinea pigs often do best with stable routines and consistent social and environmental conditions.",
      "General care guidance should support, not replace, the owner's knowledge of the individual pet.",
    ],
  },
  hamster: {
    category: "hamster",
    care_domains: ["feeding", "sleep", "behaviour", "environment", "medical"],
    handover_questions: [
      "What does the pet normally eat and when?",
      "Does the pet prefer quiet spaces, tunnels, or specific enrichment?",
      "What behaviour is typical for this pet?",
    ],
    safety_considerations: [
      "Watch for appetite changes, reduced activity, or unusual hiding.",
      "Ask whether the change is routine or recent before assuming it is normal.",
    ],
    general_care_notes: [
      "Hamsters often need predictable routines and low-stress environments.",
      "General species context should not be used as evidence of the individual pet's preferences.",
    ],
  },
  fish: {
    category: "fish",
    care_domains: ["feeding", "water", "temperature", "environment", "behaviour", "medical"],
    handover_questions: [
      "What does the fish normally eat and how often?",
      "What environment does the fish normally live in?",
      "Are there any known stress triggers or unusual behaviours?",
    ],
    safety_considerations: [
      "Check whether any change is recent and whether the water, behaviour, or appetite has shifted.",
      "If the fish is rapidly declining, seek veterinary advice from a qualified aquatic specialist.",
    ],
    general_care_notes: [
      "Fish care depends heavily on species, water conditions, and environment.",
      "General fish care context should not replace individual husbandry details supplied by the owner.",
    ],
  },
  reptile: {
    category: "reptile",
    care_domains: ["feeding", "temperature", "humidity", "light", "environment", "medical"],
    handover_questions: [
      "What does the pet normally eat and how often?",
      "What environment conditions does the pet usually need?",
      "What behaviours or conditions are normal for this pet?",
    ],
    safety_considerations: [
      "Ask whether appetite, basking, hydration, or stool output have changed recently.",
      "General husbandry should be confirmed with the owner rather than assumed.",
    ],
    general_care_notes: [
      "Reptiles often have very specific environmental and husbandry requirements.",
      "Species context is best used to ask better questions, not to define the individual pet.",
    ],
  },
  turtle: {
    category: "turtle",
    care_domains: ["feeding", "temperature", "water", "environment", "medical"],
    handover_questions: [
      "What does the pet normally eat and how often?",
      "What water, heat, or enclosure conditions does the pet usually need?",
      "What behaviours are typical for this pet?",
    ],
    safety_considerations: [
      "Check for reduced appetite, abnormal behaviour, or poor activity levels.",
      "Ask whether any change is recent before assuming it is normal.",
    ],
    general_care_notes: [
      "Turtles often need stable environment, temperature, and feeding patterns.",
      "The owner's observations should remain the primary source of truth for the individual turtle.",
    ],
  },
  tortoise: {
    category: "tortoise",
    care_domains: ["feeding", "temperature", "humidity", "environment", "medical"],
    handover_questions: [
      "What does the pet usually eat and when?",
      "What environment conditions does the pet prefer?",
      "What activity or routine is normal for this pet?",
    ],
    safety_considerations: [
      "Ask whether appetite, hydration, or behaviour has changed.",
      "Unusual lethargy or reduced eating should prompt veterinary guidance.",
    ],
    general_care_notes: [
      "Tortoises need temperature, humidity, and feeding stability that varies by species.",
      "Species-level information should not override the owner's individual pet details.",
    ],
  },
  ferret: {
    category: "ferret",
    care_domains: ["feeding", "play", "sleep", "social", "environment", "medical"],
    handover_questions: [
      "What does the pet normally eat and when?",
      "Does the pet enjoy social interaction or quiet time?",
      "What activities or spaces keep the pet comfortable?",
    ],
    safety_considerations: [
      "Ask whether appetite, hydration, or behaviour has shifted recently.",
      "Sudden dramatic behaviour changes should be checked with a vet.",
    ],
    general_care_notes: [
      "Ferrets often need structured routines and enriched environments.",
      "Owner-provided personal habits remain more important than broad species assumptions.",
    ],
  },
  other: {
    category: "other",
    care_domains: ["feeding", "environment", "sleep", "behaviour", "medical"],
    handover_questions: [
      "What does the pet normally eat and when?",
      "What makes the pet feel secure or comfortable?",
      "What is a typical day like for this pet?",
    ],
    safety_considerations: [
      "Ask whether the care routine has changed recently.",
      "Any significant appetite, hydration, or behaviour change deserves owner attention and potential vet guidance.",
    ],
    general_care_notes: [
      "When the species is uncertain, focus on direct owner information and basic care routines before applying general species assumptions.",
      "This fallback is intended to help the interview continue without guessing.",
    ],
  },
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getFallbackKnowledge(message: string | null | undefined) {
  if (!message) {
    return null;
  }

  const normalized = normalizeText(message);
  if (!normalized) {
    return null;
  }

  const matches = Object.entries(FALLBACK_KNOWLEDGE).find(([key, _]) => normalized.includes(key));
  if (matches) {
    const [, config] = matches;
    return {
      category: config.category,
      care_domains: config.care_domains,
      handover_questions: config.handover_questions,
      safety_considerations: config.safety_considerations,
      general_care_notes: config.general_care_notes,
    };
  }

  const fallback = FALLBACK_KNOWLEDGE.other;
  return {
    category: fallback.category,
    care_domains: fallback.care_domains,
    handover_questions: fallback.handover_questions,
    safety_considerations: fallback.safety_considerations,
    general_care_notes: fallback.general_care_notes,
  };
}
