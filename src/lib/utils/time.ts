class TimeUtils {
  static dateToMinutes(date: Date): number {
    if (!date) {
      return 0;
    }

    return date.getHours() * 60 + date.getMinutes();
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

  static getDurationText(from?: Date, to?: Date): string {
    if (!from || !to || !(from instanceof Date) || !(to instanceof Date)) {
      return "";
    }

    let diffInMinutes = Math.floor((to.getTime() - from.getTime()) / (1000 * 60));

    if (diffInMinutes < 0) {
      diffInMinutes += 24 * 60;
    }

    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }

  static formatMinutesToTime(date?: Date): string {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "";
    }

    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  }
}

export default TimeUtils;
