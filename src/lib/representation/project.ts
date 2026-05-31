export interface Project {
    id: string;
    label: string;
    createdAt: Date;
    modifiedAt: Date;
    finished: boolean;
    pinned: boolean;
    scratchPad?: string;
    expectedFinishHours?: number;
};