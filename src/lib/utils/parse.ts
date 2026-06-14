import type { Note } from "$lib/representation/note";
import type { Project, RecentProject } from "$lib/representation/project";
import TimeUtils from "./time";

class ParseUtils {
  static parseProject(value: any): Project {
    return {
      ...value,
      createdAt: new Date(value.created_at),
      modifiedAt: value.modified_at ? new Date(value.modified_at) : undefined,
      expectedCompletionHours: value.expected_completion_hours,
      scratchPad: value.scratch_pad
    };
  }

  static parseNote(value: any): Note {
    return {
      ...value,
      createdAt: new Date(value.created_at),
      modifiedAt: value.modified_at ? new Date(value.modified_at) : undefined,
      timeTakenFrom: value.time_taken_from ? new Date(value.time_taken_from) : undefined,
      timeTakenTo: value.time_taken_to ? new Date(value.time_taken_to) : undefined,
    };
  }

  static parseRecentProject(p: any): RecentProject {
    const baseProject = ParseUtils.parseProject(p);

    return {
      ...baseProject,
      loggedMinutes: p.logged_minutes,
      lastEntryLabel: p.last_entry_at ? TimeUtils.formatRelativeDate(new Date(p.last_entry_at)) : "no entries",
    };
  }
}

export default ParseUtils;
