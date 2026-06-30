import { type Attendee } from "@/data/attendees";

/**
 * Minimal, dependency-free CSV parser. Handles quoted fields, escaped quotes
 * ("" inside quotes), commas inside quotes, and CRLF/LF line endings.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }

  // flush trailing field/row (file without trailing newline)
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

/**
 * Turn parsed CSV rows into Attendee[]. Expects a header row containing
 * company / name / title columns (case-insensitive, any order).
 */
export function rowsToAttendees(rows: string[][]): Attendee[] {
  if (rows.length === 0) return [];

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const ci = header.indexOf("company");
  const ni = header.indexOf("name");
  const ti = header.indexOf("title");

  // If there is no recognizable header, assume column order company,name,title.
  const [c, n, t] = ci === -1 && ni === -1 && ti === -1 ? [0, 1, 2] : [ci, ni, ti];
  const dataRows = ci === -1 && ni === -1 && ti === -1 ? rows : rows.slice(1);

  return dataRows
    .map((r) => ({
      company: (r[c] ?? "").trim(),
      name: (r[n] ?? "").trim(),
      title: (r[t] ?? "").trim(),
    }))
    .filter((a) => a.company && a.name);
}
