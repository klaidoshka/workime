use crate::{
    application::ApplicationState,
    entity::{Note, Project},
};
use tauri::State;

#[tauri::command]
pub async fn create_project(
    state: State<'_, ApplicationState>,
    label: String,
) -> Result<Project, String> {
    let app = state.lock().await;

    let project =
        sqlx::query_as::<_, Project>("INSERT INTO projects (label, created_at) VALUES ($1, $2) RETURNING *")
            .bind(label)
            .bind(chrono::Utc::now())
            .fetch_one(app.pool())
            .await
            .map_err(|e| e.to_string())?;

    Ok(project)
}

#[tauri::command]
pub async fn create_project_note(
    state: State<'_, ApplicationState>,
    project_id: i32,
    content: String,
    tags: Vec<String>,
    time_taken_from: Option<String>,
    time_taken_to: Option<String>,
) -> Result<Note, String> {
    let app = state.lock().await;

    let note = sqlx::query_as::<_, Note>(
        "INSERT INTO project_notes (project_id, created_at, content, tags, time_taken_from, time_taken_to)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *"
    )
        .bind(project_id)
        .bind(chrono::Utc::now())
        .bind(content)
        .bind(serde_json::to_string(&tags).unwrap_or_else(|_| "[]".into()))
        .bind(time_taken_from)
        .bind(time_taken_to)
        .fetch_one(app.pool())
        .await
        .map_err(|e| e.to_string())?;

    Ok(note)
}
