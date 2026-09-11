export async function getDogBreedContext(query: string | null | undefined): Promise<string[] | null> {
  const dogApiKey = process.env.DOG_API_KEY;
  if (!dogApiKey) {
    return null;
  }

  const q = (query ?? "").trim();
  if (!q) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    try {
      const url = new URL("https://api.thedogapi.com/v1/breeds/search");
      url.searchParams.set("q", q);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "x-api-key": dogApiKey,
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        return null;
      }

      const payload = (await response.json()) as Array<Record<string, unknown>>;
      const first = payload[0];
      if (!first) {
        return null;
      }

      const weightValue =
        typeof first.weight === "object" && first.weight !== null
          ? (first.weight as { metric?: string | number | null })
          : undefined;
      const metricValue = weightValue?.metric;

      const parts: string[] = [];
      if (typeof first.bred_for === "string") {
        parts.push(`General breed context: historically bred for ${first.bred_for.toLowerCase()}.`);
      }
      if (typeof first.life_span === "string") {
        parts.push(`Typical lifespan range is ${first.life_span}.`);
      }
      if (typeof first.temperament === "string") {
        parts.push(`Common general temperament tendencies include ${first.temperament}.`);
      }
      if (typeof metricValue === "string" || typeof metricValue === "number") {
        parts.push(`Typical size context is approximately ${String(metricValue)} kg.`);
      }

      return parts.length > 0 ? parts : null;
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return null;
  }
}
