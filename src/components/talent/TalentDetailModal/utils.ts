export function normalizeLanguages(value?: string | string[] | null): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => `${v}`.trim()).filter(Boolean);

  const raw = value.trim();
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map((v) => `${v}`.trim()).filter(Boolean);
  } catch {
    // Ignore JSON parse errors and fall back to string parsing
  }

  const byDelimiter = raw.split(/[,;|\/\n]+/).map((v) => v.trim()).filter(Boolean);
  if (byDelimiter.length > 1) return byDelimiter;

  const byCamelCase = raw.split(/(?=[A-Z])/).map((v) => v.trim()).filter(Boolean);
  if (byCamelCase.length > 1) return byCamelCase;

  return [raw];
}
