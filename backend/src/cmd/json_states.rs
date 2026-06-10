use crate::{
  application::ApplicationState,
  bridge::{AsBridgeResponse, BridgeResponse},
};
use tauri::State;

#[tauri::command]
pub async fn create_missing_json_state(
  state: State<'_, ApplicationState>,
  id: String,
  value: String,
) -> BridgeResponse<bool> {
  let app = state.lock().await;

  sqlx::query(
    "
    INSERT INTO json_states (id, state) VALUES ($1, $2)
    ON CONFLICT (id) DO NOTHING
    ",
  )
  .bind(id)
  .bind(value)
  .execute(app.pool())
  .await
  .map(|x| x.rows_affected() > 0)
  .as_bridge_response()
}

#[tauri::command]
pub async fn edit_json_state(
  state: State<'_, ApplicationState>,
  id: String,
  value: String,
) -> BridgeResponse<bool> {
  let app = state.lock().await;

  sqlx::query(
    "
    INSERT INTO json_states (id, state)
    VALUES ($1, $2)
      ON CONFLICT(id) DO UPDATE SET
        state = excluded.state
    ",
  )
  .bind(id)
  .bind(value)
  .execute(app.pool())
  .await
  .map(|x| x.rows_affected() > 0)
  .as_bridge_response()
}
