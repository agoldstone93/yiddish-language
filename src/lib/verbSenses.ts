import type { Verb } from "@/types/verb";

export function formatVerbMeanings(
  senses: Verb["senses"] | undefined,
  separator = "; ",
  fallback = "—"
): string {
  const text = senses?.map((s) => s.english).filter(Boolean).join(separator);
  return text && text.length > 0 ? text : fallback;
}