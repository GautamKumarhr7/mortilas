const COMPANY_CODE = 'MECPL';

const CATEGORY_CODE_MAP: Record<string, string> = {
  Civil: 'CIV',
  Electrical: 'ELEC',
  HVAC: 'HVAC',
  Solar: 'SOLR',
  Interior: 'INT',
  Security: 'SEC',
  Composite: 'COMP',
};

const PROJECT_CODE_PATTERN = /^MECPL-(CIV|ELEC|HVAC|SOLR|INT|SEC|COMP)-\d{4}-\d{3}$/;

export const normalizeProjectCode = (projectCode: string): string => {
  const normalizedProjectCode = projectCode.toUpperCase();
  if (!PROJECT_CODE_PATTERN.test(normalizedProjectCode)) {
    throw new Error('Project code format is invalid. Expected format: MECPL-ELEC-2025-001');
  }

  return normalizedProjectCode;
};

export const getProjectCategoryCode = (category: string): string => {
  const categoryCode = CATEGORY_CODE_MAP[category];
  if (!categoryCode) {
    throw new Error('Project category is invalid');
  }

  return categoryCode;
};

export const buildProjectCodePrefix = (category: string, year: number): string => {
  return `${COMPANY_CODE}-${getProjectCategoryCode(category)}-${year}-`;
};

export const generateProjectCode = (
  category: string,
  existingProjectCodes: string[],
  year = new Date().getFullYear(),
): string => {
  const prefix = buildProjectCodePrefix(category, year);

  let maxSequence = 0;
  for (const projectCode of existingProjectCodes) {
    const suffix = projectCode.slice(prefix.length);
    const sequence = Number.parseInt(suffix, 10);
    if (!Number.isNaN(sequence)) {
      maxSequence = Math.max(maxSequence, sequence);
    }
  }

  return `${prefix}${String(maxSequence + 1).padStart(3, '0')}`;
};
