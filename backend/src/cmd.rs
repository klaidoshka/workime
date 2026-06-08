pub mod project;
pub mod note;

use serde::Serialize;
use std::fmt::Display;

#[derive(Serialize)]
pub struct ErrorResponse {
  pub message: String,
}

#[derive(Serialize)]
pub struct SuccessResponse<T> {
  pub value: Option<T>,
}

pub type BridgeResponse<T> = Result<SuccessResponse<T>, ErrorResponse>;

pub trait AsBridgeResponse<T> {
  fn as_bridge_response(self) -> BridgeResponse<T>;
}

impl<T, E: Display> AsBridgeResponse<T> for Result<T, E> {
  fn as_bridge_response(self) -> BridgeResponse<T> {
    match self {
      Ok(value) => Ok(SuccessResponse { value: Some(value) }),
      Err(error) => Err(ErrorResponse {
        message: error.to_string(),
      }),
    }
  }
}
