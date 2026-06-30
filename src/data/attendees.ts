export interface Attendee {
  /** Exact company name as it should display on screen, e.g. "Seplat Energy" */
  company: string;
  /** Full name as it should display, e.g. "Yomi Oladipo" */
  name: string;
  /** Job title as it should display, e.g. "Wells HSE Lead" */
  title: string;
}

/**
 * SLUG CONVENTION for logo filenames:
 * Lowercase the company name, replace every space with a hyphen, strip any
 * character that is not a-z, 0-9, or hyphen. Examples:
 *   "Seplat Energy"      -> "seplat-energy"
 *   "SLB"                 -> "slb"
 *   "Shelf Drilling Ltd." -> "shelf-drilling-ltd"
 * This slug is used as the exact filename (without extension ambiguity — always
 * .png) for that company's logo: /public/logos/{slug}.png
 * This function MUST be implemented exactly as described and exported so it is
 * reused everywhere a slug is needed (do not duplicate this logic elsewhere).
 */
export function slugifyCompany(company: string): string {
  return company
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export const attendees: Attendee[] = [
  { company: "Seplat Energy", name: "Yomi Oladipo", title: "Wells HSE Lead" },
  { company: "Seplat Energy", name: "Ikay Ogunmwonyi", title: "Head of Operations" },
  { company: "Seplat Energy", name: "Omolola Ani", title: "Director" },
  { company: "Seplat Energy", name: "Okenna Afamefuna", title: "Wells Manager" },
  { company: "Seplat Energy", name: "Gbenga Abe", title: "Drilling Superintendent" },
  { company: "Seplat Energy", name: "Sunday Fasubaa", title: "Operations Manager" },
  { company: "Seplat Energy", name: "Andrew Okon", title: "Business Services Lead" },
  { company: "Seplat Energy", name: "Samson Ezugworie", title: "Chief Operating Officer" },
  { company: "Seplat Energy", name: "Dr. Adeshina Sadiq", title: "Head of HSE" },
  { company: "Seplat Energy", name: "Elijah Akpomrughe", title: "Occupational Health Lead" },
  { company: "Shelf Drilling", name: "Jacob Sule", title: "Rig Manager" },
  { company: "Shelf Drilling", name: "Grace Nwosu", title: "HSE Coordinator" },
  { company: "Shelf Drilling", name: "Tunde Bakare", title: "Operations Lead" },
  { company: "SLB", name: "Jean-Marc Kloss", title: "Technical Advisor" },
  { company: "SLB", name: "Funke Adesanya", title: "Field Engineer" },
  { company: "Halliburton", name: "Michael Obi", title: "Cementing Specialist" },
  { company: "Halliburton", name: "Chiamaka Eze", title: "Drilling Fluids Engineer" },
  { company: "Halliburton", name: "Peter Johnson", title: "Wireline Supervisor" },
  { company: "Baker Hughes", name: "David Eze", title: "Completions Engineer" },
];
