class TimeUtils {
  static stringToMinutes(timeStr: string): number | undefined {
    if (!timeStr) {
      return undefined;
    }

    const [hours, minutes] = timeStr.split(":").map(Number);

    return hours * 60 + minutes;
  }

  static formatMinutes(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  static formatRelativeDate(date: Date): string {
    const diffMs = Date.now() - date.getTime();
    const diffDays = Math.floor(diffMs / 86_400_000);

    if (diffDays < 0) {
      return "Just now";
    }

    if (diffDays === 0) {
      return "Today";
    }

    if (diffDays === 1) {
      return "Yesterday";
    }

    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }

    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }
}

export default TimeUtils;
