import type { Note } from "$lib/representation/note";
import type { Project } from "$lib/representation/project";
import TimeUtils from "$lib/utils/time";

export function calculateDashboardStats(project: Project, notes: Note[]) {
  let totalMinutes = 0;
  let timedNoteCount = 0;

  notes.forEach((n) => {
    if (n.timeTakenFrom !== undefined && n.timeTakenTo !== undefined) {
      let diff = TimeUtils.dateToMinutes(n.timeTakenTo) - TimeUtils.dateToMinutes(n.timeTakenFrom);

      if (diff < 0) {
        diff += 24 * 60;
      }

      totalMinutes += diff;
      timedNoteCount += 1;
    }
  });

  const noteCount = notes.length;
  const avgSessionMinutes = timedNoteCount > 0 ? Math.round(totalMinutes / timedNoteCount) : 0;

  let daysActive = 1;

  if (project) {
    const start = new Date(project.createdAt).getTime();
    const end = project.completed ? new Date(project.modifiedAt || project.createdAt).getTime() : Date.now();

    daysActive = Math.max(1, Math.ceil(Math.max(0, end - start) / 86_400_000));
  }

  const dailyAvgMinutes = Math.round(totalMinutes / daysActive);
  const targetHours = project.expectedCompletionHours ?? 0;
  const loggedHours = totalMinutes / 60;
  const progressPercentage = targetHours > 0 ? Math.max(0, Math.round((loggedHours / targetHours) * 100)) : 0;
  const remainingHours = Math.max(0, targetHours - loggedHours);
  const remainingFormatted = remainingHours >= 1 ? `${remainingHours.toFixed(1)}h` : `${Math.round(remainingHours * 60)}m`;

  const lastActivity = notes.length
    ? new Date(Math.max(...notes.map((n) => n.createdAt.getTime())))
    : new Date(project.modifiedAt || project.createdAt);

  return {
    totalFormatted: TimeUtils.formatMinutes(totalMinutes),
    dailyAvgFormatted: TimeUtils.formatMinutes(dailyAvgMinutes),
    avgSessionFormatted: TimeUtils.formatMinutes(avgSessionMinutes),
    noteCount,
    timedNoteCount,
    daysActive,
    daysLabel: daysActive === 1 ? "day" : "days",
    progressPercentage,
    targetHours,
    remainingFormatted,
    lastActivityLabel: TimeUtils.formatRelativeDate(lastActivity),
    hasTimedNotes: timedNoteCount > 0,
  };
}
