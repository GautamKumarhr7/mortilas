export const normalizeSequentialCode = (
  code: string,
  pattern: RegExp,
  expectedFormat: string,
): string => {
  const normalizedCode = code.toUpperCase();
  if (!pattern.test(normalizedCode)) {
    throw new Error(`Code format is invalid. Expected format: ${expectedFormat}`);
  }

  return normalizedCode;
};

export const generateSequentialCode = (
  prefix: string,
  existingCodes: string[],
  digits: number,
): string => {
  let maxSequence = 0;

  for (const code of existingCodes) {
    const suffix = code.slice(prefix.length);
    const sequence = Number.parseInt(suffix, 10);
    if (!Number.isNaN(sequence)) {
      maxSequence = Math.max(maxSequence, sequence);
    }
  }

  return `${prefix}${String(maxSequence + 1).padStart(digits, '0')}`;
};
