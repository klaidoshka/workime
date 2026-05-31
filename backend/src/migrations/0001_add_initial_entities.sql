PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    label TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    modified_at DATETIME,
    finished BOOLEAN NOT NULL DEFAULT 0,
    pinned BOOLEAN NOT NULL DEFAULT 0,
    scratch_pad TEXT,
    expected_finish_hours INTEGER
);

CREATE TABLE IF NOT EXISTS project_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    created_at DATETIME NOT NULL,
    modified_at DATETIME,
    content TEXT NOT NULL,
    tags TEXT NOT NULL DEFAULT '[]',
    time_taken_from DATETIME,
    time_taken_to DATETIME,
    project_id INTEGER NOT NULL,
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notes_project_id ON project_notes(project_id);