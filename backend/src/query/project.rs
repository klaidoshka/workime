use crate::{
  application::ApplicationState,
  bridge::{AsBridgeResponse, BridgeResponse},
  entity::{Project},
};
use tauri::State;

#[tauri::command]
pub async fn query_projects(state: State<'_, ApplicationState>) -> BridgeResponse<Vec<Project>> {
  let app = state.lock().await;

  sqlx::query_as::<_, Project>("SELECT * FROM projects")
    .fetch_all(app.pool())
    .await
    .as_bridge_response()
}

