export async function getGlobalAnimalGuideContext(_query: string | null | undefined): Promise<string[] | null> {
  const endpoint = process.env.GLOBAL_ANIMAL_GUIDE_BASE_URL;

  if (!endpoint) {
    return null;
  }

  try {
    const url = new URL(endpoint);
    url.searchParams.set("q", (_query ?? "").trim() || "animal");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      if (!response.ok) {
        return null;
      }

      const payload = (await response.json()) as Record<string, unknown>;
      const text = typeof payload.summary === "string"
        ? payload.summary
        : typeof payload.description === "string"
          ? payload.description
          : null;

      if (!text) {
        return null;
      }

      return [text.trim()];
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return null;
  }
}
