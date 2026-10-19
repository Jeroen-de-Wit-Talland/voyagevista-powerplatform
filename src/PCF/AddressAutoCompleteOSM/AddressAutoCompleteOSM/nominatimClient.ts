export interface IAddressSuggestion {
  id: number;
  displayName: string;
}

interface INominatimResult {
  place_id: number;
  display_name: string;
}

const SEARCH_URL = "https://nominatim.openstreetmap.org/search";

export async function searchAddresses(query: string, signal: AbortSignal): Promise<IAddressSuggestion[]> {
  const params = new URLSearchParams({ format: "jsonv2", limit: "5", q: query });
  const response = await fetch(`${SEARCH_URL}?${params.toString()}`, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Nominatim request failed (${response.status})`);
  }
  const results = (await response.json()) as INominatimResult[];
  return results.map((r) => ({ id: r.place_id, displayName: r.display_name }));
}
