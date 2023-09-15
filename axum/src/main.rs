// Built-in Lints
// Clippy lints
#![allow(clippy::map_unwrap_or)]
#![warn(
    clippy::if_not_else,
    clippy::items_after_statements,
    clippy::mut_mut,
    clippy::non_ascii_literal,
    clippy::similar_names,
    clippy::unicode_not_nfc,
    clippy::used_underscore_binding,
    missing_copy_implementations
)]
#![cfg_attr(test, allow(clippy::unwrap_used))]
use std::net::SocketAddr;

use axum::{
    extract::State,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use didkit::{
    ssi::vc::VCDateTime, LinkedDataProofOptions, Source, VerifiableCredential, DID_METHODS, JWK,
    URI,
};
use hyper::StatusCode;
use serde::Deserialize;
use serde_json::json;

#[derive(Deserialize)]
pub struct CredentialRequest {
    pub name: String,
    pub age: u8,
}

#[tokio::main(flavor = "multi_thread", worker_threads = 8)]
async fn main() {
    let jwk = JWK::generate_secp256k1().unwrap();

    // build our application with a route
    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .route("/issue", get(issue_credential))
        .route("/verify", post(verify_credential))
        .with_state(jwk);

    // Run with hyper
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    tracing::debug!("Listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

// Function that creates and issues a verifiable credential
async fn issue_credential(State(jwk): State<JWK>) -> impl IntoResponse {
    let issuance_date = VCDateTime::from(chrono::Utc::now());
    let source = Source::KeyAndPattern(&jwk, "key");
    let did = DID_METHODS.generate(&source).unwrap();

    let credential_data = json!({
        "type": ["VerifiableCredential", "ProgramCompletionCertificate"],
        "credentialSubject": {
          "accomplishmentType": "Developer Certificate",
          "learnerName": "John Doe",
          "achievement": "Certified Solidity Developer 2",
          "courseProvider": "https://blockchain-lab.um.si/",
          "id": did
        },
        "issuer": {
            "id": did,
        },
        "issuanceDate": issuance_date,
        "credentialSchema": {
          "id": "https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json",
          "type": "JsonSchemaValidator2018"
        },
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/ld-context.json"
        ]
    })
    .to_string();

    let credential = VerifiableCredential::from_json_unsigned(&credential_data).unwrap();
    let resolver = DID_METHODS.to_resolver();
    let mut proof_options = LinkedDataProofOptions::default();

    proof_options.verification_method = Some(URI::String(format!(
        "{}#{}",
        did,
        did.split(":").last().unwrap()
    )));

    proof_options.checks = None;
    proof_options.created = None;

    match credential
        .generate_jwt(Some(&jwk), &proof_options, resolver)
        .await
    {
        Ok(jwt) => (StatusCode::OK, jwt),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()),
    }
}

// Function that verifies a verifiable credential
async fn verify_credential(Json(payload): Json<VerifiableCredential>) {}
