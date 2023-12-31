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

#### Hello world

| Name              | Requests per second |
| ----------------- | ------------------- |
| Fastify           | 53k                 |
| Hono              | 109k                |
| Axum (1 thread)   | 102k                |
| Axum (12 threads) | 78k                 |

#### Issue

| Name              | Requests per second |
| ----------------- | ------------------- |
| Fastify           | 2.4k                |
| Hono              | 2.9k                |
| Axum (1 thread)   | 6.7k                |
| Axum (12 threads) | 11k                 |

### CPU: AMD Ryzen 9 7900x (running 12 pods)

#### Hello world

| Name            | Requests per second |
| --------------- | ------------------- |
| Fastify         | 310k                |
| Hono            | 630k                |
| Axum (1 thread) | 780k                |
| Axum (2 thread) | 752k                |

#### Issue

| Name            | Requests per second |
| --------------- | ------------------- |
| Fastify         | 20k                 |
| Hono            | 20k                 |
| Axum (1 thread) | 67k                 |
| Axum (2 thread) | 82k                 |

### CPU: AMD Ryzen 9 7900x (comparison)

#### Hello world

| Name            | Native | Pod  | 12 Pods |
| --------------- | ------ | ---- | ------- |
| Fastify         | 86k    | 53k  | 310k    |
| Hono            | 167k   | 109k | 630k    |
| Axum (1 thread) | 154k   | 102k | 780k    |
| Axum (2 thread) | 257k   | 112k | 752k    |
