import { invokeBridge } from "$lib/bridge";
import { DEFAULT_COLOR, DEFAULT_ICON } from "$lib/constants/projects";
import ParseUtils from "$lib/utils/parse";
import TextUtils from "$lib/utils/text";
import type { Note, NoteAttachment } from "../representation/note";
import type { Project } from "../representation/project";

class ProjectStore {
  selectedId = $state<number | undefined>(undefined);
  #projects = $state<Project[]>([]);
  #notes = $state<Record<string, Note[]>>({});

  constructor() {
    invokeBridge<Project[]>("query_projects").then(async (r) => {
      this.#projects = r.value?.map(p => ParseUtils.parseProject(p)) || [];

      if (this.projects.length <= 0) {
        return;
      }

      this.selectedId = this.projects[0].id;

      for (const project of this.projects) {
        await invokeBridge<any[]>("query_project_notes", { projectId: project.id }).then(r => {
          this.#notes[project.id] = r.value?.map(n => ParseUtils.parseNote(n)) || [];
        });
      }
    });
  }

  get projects() {
    return [...this.#projects].sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }

      return b.modifiedAt
        ? b.modifiedAt.getTime() - (
          a.modifiedAt
            ? a.modifiedAt.getTime()
            : a.createdAt.getTime()
        ) : b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  get currentProject() {
    return this.#projects.find(p => p.id === this.selectedId);
  }

  get currentNotes() {
    return this.selectedId && this.#notes[this.selectedId] || [];
  }

  async add(label: string): Promise<number> {
    return invokeBridge<Project>("create_project", {
      label,
      icon: DEFAULT_ICON,
      color: DEFAULT_COLOR
    }).then(r => {
      const project = ParseUtils.parseProject(r.value);

      this.#projects.push(project);
      this.#notes[project.id] = [];

      return project.id;
    });
  }

  async addNote(
    projectId: number,
    content: string,
    timeFrom: Date | undefined,
    timeTo: Date | undefined,
    attachments: NoteAttachment[] = [],
  ): Promise<number> {
    if (!projectId || (!content.trim() && attachments.length === 0)) {
      return Promise.reject(new Error("Invalid project ID or empty note content"));
    }

    if (!timeFrom || !timeTo) {
      timeFrom = undefined;
      timeTo = undefined;
    }

    const tags = TextUtils.parseTagsFromText(content);

    return invokeBridge<Note>("create_project_note", {
      projectId,
      content: content.trim(),
      tags,
      timeTakenFrom: timeFrom ? timeFrom.toISOString() : undefined,
      timeTakenTo: timeTo ? timeTo.toISOString() : undefined,
    }).then(r => {
      const note = ParseUtils.parseNote(r.value);
      const project = this.projects.find(p => p.id === projectId);

      if (project) {
        project.modifiedAt = new Date(note.createdAt);
      }

      if (!this.#notes[projectId]) {
        this.#notes[projectId] = [];
      }

      this.#notes[projectId].push(note);

      return note.id;
    });
  }

  updateIconAndColor(id: number, icon: string, color: string) {
    const project = this.#projects.find(p => p.id === id);

    if (project) {
      invokeBridge<Project>("edit_project", {
        id,
        icon,
        color,
      }).then((r) => {
        if (r.value) {
          const parsed = ParseUtils.parseProject(r.value);

          project.icon = parsed.icon;
          project.color = parsed.color;
          project.modifiedAt = parsed.modifiedAt;
        }
      });
    }
  }

  updateLabel(id: number, label: string) {
    const project = this.#projects.find(p => p.id === id);

    if (project) {
      invokeBridge<Project>("edit_project", {
        id,
        label: label.trim(),
      }).then((r) => {
        if (r.value) {
          const parsed = ParseUtils.parseProject(r.value);

          project.label = parsed.label;
          project.modifiedAt = parsed.modifiedAt;
        }
      });
    }
  }

  togglePin(id: number) {
    const project = this.#projects.find(p => p.id === id);

    if (project) {
      invokeBridge<Project>("edit_project", {
        id,
        pinned: !project.pinned,
      }).then((r) => {
        if (r.value) {
          const parsed = ParseUtils.parseProject(r.value);

          project.pinned = parsed.pinned;
          project.modifiedAt = parsed.modifiedAt;
        }
      });
    }
  }

  toggleProjectCompleted(id: number) {
    const project = this.#projects.find(p => p.id === id);

    if (project) {
      invokeBridge<Project>("edit_project", {
        id,
        completed: !project.completed,
      }).then((r) => {
        if (r.value) {
          const parsed = ParseUtils.parseProject(r.value);

          project.completed = parsed.completed;
          project.modifiedAt = parsed.modifiedAt;
        }
      });
    }
  }

  updateScratchpad(id: number, text: string) {
    const project = this.#projects.find(p => p.id === id);

    if (project) {
      invokeBridge<Project>("edit_project", {
        id,
        scratchPad: text.trim(),
      }).then((r) => {
        if (r.value) {
          const parsed = ParseUtils.parseProject(r.value);

          project.scratchPad = parsed.scratchPad;
          project.modifiedAt = parsed.modifiedAt;
        }
      });
    }
  }

  updateExpectedHours(id: number, hours: number) {
    const project = this.#projects.find(p => p.id === id);

    if (project && hours >= 0) {
      invokeBridge<Project>("edit_project", {
        id,
        expectedCompletionHours: hours,
      }).then((r) => {
        if (r.value) {
          const parsed = ParseUtils.parseProject(r.value);

          project.expectedCompletionHours = parsed.expectedCompletionHours;
          project.modifiedAt = parsed.modifiedAt;
        }
      });
    }
  }

  async delete(id: number) {
    const projectIndex = this.#projects.findIndex(p => p.id === id);

    if (projectIndex !== -1) {
      await invokeBridge<void>("delete_project", { id }).then(() => {
        delete this.#notes[id];
        this.#projects.splice(projectIndex, 1);

        if (this.selectedId === id) {
          if (this.projects.length > 0) {
            this.selectedId = this.projects[0].id;
          } else {
            this.selectedId = undefined;
          }
        }
      });
    }
  }

  async editNote(
    noteId: number,
    content: string,
    timeTakenFrom: Date | undefined,
    timeTakenTo: Date | undefined,
  ): Promise<void> {
    const tags = TextUtils.parseTagsFromText(content);

    return invokeBridge<Note>("edit_project_note", {
      noteId,
      content: content.trim(),
      tags,
      timeTakenFrom: timeTakenFrom ? timeTakenFrom.toISOString() : null,
      timeTakenTo: timeTakenTo ? timeTakenTo.toISOString() : null,
    }).then(r => {
      const updated = ParseUtils.parseNote(r.value);

      for (const projectId in this.#notes) {
        const idx = this.#notes[projectId].findIndex(n => n.id === noteId);

        if (idx !== -1) {
          this.#notes[projectId][idx] = updated;
          break;
        }
      }
    });
  }

  async deleteNote(noteId: number): Promise<void> {
    return invokeBridge<void>("delete_project_note", { noteId }).then(() => {
      for (const projectId in this.#notes) {
        const idx = this.#notes[projectId].findIndex(n => n.id === noteId);

        if (idx !== -1) {
          this.#notes[projectId].splice(idx, 1);
          break;
        }
      }
    });
  }
}

const instance = new ProjectStore();

export default instance;
