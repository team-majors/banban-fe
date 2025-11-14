const normalizeDate = (date?: string): string | undefined => {
  if (!date || typeof date !== "string") return undefined;
  const trimmed = date.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export default normalizeDate;
