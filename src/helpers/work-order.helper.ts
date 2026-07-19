const WORK_ORDER_CODE_PATTERN = /^WO-[A-Z0-9-]+$/i;

export const normalizeWorkOrderNo = (workOrderNo: string): string => {
  const normalizedWorkOrderNo = workOrderNo.toUpperCase();
  if (!WORK_ORDER_CODE_PATTERN.test(normalizedWorkOrderNo)) {
    throw new Error('Work order number format is invalid. Expected format: WO-MECPL-ELEC-2026-001 or WO-00012');
  }

  return normalizedWorkOrderNo;
};

export const generateWorkOrderNo = (baseCode: string, existingWorkOrderNos: string[]): string => {
  let maxSequence = 0;

  for (const workOrderNo of existingWorkOrderNos) {
    if (workOrderNo.startsWith(baseCode)) {
      const parts = workOrderNo.split('-');
      const suffix = parts[parts.length - 1];
      const sequence = Number.parseInt(suffix, 10);
      if (!Number.isNaN(sequence)) {
        maxSequence = Math.max(maxSequence, sequence);
      }
    }
  }

  return `${baseCode}-${String(maxSequence + 1).padStart(3, '0')}`;
};
