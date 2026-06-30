import { type Attendee } from "@/data/attendees";
import { type CompanySlide } from "@/lib/buildSlides";

interface PeopleListProps {
  people: Attendee[];
  layout: CompanySlide["layout"];
}

const COLUMN_GAP = 80;
const TWO_COLUMN_WIDTH = 760;
const SINGLE_COLUMN_WIDTH = 1600;

/**
 * Spec §6.5. One person entry: a green accent bar + a name/title text stack,
 * inside a 100px-tall flex row.
 */
function PersonEntry({ person, columnWidth }: { person: Attendee; columnWidth: number }) {
  return (
    <div style={{ height: 100, display: "flex", alignItems: "center" }}>
      <div
        style={{
          width: 6,
          height: 56,
          background: "var(--green-500)",
          borderRadius: 3,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          marginLeft: 24,
          maxWidth: columnWidth - 30,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span style={{ color: "var(--navy-900)", fontWeight: 800, fontSize: 38, lineHeight: 1.1 }}>
          {person.name}
        </span>
        <span
          style={{
            color: "var(--slate-500)",
            fontWeight: 500,
            fontSize: 20,
            lineHeight: 1.2,
            marginTop: 6,
          }}
        >
          {person.title}
        </span>
      </div>
    </div>
  );
}

/**
 * Spec §6.4. People list container at (160,480), 1600×520. Single-column stacks
 * vertically; two-column fills column 1 top-to-bottom first, then column 2.
 */
export function PeopleList({ people, layout }: PeopleListProps) {
  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: 160,
    top: 480,
    width: 1600,
    height: 520,
  };

  if (layout === "single-column") {
    return (
      <div style={containerStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {people.map((person, i) => (
            <PersonEntry key={i} person={person} columnWidth={SINGLE_COLUMN_WIDTH} />
          ))}
        </div>
      </div>
    );
  }

  // two-column: column 1 gets the first ceil(n/2) people, column 2 the rest.
  const split = Math.ceil(people.length / 2);
  const columnOne = people.slice(0, split);
  const columnTwo = people.slice(split);

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", gap: COLUMN_GAP }}>
        <div
          style={{
            width: TWO_COLUMN_WIDTH,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {columnOne.map((person, i) => (
            <PersonEntry key={i} person={person} columnWidth={TWO_COLUMN_WIDTH} />
          ))}
        </div>
        <div
          style={{
            width: TWO_COLUMN_WIDTH,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {columnTwo.map((person, i) => (
            <PersonEntry key={i} person={person} columnWidth={TWO_COLUMN_WIDTH} />
          ))}
        </div>
      </div>
    </div>
  );
}
