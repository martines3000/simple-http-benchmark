# Benchmark

Simple benchmark where I quickly tested perfomance between Hono (bun), Fastify (node) and Axum (rust).

I tested a simple `Hello World!` example and an example where I issue a verifiable credential. Credential data was hardcoded and issuance was made using the `did:key` method.

Benchmarking tool used [Bombardier](https://github.com/codesenberg/bombardier).

Command: `bombardier --fasthttp -c 500 -d 60s http://localhost:3000/issue`

## Results

> Numbers are rounded

### CPU: AMD Ryzen 7 5800U

#### Hello world

| Name    | Requests per second |
| ------- | ------------------- |
| Fastify | 30k                 |
| Hono    | 180k                |
| Axum    | 384k                |

#### Issue

| Name             | Requests per second |
| ---------------- | ------------------- |
| Fastify          | 1.6k                |
| Hono             | 2k                  |
| Axum (8 threads) | 32k                 |
| Axum (1 thread)  | 6k                  |
| Axum (2 thread)  | 11.5k               |
