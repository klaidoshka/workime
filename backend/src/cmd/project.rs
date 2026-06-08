use crate::{
  application::ApplicationState,
  cmd::{AsBridgeResponse, BridgeResponse},
  entity::Project,
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
pub async fn edit_project(
  state: State<'_, ApplicationState>,
  id: i32,
  label: Option<String>,
  icon: Option<String>,
  color: Option<String>,
  pinned: Option<bool>,
  completed: Option<bool>,
  scratch_pad: Option<String>,
  expected_completion_hours: Option<i32>,
) -> BridgeResponse<Project> {
  let app = state.lock().await;

  println!("Edited project with id: {}", id);

  sqlx::query_as::<_, Project>(
    r#"
        UPDATE projects
        SET
            modified_at = $1,
            label = COALESCE($2, label),
            icon = COALESCE($3, icon),
            color = COALESCE($4, color),
            pinned = COALESCE($5, pinned),
            completed = COALESCE($6, completed),
            scratch_pad = COALESCE($7, scratch_pad),
            expected_completion_hours = COALESCE($8, expected_completion_hours)
        WHERE id = $9
        RETURNING *
        "#,
  )
  .bind(Utc::now())
  .bind(label)
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

#[tauri::command]
pub async fn delete_project(state: State<'_, ApplicationState>, id: i32) -> BridgeResponse<bool> {
  let app = state.lock().await;

  sqlx::query("DELETE FROM projects WHERE id = $1")
    .bind(id)
    .execute(app.pool())
    .await
    .map(|result| result.rows_affected() > 0)
    .as_bridge_response()
}

pub async fn update_modified_at(pool: &sqlx::SqlitePool, project_id: i32) -> Result<(), sqlx::Error> {
  sqlx::query("UPDATE projects SET modified_at = $1 WHERE id = $2")
    .bind(Utc::now())
    .bind(project_id)
    .execute(pool)
    .await
    .map(|_| ())
}
