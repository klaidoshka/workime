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
    pub finished: bool,
    pub pinned: bool,
    pub scratch_pad: Option<String>,
    pub expected_finish_hours: Option<i32>,
}
