use crate::{application::ApplicationState, entity::{Note, Project}};
use tauri::State;

#[tauri::command]
pub async fn query_projects(state: State<'_, ApplicationState>) -> Result<Vec<Project>, String> {
    let app = state.lock().await;

    let projects = sqlx::query_as::<_, Project>("SELECT * FROM projects")
        .fetch_all(app.pool())
        .await
        .map_err(|e| e.to_string())?;

    Ok(projects)
}

#[tauri::command]
pub async fn query_project_notes(project_id: i32, state: State<'_, ApplicationState>) -> Result<Vec<Note>, String> {
    let app = state.lock().await;

    let notes = sqlx::query_as::<_, Note>("SELECT * FROM project_notes WHERE project_id = $1")
        .bind(project_id)
        .fetch_all(app.pool())
        .await
        .map_err(|e| e.to_string())?;

    Ok(notes)
}
