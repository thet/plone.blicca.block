/** Everything the two renderers read. `unknown`, because nothing is required. */
export type Data = {
  title?: unknown;
  description?: unknown;
};

export function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function warnings(data: Data): string[] {
  const notes: string[] = [];

  if (!text(data.title)) {
    notes.push("No title given for the demo block.");
  }
  if (!text(data.description)) {
    notes.push("No description given for the demo block.");
  }
  return notes;
}
