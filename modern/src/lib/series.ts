import legacySeries from "@/data/series.json";
import type { Series } from "@/lib/types";

export type { Series, SeriesVariation } from "@/lib/types";

export const series = legacySeries as Series[];

export function getSeries(id: string): Series | undefined {
  return series.find((item) => item.id === id);
}
