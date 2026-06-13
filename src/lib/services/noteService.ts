import { invokeBridge } from "$lib/bridge";
import ParseUtils from "$lib/utils/parse";
import TextUtils from "$lib/utils/text";
import type { Note, NoteAttachment } from "../representation/note";

export type NoteUpdates = Partial<{
  content: string;
  tags: string[];
  timeTakenFrom: Date | null;
  timeTakenTo: Date | null;
}>;

export async function fetchProjectNotes(projectId: number): Promise<Note[]> {
  const response = await invokeBridge<any[]>("query_project_notes", { projectId });

  return response.value?.map(n => ParseUtils.parseNote(n)) || [];
}

export async function createNote(
  projectId: number,
  content: string,
  timeFrom: Date | undefined,
  timeTo: Date | undefined,
  attachments: NoteAttachment[] = [],
): Promise<Note> {
  if (!projectId || (!content.trim() && attachments.length === 0)) {
    throw new Error("Invalid project ID or empty note content");
  }

  const from = timeFrom && timeTo ? timeFrom : undefined;
  const to = timeFrom && timeTo ? timeTo : undefined;

  const response = await invokeBridge<Note>("create_project_note", {
    projectId,
    content: content.trim(),
    tags: TextUtils.parseTagsFromText(content),
    timeTakenFrom: from?.toISOString(),
    timeTakenTo: to?.toISOString(),
  });


  return ParseUtils.parseNote(response.value);
}

export async function updateNote(
  id: number,
  updates: NoteUpdates,
): Promise<Note> {
  const response = await invokeBridge<Note>("edit_project_note", {
    id,
    ...updates
  });

  return ParseUtils.parseNote(response.value);
}

export async function removeNote(id: number): Promise<void> {
  await invokeBridge<void>("delete_project_note", {
    id
  });
}
