const VISIBLE_TAG_LIMIT = 3;

export function TagList({
  tags,
  limit = VISIBLE_TAG_LIMIT,
}: Readonly<{ tags: string[]; limit?: number }>) {
  if (tags.length === 0) return null;

  const visible = tags.slice(0, limit);
  const overflowCount = tags.length - visible.length;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {visible.map((tag) => (
        <li
          key={tag}
          className="rounded-md bg-surface px-1.5 py-0.5 text-[11px] font-medium text-foreground/60 border border-border"
        >
          {tag}
        </li>
      ))}
      {overflowCount > 0 && (
        <li className="rounded-md px-1.5 py-0.5 text-[11px] font-medium text-foreground/45">
          +{overflowCount} more
        </li>
      )}
    </ul>
  );
}
