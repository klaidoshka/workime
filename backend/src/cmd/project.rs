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
  icon: String,
  color: String,
) -> BridgeResponse<Project> {
  let app = state.lock().await;

  sqlx::query_as::<_, Project>(
    "INSERT INTO projects (label, icon, color, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
  )
  .bind(label)
  .bind(icon)
  .bind(color)
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

#[tauri::command]
pub async fn edit_project(
  state: State<'_, ApplicationState>,
  id: i32,
  icon: Option<String>,
  color: Option<String>,
  pinned: Option<bool>,
  completed: Option<bool>,
  scratch_pad: Option<String>,
  expected_completion_hours: Option<i32>,
) -> BridgeResponse<Project> {
  let app = state.lock().await;

  sqlx::query_as::<_, Project>(
    r#"
        UPDATE projects
        SET
            modified_at = $1,
            icon = COALESCE($2, icon),
            color = COALESCE($3, color),
            pinned = COALESCE($4, pinned),
            completed = COALESCE($5, completed),
            scratch_pad = COALESCE($6, scratch_pad),
            expected_completion_hours = COALESCE($7, expected_completion_hours)
        WHERE id = $8
        RETURNING *
        "#,
  )
  .bind(Utc::now())
  .bind(icon)
  .bind(color)
  .bind(pinned)
  .bind(completed)
  .bind(scratch_pad)
  .bind(expected_completion_hours)
  .bind(id)
  .fetch_one(app.pool())
  .await
  .as_bridge_response()
}
