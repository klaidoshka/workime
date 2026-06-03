use sqlx::{
  migrate,
  sqlite::{SqliteConnectOptions, SqlitePoolOptions},
  SqlitePool,
};
use tokio::sync::Mutex;

pub type ApplicationState = Mutex<Application>;

pub struct Application {
  pool: SqlitePool,
}

impl Application {
  pub fn pool(&self) -> &SqlitePool {
    &self.pool
  }

  pub async fn new() -> Result<Application, sqlx::Error> {
    let options = SqliteConnectOptions::new()
      .filename("workime.db")
      .create_if_missing(true);

    let pool = SqlitePoolOptions::new()
      .max_connections(5)
      .connect_with(options)
      .await?;

    let application = Application { pool };

    application.migrate().await;

    Ok(application)
  }

  async fn migrate(&self) {
    migrate!("./src/migrations")
      .run(&self.pool)
      .await
      .expect("Failed to run migrations");
  }
}
