import { type Attendee, slugifyCompany } from "@/data/attendees";

/** Max attendees shown on a single slide before splitting into another slide. */
export const MAX_PER_SLIDE = 4;

export interface CompanySlide {
  type: "company";
  company: string;
  logoSlug: string; // from slugifyCompany(company)
  people: Attendee[]; // 1–MAX_PER_SLIDE people for this slide
  layout: "single-column" | "two-column";
  slideIndexInCompany: number; // 0-based index of this slide within its company's slides
  totalSlidesForCompany: number; // total slide count for this company
}

/**
 * Preserve first-appearance order of companies and original relative order of
 * people. Chunk each company into slides of at most MAX_PER_SLIDE attendees.
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
    // 3. Chunk into groups of at most MAX_PER_SLIDE, preserving order. A company
    //    with more attendees splits across multiple slides.
    const chunks: Attendee[][] = [];
    for (let i = 0; i < people.length; i += MAX_PER_SLIDE) {
      chunks.push(people.slice(i, i + MAX_PER_SLIDE));
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
