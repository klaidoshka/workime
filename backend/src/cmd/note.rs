use crate::{
  application::ApplicationState,
  cmd::{project::update_modified_at, AsBridgeResponse, BridgeResponse},
  entity::Note,
};
use chrono::Utc;
use tauri::State;

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

  let result = sqlx::query_as::<_, Note>(
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
        .as_bridge_response();

  if result.is_ok() {
    let _ = update_modified_at(app.pool(), project_id).await;
  }

  result
}

#[tauri::command]
pub async fn delete_project_note(
  state: State<'_, ApplicationState>,
  note_id: i32,
) -> BridgeResponse<()> {
  let app = state.lock().await;

  let project_id = get_note_project_id(app.pool(), note_id)
    .await
    .as_bridge_response()?
    .value
    .unwrap();

  let result = sqlx::query("DELETE FROM project_notes WHERE id = $1")
    .bind(note_id)
    .execute(app.pool())
    .await
    .map(|_| ())
    .as_bridge_response();

  if result.is_ok() {
    let _ = update_modified_at(app.pool(), project_id).await;
  }

  result
}

#[tauri::command]
pub async fn edit_project_note(
  state: State<'_, ApplicationState>,
  note_id: i32,
  content: Option<String>,
  tags: Option<Vec<String>>,
  time_taken_from: Option<String>,
  time_taken_to: Option<String>,
) -> BridgeResponse<Note> {
  let app = state.lock().await;

  let project_id = get_note_project_id(app.pool(), note_id)
    .await
    .as_bridge_response()?
    .value
    .unwrap();

  let result = sqlx::query_as::<_, Note>(
    r#"
        UPDATE project_notes
        SET
            modified_at = $1,
            content = COALESCE($2, content),
            tags = COALESCE($3, tags),
            time_taken_from = COALESCE($4, time_taken_from),
            time_taken_to = COALESCE($5, time_taken_to)
        WHERE id = $6
        RETURNING *
        "#,
  )
  .bind(Utc::now())
  .bind(content)
  .bind(tags.map(|t| serde_json::to_string(&t).unwrap_or_else(|_| "[]".into())))
  .bind(time_taken_from)
  .bind(time_taken_to)
  .bind(note_id)
  .fetch_one(app.pool())
  .await
  .as_bridge_response();

  if result.is_ok() {
    let _ = update_modified_at(app.pool(), project_id).await;
  }

  result
}

async fn get_note_project_id(pool: &sqlx::SqlitePool, note_id: i32) -> Result<i32, sqlx::Error> {
  sqlx::query_scalar::<_, i32>("SELECT project_id FROM project_notes WHERE id = $1")
    .bind(note_id)
    .fetch_one(pool)
    .await
}
