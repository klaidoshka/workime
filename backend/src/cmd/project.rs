use crate::{
    application::ApplicationState,
    cmd::{AsBridgeResponse, BridgeResponse},
    entity::{Note, Project},
};
use chrono::Utc;
use tauri::State;

#[tauri::command]
pub async fn create_project(
    state: State<'_, ApplicationState>,
    label: String,
) -> BridgeResponse<Project> {
    let app = state.lock().await;

    sqlx::query_as::<_, Project>(
        "INSERT INTO projects (label, created_at) VALUES ($1, $2) RETURNING *",
    )
    .bind(label)
    .bind(Utc::now())
    .fetch_one(app.pool())
    .await
    .as_bridge_response()
}

#[tauri::command]
pub async fn create_project_note(
    state: State<'_, ApplicationState>,
    project_id: i32,
    content: String,
    tags: Vec<String>,
    time_taken_from: Option<String>,
    time_taken_to: Option<String>,
) -> BridgeResponse<Note> {
    let app = state.lock().await;

    sqlx::query_as::<_, Note>(
        "INSERT INTO project_notes (project_id, created_at, content, tags, time_taken_from, time_taken_to)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *"
    )
        .bind(project_id)
        .bind(Utc::now())
        .bind(content)
        .bind(serde_json::to_string(&tags).unwrap_or_else(|_| "[]".into()))
        .bind(time_taken_from)
        .bind(time_taken_to)
        .fetch_one(app.pool())
        .await
        .as_bridge_response()
}
