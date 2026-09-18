// Two-letter avatar initials from a name, falling back to the email's local part.
export function initialsFor(user: { name?: string | null; email: string }) {
  const source = user.name?.trim() || user.email.split("@")[0];
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : source.slice(0, 2);
  return letters.toUpperCase();
}
