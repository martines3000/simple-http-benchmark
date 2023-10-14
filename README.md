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
| Axum (1 thread)  | 6k                  |
| Axum (2 thread)  | 11.5k               |
| Axum (8 threads) | 32k                 |

### CPU: AMD Ryzen 9 7900x

#### Hello world

| Name              | Requests per second |
| ----------------- | ------------------- |
| Fastify           | 86k                 |
| Hono              | 167k                |
| Axum (1 thread)   | 154k                |
| Axum (2 thread)   | 257k                |
| Axum (8 threads)  | 746k                |
| Axum (12 threads) | 917k                |

#### Issue

| Name              | Requests per second |
| ----------------- | ------------------- |
| Fastify           | 3.2k                |
| Hono              | 3.1k                |
| Axum (1 thread)   | 8.2k                |
| Axum (2 thread)   | 16k                 |
| Axum (8 threads)  | 62k                 |
| Axum (12 threads) | 100k                |

### CPU: AMD Ryzen 9 7900x (inside kubernetes pod)

| Name              | Requests per second |
| ----------------- | ------------------- |
| Fastify           | k                   |
| Hono              | k                   |
| Axum (1 thread)   | k                   |
| Axum (12 threads) | k                   |

#### Issue

| Name              | Requests per second |
| ----------------- | ------------------- |
| Fastify           | k                   |
| Hono              | k                   |
| Axum (1 thread)   | k                   |
| Axum (12 threads) | k                   |

### CPU: AMD Ryzen 9 7900x (running 12 pods)

| Name            | Requests per second |
| --------------- | ------------------- |
| Fastify         | k                   |
| Hono            | k                   |
| Axum (2 thread) | k                   |

#### Issue

| Name            | Requests per second |
| --------------- | ------------------- |
| Fastify         | k                   |
| Hono            | k                   |
| Axum (1 thread) | k                   |
| Axum (2 thread) | k                   |
