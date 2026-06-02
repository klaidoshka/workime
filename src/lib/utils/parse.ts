import type { Note } from "$lib/representation/note";
import type { Project } from "$lib/representation/project";

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
}

export default ParseUtils;