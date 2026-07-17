const WORK_ORDER_CODE_PATTERN = /^WO-\d{5}$/;

export const normalizeWorkOrderNo = (workOrderNo: string): string => {
  const normalizedWorkOrderNo = workOrderNo.toUpperCase();
  if (!WORK_ORDER_CODE_PATTERN.test(normalizedWorkOrderNo)) {
    throw new Error(
      "Work order number format is invalid. Expected format: WO-00012",
    );
  }

  return normalizedWorkOrderNo;
};

export const generateWorkOrderNo = (existingWorkOrderNos: string[]): string => {
  let maxSequence = 0;

  for (const workOrderNo of existingWorkOrderNos) {
    const suffix = workOrderNo.slice(3);
    const sequence = Number.parseInt(suffix, 10);
    if (!Number.isNaN(sequence)) {
      maxSequence = Math.max(maxSequence, sequence);
    }
  }

  return `WO-${String(maxSequence + 1).padStart(5, "0")}`;
};
