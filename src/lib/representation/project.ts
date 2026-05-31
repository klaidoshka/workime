export interface Project {
  id: number;
  label: string;
  createdAt: Date;
  modifiedAt?: Date;
  finished: boolean;
  pinned: boolean;
  scratchPad?: string;
  expectedFinishHours?: number;
};
