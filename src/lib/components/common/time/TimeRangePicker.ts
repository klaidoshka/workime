import TimeUtils from "$lib/utils/time";

export function dateToTimeString(d: Date | undefined): string {
  if (!d || !(d instanceof Date) || isNaN(d.getTime())) {
    return "";
  }

  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function applyStringToDate(timeStr: string, originalDate: Date | undefined): Date | undefined {
  if (!timeStr || timeStr.length < 5) {
    return undefined;
  }

  const [hours, minutes] = timeStr.split(":").map(Number);

  const baseDate = originalDate instanceof Date && !isNaN(originalDate.getTime())
    ? new Date(originalDate)
    : new Date();

  baseDate.setHours(hours, minutes, 0, 0);

  return baseDate;
}

export function formatInputString(value: string): string {
  let digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length >= 2) {
    const hours = Math.min(parseInt(digits.slice(0, 2), 10), 23);

    digits = String(hours).padStart(2, "0") + digits.slice(2);
  }

  if (digits.length === 4) {
    const minutes = Math.min(parseInt(digits.slice(2, 4), 10), 59);

    digits = digits.slice(0, 2) + String(minutes).padStart(2, "0");
  }

  return digits.length > 2
    ? `${digits.slice(0, 2)}:${digits.slice(2)}`
    : digits;
}

export function autocompleteTime(timeStr: string): string {
  if (!timeStr) {
    return "";
  }

  const digits = timeStr.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  let finalHours = "00";
  let finalMinutes = "00";

  if (digits.length === 1 || digits.length === 2) {
    const h = Math.min(parseInt(digits, 10), 23);

    finalHours = String(h).padStart(2, "0");
  } else if (digits.length === 3) {
    const h = Math.min(parseInt(digits.slice(0, 1), 10), 23);
    const m = Math.min(parseInt(digits.slice(1), 10), 59);

    finalHours = String(h).padStart(2, "0");
    finalMinutes = String(m).padStart(2, "0");
  } else if (digits.length === 4) {
    const h = Math.min(parseInt(digits.slice(0, 2), 10), 23);
    const m = Math.min(parseInt(digits.slice(2), 10), 59);

    finalHours = String(h).padStart(2, "0");
    finalMinutes = String(m).padStart(2, "0");
  }

  return `${finalHours}:${finalMinutes}`;
}

export function calculateDuration(timeFrom: Date | undefined, timeTo: Date | undefined): string {
  if (!timeFrom || !timeTo || !(timeFrom instanceof Date) || !(timeTo instanceof Date)) {
    return "";
  }

  let diffInMinutes = Math.floor((timeTo.getTime() - timeFrom.getTime()) / (1000 * 60));

  if (diffInMinutes < 0) {
    return "";
  }

  return TimeUtils.formatMinutes(diffInMinutes);
}