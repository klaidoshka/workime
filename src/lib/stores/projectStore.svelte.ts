import type { NoteUpdates } from "$lib/services/noteService";
import * as NoteService from "$lib/services/noteService";
import type { ProjectUpdates } from "$lib/services/projectService";
import * as ProjectService from "$lib/services/projectService";
import type { Note, NoteAttachment } from "../representation/note";
import type { Project } from "../representation/project";

class ProjectStore {
  selectedId = $state<number | undefined>(undefined);
  #projects = $state<Project[]>([]);
  #notes = $state<Record<string, Note[]>>({});

  constructor() {
    this.#initialize();
  }

  async #initialize() {
    this.#projects = await ProjectService.fetchProjects();

    if (this.projects.length === 0) {
      return;
    }

    this.selectedId = this.projects[0].id;

    for (const project of this.projects) {
      this.#notes[project.id] = await NoteService.fetchProjectNotes(project.id);
    }
  }

  get projects() {
    return [...this.#projects].sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }

      return (b.modifiedAt ?? b.createdAt).getTime() - (a.modifiedAt ?? a.createdAt).getTime();
    });
  }

  get currentProject() {
    return this.#projects.find(p => p.id === this.selectedId);
  }

  get currentNotes() {
    return (this.selectedId && this.#notes[this.selectedId]) || [];
  }

  async recentlyUsedProjects(limit = 5) {
    return ProjectService.fetchRecentProjects(limit);
  }

  async add(label: string): Promise<number> {
    const project = await ProjectService.createProject(label);

    this.#projects.push(project);
    this.#notes[project.id] = [];

    return project.id;
  }

  async addNote(
    projectId: number,
    content: string,
    timeFrom: Date | undefined,
    timeTo: Date | undefined,
    attachments: NoteAttachment[] = [],
  ): Promise<number> {
    const note = await NoteService.createNote(projectId, content, timeFrom, timeTo, attachments);

    const project = this.#projects.find(p => p.id === projectId);

    if (project) {
      project.modifiedAt = new Date(note.createdAt);
    }

    this.#notes[projectId] ??= [];
    this.#notes[projectId].push(note);

    return note.id;
  }

  async #applyProjectUpdate(id: number, updates: ProjectUpdates) {
    const project = this.#projects.find(p => p.id === id);

    if (!project) {
      return;
    }

    const updated = await ProjectService.updateProject(id, updates);
    Object.assign(project, updated);
  }

  updateIconAndColor(id: number, icon: string, color: string) {
    this.#applyProjectUpdate(id, { icon, color });
  }

  updateLabel(id: number, label: string) {
    this.#applyProjectUpdate(id, { label: label.trim() });
  }

  togglePin(id: number) {
    const project = this.#projects.find(p => p.id === id);

    if (project) {
      this.#applyProjectUpdate(id, { pinned: !project.pinned });
    }
  }

  toggleProjectCompleted(id: number) {
    const project = this.#projects.find(p => p.id === id);

    if (project) {
      this.#applyProjectUpdate(id, { completed: !project.completed });
    }
  }

  updateScratchpad(id: number, text: string) {
    this.#applyProjectUpdate(id, { scratchPad: text.trim() });
  }

  updateExpectedHours(id: number, hours: number) {
    if (hours >= 0) {
      this.#applyProjectUpdate(id, { expectedCompletionHours: hours });
    }
  }

  async delete(id: number) {
    const idx = this.#projects.findIndex(p => p.id === id);

    if (idx === -1) {
      return;
    }

    await ProjectService.removeProject(id);

    delete this.#notes[id];
    this.#projects.splice(idx, 1);

    if (this.selectedId === id) {
      this.selectedId = this.projects[0]?.id;
    }
  }

  async editNote(
    id: number,
    updates: NoteUpdates
  ): Promise<void> {
    const updated = await NoteService.updateNote(id, updates);

    for (const projectId in this.#notes) {
      const idx = this.#notes[projectId].findIndex(n => n.id === id);

      if (idx !== -1) {
        const updatedNotes = [...this.#notes[projectId]];

        updatedNotes[idx] = updated;
        this.#notes[projectId] = updatedNotes;
        break;
      }
    }
  }

  async deleteNote(noteId: number): Promise<void> {
    await NoteService.removeNote(noteId);

    for (const projectId in this.#notes) {
      const idx = this.#notes[projectId].findIndex(n => n.id === noteId);

      if (idx !== -1) {
        this.#notes[projectId].splice(idx, 1);
        break;
      }
    }
  }
}

export default new ProjectStore();
