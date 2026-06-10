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

  create_project_note_tx(
    app.pool(),
    project_id,
    content,
    tags,
    time_taken_from,
    time_taken_to,
  )
  .await
  .as_bridge_response()
}

async fn create_project_note_tx(
  pool: &sqlx::SqlitePool,
  project_id: i32,
  content: String,
  tags: Vec<String>,
  time_taken_from: Option<String>,
  time_taken_to: Option<String>,
) -> Result<Note, sqlx::Error> {
  let mut tx = pool.begin().await?;

  let note = sqlx::query_as::<_, Note>(
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
    .fetch_one(&mut *tx)
    .await?;

  update_modified_at(&mut tx, project_id).await?;
  tx.commit().await?;

  Ok(note)
}

#[tauri::command]
pub async fn delete_project_note(
  state: State<'_, ApplicationState>,
  note_id: i32,
) -> BridgeResponse<()> {
  let app = state.lock().await;
  delete_project_note_tx(app.pool(), note_id)
    .await
    .as_bridge_response()
}

async fn delete_project_note_tx(pool: &sqlx::SqlitePool, note_id: i32) -> Result<(), sqlx::Error> {
  let mut tx = pool.begin().await?;

  let project_id = get_note_project_id(&mut *tx, note_id).await?;

  sqlx::query("DELETE FROM project_notes WHERE id = $1")
    .bind(note_id)
    .execute(&mut *tx)
    .await
    .map(|_| ())?;

  update_modified_at(&mut tx, project_id).await?;
  tx.commit().await?;

  Ok(())
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
  edit_project_note_tx(
    app.pool(),
    note_id,
    content,
    tags,
    time_taken_from,
    time_taken_to,
  )
  .await
  .as_bridge_response()
}

async fn edit_project_note_tx(
  pool: &sqlx::SqlitePool,
  note_id: i32,
  content: Option<String>,
  tags: Option<Vec<String>>,
  time_taken_from: Option<String>,
  time_taken_to: Option<String>,
) -> Result<Note, sqlx::Error> {
  let mut tx = pool.begin().await?;

  let project_id = get_note_project_id(&mut *tx, note_id).await?;

  let note = sqlx::query_as::<_, Note>(
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
  .fetch_one(&mut *tx)
  .await?;

  update_modified_at(&mut tx, project_id).await?;
  tx.commit().await?;

  Ok(note)
}

async fn get_note_project_id(
  tx: &mut sqlx::SqliteConnection,
  note_id: i32,
) -> Result<i32, sqlx::Error> {
  sqlx::query_scalar::<_, i32>("SELECT project_id FROM project_notes WHERE id = $1")
    .bind(note_id)
    .fetch_one(tx)
    .await
}
