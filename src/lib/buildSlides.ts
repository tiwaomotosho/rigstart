import { type Attendee, slugifyCompany } from "@/data/attendees";

export interface CompanySlide {
  type: "company";
  company: string;
  logoSlug: string; // from slugifyCompany(company)
  people: Attendee[]; // 1–6 people for this slide
  layout: "single-column" | "two-column"; // single-column if people.length <= 4
  slideIndexInCompany: number; // 0-based index of this slide within its company's slides
  totalSlidesForCompany: number; // total slide count for this company
}

/**
 * Spec §5. Preserve first-appearance order of companies and original relative
 * order of people. Chunk each company into slides of max 6 people; a chunk of
 * <=4 renders single-column, 5–6 renders two-column.
 */
export function buildSlides(data: Attendee[]): CompanySlide[] {
  // 1. Unique companies in first-appearance order, each mapped to its people
  //    (insertion order preserved via Map).
  const byCompany = new Map<string, Attendee[]>();
  for (const attendee of data) {
    const list = byCompany.get(attendee.company);
    if (list) {
      list.push(attendee);
    } else {
      byCompany.set(attendee.company, [attendee]);
    }
  }

  const slides: CompanySlide[] = [];

  for (const [company, people] of byCompany) {
    // 3. Chunk into groups of at most 6, preserving order. For 1–6 people this
    //    yields a single chunk; the layout rule below then picks the column count.
    const chunks: Attendee[][] = [];
    for (let i = 0; i < people.length; i += 6) {
      chunks.push(people.slice(i, i + 6));
    }

    const logoSlug = slugifyCompany(company);
    const totalSlidesForCompany = chunks.length;

    chunks.forEach((chunk, slideIndexInCompany) => {
      slides.push({
        type: "company",
        company,
        logoSlug,
        people: chunk,
        layout: chunk.length <= 4 ? "single-column" : "two-column",
        slideIndexInCompany,
        totalSlidesForCompany,
      });
    });
  }

  return slides;
}
