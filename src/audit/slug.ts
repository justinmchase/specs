/** The GitHub-style slug of one heading's text, before de-duplication. */
export function slug(heading: string): string {
  return heading
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/\s/g, "-");
}

/**
 * The anchors GitHub gives a Markdown document's headings, skipping fenced
 * code blocks and numbering repeated slugs `-1`, `-2`, and so on.
 */
export function headingSlugs(markdown: string): Set<string> {
  const slugs = new Set<string>();
  const counts = new Map<string, number>();
  let fence: string | undefined;
  for (const line of markdown.split(/\r?\n/)) {
    const marker = /^\s*(`{3,}|~{3,})/.exec(line)?.[1];
    if (marker) {
      if (fence === undefined) fence = marker[0];
      else if (marker[0] === fence) fence = undefined;
      continue;
    }
    if (fence !== undefined) continue;
    const heading = /^#{1,6}\s+(.*?)\s*#*\s*$/.exec(line)?.[1];
    if (heading === undefined) continue;
    const base = slug(heading);
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    slugs.add(count === 0 ? base : `${base}-${count}`);
  }
  return slugs;
}
