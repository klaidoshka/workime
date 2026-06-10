export interface SettingsJsonState {
  workStart: Date;
  workEnd: Date;
  lunchStart: Date;
  lunchEnd: Date;
  minWorkHours: number;
  allowUnmetQuota: boolean;
  allowOverlappingNotes: boolean;
};

export const defaultSettingsJsonState: SettingsJsonState = {
  workStart: new Date(0, 0, 0, 8, 0), // 8:00 AM
  workEnd: new Date(0, 0, 0, 17, 0), // 5:00 PM
  lunchStart: new Date(0, 0, 0, 12, 0), // 12:00 PM
  lunchEnd: new Date(0, 0, 0, 13, 0), // 1:00 PM
  minWorkHours: 8,
  allowUnmetQuota: false,
  allowOverlappingNotes: false,
};
