import TimeUtils from "$lib/utils/time";

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

export function calculateDuration(timeFrom: string, timeTo: string): string {
  if (!timeFrom || !timeTo || timeFrom.length < 5 || timeTo.length < 5) {
    return "";
  }

  const start = TimeUtils.stringToMinutes(timeFrom);
  const end = TimeUtils.stringToMinutes(timeTo);

  if (start === undefined || end === undefined || end < start) {
    return "";
  }

  return TimeUtils.formatMinutes(end - start);
}
