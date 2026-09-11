const URGENT_SYMPTOM_PATTERNS = [
  "vomiting",
  "vomit",
  "diarrhea",
  "diarrhoea",
  "collapse",
  "difficulty breathing",
  "laboured breathing",
  "not eating",
  "refusing food",
  "lethargy",
  "unresponsive",
  "seizure",
  "bleeding",
  "blood",
  "severe pain",
  "shock",
  "struggling to breathe",
  "rapid breathing",
  "swollen",
  "abnormal breathing",
  "not drinking",
];

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

export function getVeterinarySafetyContext(message: string | null | undefined): string[] {
  if (!message) {
    return [];
  }

  const normalized = normalizeText(message);
  if (!normalized) {
    return [];
  }

  const matches = URGENT_SYMPTOM_PATTERNS.filter((pattern) => normalized.includes(pattern));
  if (matches.length === 0) {
    return [];
  }

  return [
    "General safety note: the user may be describing a potentially concerning health change. Ask clarifying questions about whether this is new, persistent, or worsening before assuming it is routine.",
    "Do not diagnose or prescribe treatment. Recommend veterinary assessment when symptoms are concerning, severe, persistent, or accompanied by appetite loss, vomiting, breathing issues, or severe lethargy.",
    `Detected concerns: ${matches.slice(0, 4).join(", ")}.`,
  ];
}
