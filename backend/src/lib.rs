use crate::application::{Application, ApplicationState};
use tauri::{async_runtime, Manager};
use tokio::sync::Mutex;

mod application;
mod cmd;
mod entity;
mod query;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      let handle = app.handle().clone();

      async_runtime::block_on(async move {
        let instance = Application::new().await.unwrap();

        handle.manage::<ApplicationState>(Mutex::new(instance));
      });

      Ok(())
    })
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![
      cmd::project::create_project,
      cmd::project::edit_project,
      cmd::project::delete_project,
      cmd::note::create_project_note,
      cmd::note::edit_project_note,
      cmd::note::delete_project_note,
      query::project::query_projects,
      query::note::query_project_notes,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
