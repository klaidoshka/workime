export interface Project {
  id: number;
  label: string;
  createdAt: Date;
  modifiedAt?: Date;
  completed: boolean;
  pinned: boolean;
  scratchPad?: string;
  expectedCompletionHours?: number;
};
