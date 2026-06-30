export interface Attendee {
  /** Exact company name as it should display, e.g. "Atlas Offshore Drilling" */
  company: string;
  /** Full name as it should display, e.g. "Tunde Bakare" */
  name: string;
  /** Job title as it should display, e.g. "Drilling Superintendent" */
  title: string;
}

/**
 * SLUG CONVENTION for logo filenames: lowercase, spaces -> hyphens, strip any
 * char that is not a-z, 0-9, or hyphen. Used as /logos/{slug}.png.
 * Implemented once and reused everywhere a slug is needed.
 */
export function slugifyCompany(company: string): string {
  return company
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Safety net only. The live data is loaded from /attendees.csv at runtime
 * (see useAttendees). This renders if the CSV is missing or empty so the
 * screen is never blank.
 */
export const FALLBACK_ATTENDEES: Attendee[] = [
  { company: "Atlas Offshore Drilling", name: "Tunde Bakare", title: "Drilling Superintendent" },
  { company: "Atlas Offshore Drilling", name: "Sarah Whitman", title: "Rig Manager" },
  { company: "Atlas Offshore Drilling", name: "Emeka Nwankwo", title: "Toolpusher" },
  { company: "Atlas Offshore Drilling", name: "Lena Petrova", title: "HSE Lead" },
  { company: "Meridian Energy", name: "Yomi Oladipo", title: "Operations Manager" },
  { company: "Meridian Energy", name: "David Chen", title: "Reservoir Engineer" },
  { company: "Meridian Energy", name: "Grace Okafor", title: "Asset Manager" },
  { company: "Meridian Energy", name: "Marcus Hale", title: "Project Director" },
];
