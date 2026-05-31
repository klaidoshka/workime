export interface NoteAttachment {
  name: string;
  size: number;
}

export interface Note {
  id: number;
  createdAt: Date;
  modifiedAt?: Date;
  content: string;
  tags: string[];
  timeTakenFrom?: Date;
  timeTakenTo?: Date;
  attachments?: NoteAttachment[];
}
