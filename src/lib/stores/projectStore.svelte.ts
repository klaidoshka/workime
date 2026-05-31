import TimeUtils from "$lib/utils/time";
import { invoke } from "@tauri-apps/api/core";
import type { Note, NoteAttachment } from "../representation/note";
import type { Project } from "../representation/project";
import ParseUtils from "$lib/utils/parse";
import TextUtils from "$lib/utils/text";

class ProjectStore {
    selectedId = $state<number | undefined>(undefined);
    #projects = $state<Project[]>([]);
    #notes = $state<Record<string, Note[]>>({});

    constructor() {
        this.init();
    }

    async init() {
        try {
            const projects = await invoke<any[]>("query_projects");

            this.#projects = projects.map(p => ParseUtils.parseProject(p));

            if (this.projects.length <= 0) {
                return;
            }

            this.selectedId = this.projects[0].id;

            for (const project of this.projects) {
                const notes = await invoke<any[]>("query_project_notes", { projectId: project.id });

                this.#notes[project.id] = notes.map(n => ParseUtils.parseNote(n));
            }
        } catch (error) {
            console.error("Failed to initialize database state inside store:", error);
        }
    }

    get projects() {
        return [...this.#projects].sort((a, b) => {
            if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;

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
        try {
            const newProject = await invoke<any>("create_project", { label });

            this.#projects.push(ParseUtils.parseProject(newProject));

            this.#notes[newProject.id] = [];
            this.selectedId = newProject.id;

            return newProject.id;
        } catch (error) {
            console.error("Failed to create project in database:", error);
            throw error;
        }
    }

    togglePin(id: number) {
        const project = this.#projects.find(p => p.id === id);

        if (project) {
            project.pinned = !project.pinned;
        }
    }

    async addNote(
        projectId: number,
        content: string,
        timeFrom: Date | undefined,
        timeTo: Date | undefined,
        attachments: NoteAttachment[] = [],
    ) {
        if (!projectId || (!content.trim() && attachments.length === 0)) {
            return;
        }

        if (!timeFrom || !timeTo) {
            timeFrom = undefined;
            timeTo = undefined;
        }

        try {
            const tags = TextUtils.parseTagsFromText(content);

            const noteStruct = await invoke<any>("create_project_note", {
                projectId,
                content: content.trim(),
                tags,
                timeTakenFrom: timeFrom ? timeFrom.toISOString() : undefined,
                timeTakenTo: timeTo ? timeTo.toISOString() : undefined,
                attachments: attachments.length ? attachments : undefined,
            });

            const note = ParseUtils.parseNote(noteStruct);
            const targetProject = this.projects.find(p => p.id === projectId);

            if (targetProject) {
                targetProject.modifiedAt = new Date(note.createdAt);
            }

            if (!this.#notes[projectId]) {
                this.#notes[projectId] = [];
            }

            this.#notes[projectId].push(note);

        } catch (error) {
            console.error("Failed to add note to database:", error);
        }
    }

    toggleProjectFinished(id: number) {
        const project = this.projects.find(p => p.id === id);

        if (project) {
            project.finished = !project.finished;
            project.modifiedAt = new Date();
        }
    }

    updateScratchpad(id: number, text: string) {
        const project = this.projects.find(p => p.id === id);

        if (project) {
            project.scratchPad = text;
        }
    }

    updateExpectedHours(id: number, hours: number) {
        const project = this.projects.find(p => p.id === id);

        if (project) {
            project.expectedFinishHours = hours;
            project.modifiedAt = new Date();
        }
    }
}

const instance = new ProjectStore();

export default instance;