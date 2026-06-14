use serde::{Deserialize, Serialize};
use sqlx::types::{
  chrono::{DateTime, Utc},
  Json,
};

#[derive(Debug, sqlx::FromRow, Deserialize, Serialize)]
pub struct Note {
  pub id: i64,
  pub created_at: DateTime<Utc>,
  pub modified_at: Option<DateTime<Utc>>,
  pub content: String,
  pub tags: Json<Vec<String>>,
  pub time_taken_from: Option<DateTime<Utc>>,
  pub time_taken_to: Option<DateTime<Utc>>,
  pub project_id: i64,
}

#[derive(Debug, sqlx::FromRow, Deserialize, Serialize)]
pub struct Project {
  pub id: i64,
  pub label: String,
  pub created_at: DateTime<Utc>,
  pub modified_at: Option<DateTime<Utc>>,
  pub completed: bool,
  pub pinned: bool,
  pub icon: String,
  pub color: String,
  pub scratch_pad: Option<String>,
  pub expected_completion_hours: Option<i32>,
}

#[derive(Debug, sqlx::FromRow, Deserialize, Serialize)]
pub struct RecentProject {
  #[sqlx(flatten)]
  #[serde(flatten)]
  pub project: Project,
  pub logged_minutes: i64,
  pub last_entry_at: Option<DateTime<Utc>>,
}
