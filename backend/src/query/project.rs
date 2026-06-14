use crate::{
  application::ApplicationState,
  cmd::{AsBridgeResponse, BridgeResponse},
  entity::{Project, RecentProject},
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

#[tauri::command]
pub async fn query_recent_projects(
  state: State<'_, ApplicationState>,
  limit: i64,
) -> BridgeResponse<Vec<RecentProject>> {
  let app = state.lock().await;

  let result = sqlx::query_as::<_, RecentProject>(
        r#"
        SELECT
            p.*,
            COALESCE(SUM((unixepoch(n.time_taken_to) - unixepoch(n.time_taken_from)) / 60), 0) AS logged_minutes,
            MAX(n.created_at) AS last_entry_at
        FROM projects p
        LEFT JOIN project_notes n ON p.id = n.project_id
        GROUP BY p.id
        ORDER BY p.modified_at DESC
        LIMIT $1
        "#,
    )
    .bind(limit)
    .fetch_all(app.pool())
    .await;

  result.as_bridge_response()
}
