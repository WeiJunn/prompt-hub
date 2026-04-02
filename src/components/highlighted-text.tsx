import { highlightSegments } from "@/lib/search";

export function HighlightedText({
  text,
  query
}: {
  text: string;
  query: string;
}) {
  const segments = highlightSegments(text, query);

  return (
    <>
      {segments.map((segment, index) =>
        segment.highlighted ? (
          <mark
            key={`${segment.text}-${index}`}
            className="rounded bg-accent/25 px-1 text-foreground"
          >
            {segment.text}
          </mark>
        ) : (
          <span key={`${segment.text}-${index}`}>{segment.text}</span>
        )
      )}
    </>
  );
}
