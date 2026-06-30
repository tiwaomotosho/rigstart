import { useEffect, useState } from "react";

import { type Attendee, FALLBACK_ATTENDEES } from "@/data/attendees";
import { parseCsv, rowsToAttendees } from "@/lib/parseCsv";

export interface AttendeesResult {
  attendees: Attendee[] | null; // null while loading
  usedFallback: boolean;
}

/**
 * Loads attendee data from /attendees.csv at runtime. Editing the CSV and
 * refreshing updates the show — no rebuild needed. Falls back to a baked-in
 * list if the file is missing or unparseable, so the screen is never blank.
 */
export function useAttendees(): AttendeesResult {
  const [attendees, setAttendees] = useState<Attendee[] | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    let alive = true;

    fetch("/attendees.csv", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (!alive) return;
        const parsed = rowsToAttendees(parseCsv(text));
        if (parsed.length > 0) {
          setAttendees(parsed);
        } else {
          setAttendees(FALLBACK_ATTENDEES);
          setUsedFallback(true);
        }
      })
      .catch(() => {
        if (!alive) return;
        setAttendees(FALLBACK_ATTENDEES);
        setUsedFallback(true);
      });

    return () => {
      alive = false;
    };
  }, []);

  return { attendees, usedFallback };
}
