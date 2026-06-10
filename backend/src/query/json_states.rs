use crate::{
  application::ApplicationState,
  bridge::{AsBridgeResponse, BridgeResponse},
  entity::JsonState,
};
use tauri::State;

#[tauri::command]
pub async fn query_json_state(
  state: State<'_, ApplicationState>,
  id: String,
) -> BridgeResponse<String> {
  let app = state.lock().await;

  sqlx::query_as::<_, JsonState>("SELECT * FROM json_states WHERE id = $1")
    .bind(id)
    .fetch_one(app.pool())
    .await
    .map(|json_state| json_state.state)
    .as_bridge_response()
}
