import TimeUtils from "$lib/utils/time";
import type { Note } from "../representation/note";
import type { Project } from "../representation/project";

class ProjectStore {
    #rawList = $state<Project[]>([
        { id: "p1", label: "Project Alpha", pinned: true, createdAt: new Date("2026-05-15T10:00:00"), modifiedAt: new Date("2026-05-15T10:00:00"), finished: false },
        { id: "p2", label: "Website Redesign", pinned: false, createdAt: new Date("2026-05-26T14:30:00"), modifiedAt: new Date("2026-05-26T14:30:00"), finished: false },
        { id: "p3", label: "Mobile App v2", pinned: false, createdAt: new Date("2026-05-24T09:15:00"), modifiedAt: new Date("2026-05-24T09:15:00"), finished: false },
    ]);

    selectedId = $state<string>("p1");

    #notes = $state<Record<string, Note[]>>({
        "p1": [
            { id: "n1", timestamp: new Date("2026-05-15T10:15:00"), timeTakenFrom: 540, tags: [], timeTakenTo: 615, content: "# Sync Notes\nDiscussed milestone adjustments with the backend team." },
            { id: "n2", timestamp: new Date("2026-05-15T11:00:00"), timeTakenFrom: 615, tags: [], timeTakenTo: 660, content: "Finalized the core UI mockups." }
        ],
        "p2": [],
        "p3": []
    });

    get projects() {
        return [...this.#rawList].sort((a, b) => {
            if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
            return b.modifiedAt.getTime() - a.modifiedAt.getTime();
        });
    }

    get currentProject() {
        return this.#rawList.find(p => p.id === this.selectedId);
    }

    get currentNotes() {
        return this.#notes[this.selectedId] || [];
    }

    add(label: string): string {
        const id = crypto.randomUUID();

        this.#rawList.push({ id, label, pinned: false, createdAt: new Date(), modifiedAt: new Date(), finished: false });
        this.#notes[id] = [];
        this.selectedId = id;

        return id;
    }

    togglePin(id: string) {
        const project = this.#rawList.find(p => p.id === id);

        if (project) {
            project.pinned = !project.pinned;
        }
    }

    addNote(projectId: string, content: string, timeFromStr: string, timeToStr: string) {
        if (!projectId || !content.trim()) {
            return;
        }

        const targetProject = this.#rawList.find(p => p.id === projectId);

        if (targetProject) {
            targetProject.modifiedAt = new Date();
        }

        const newNote: Note = {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            content,
            tags: this.parseTagsFromText(content),
            timeTakenFrom: TimeUtils.stringToMinutes(timeFromStr),
            timeTakenTo: TimeUtils.stringToMinutes(timeToStr)
        };

        this.#notes[projectId].push(newNote);
    }

    toggleProjectFinished(id: string) {
        const project = this.projects.find(p => p.id === id);

        if (project) {
            project.finished = !project.finished;
            project.modifiedAt = new Date();
        }
    }

    updateScratchpad(id: string, text: string) {
        const project = this.projects.find(p => p.id === id);

        if (project) {
            project.scratchPad = text;
        }
    }

    updateExpectedHours(id: string, hours: number) {
        const project = this.projects.find(p => p.id === id);

        if (project) {
            project.expectedFinishHours = hours;
            project.modifiedAt = new Date();
        }
    }

    parseTagsFromText(text: string): string[] {
        if (!text) {
            return [];
        }

        const matches = text.match(/#[\w-]+/g);

        if (!matches) {
            return [];
        }

        const extracted = matches
            .map(tag => tag.slice(1).toLowerCase().trim())
            .filter(tag => tag.length > 0 && tag.length < 50);

        return [...new Set(extracted)];
    }
}

const instance = new ProjectStore();

export default instance;