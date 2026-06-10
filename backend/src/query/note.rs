use crate::{
  application::ApplicationState,
  bridge::{AsBridgeResponse, BridgeResponse},
  entity::{Note},
};
use tauri::State;

#[tauri::command]
pub async fn query_project_notes(
  project_id: i32,
  state: State<'_, ApplicationState>,
) -> BridgeResponse<Vec<Note>> {
  let app = state.lock().await;

  sqlx::query_as::<_, Note>("SELECT * FROM project_notes WHERE project_id = $1")
    .bind(project_id)
    .fetch_all(app.pool())
    .await
    .as_bridge_response()
}
