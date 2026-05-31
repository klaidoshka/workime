export interface Note {
    id: string;
    timestamp: Date;
    content: string;
    tags: string[];
    timeTakenFrom?: number;
    timeTakenTo?: number;
};