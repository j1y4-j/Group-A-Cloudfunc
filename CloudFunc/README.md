# CloudFunc

CloudFunc is a lightweight **serverless function execution platform** built using **Node.js, Docker, RabbitMQ, and PostgreSQL**.  
It allows users to **register functions as Docker images and invoke them asynchronously**, similar to a simplified version of AWS Lambda.

---

## Architecture

CloudFunc follows an **event-driven microservices architecture**.

```
User
↓
Gateway
↓
Function Registry (PostgreSQL)
↓
RabbitMQ Queue
↓
Worker
↓
Container Manager
↓
Docker Containers
```

Each component is **decoupled**, allowing scalable and fault-tolerant execution.

---

## Features

- Serverless function registration via API
- Docker-based function execution
- Asynchronous job processing with RabbitMQ
- Warm container reuse to reduce cold start latency
- Job status tracking using PostgreSQL
- Worker retry mechanism for failed jobs
- Recovery of queued jobs after worker restart
- Automatic cleanup of temporary build files

---

## Tech Stack

| Technology | Purpose               |
| ---------- | --------------------- |
| Node.js    | Backend services      |
| Express.js | REST APIs             |
| Docker     | Function execution    |
| RabbitMQ   | Message queue         |
| PostgreSQL | Metadata storage      |
| Axios      | Service communication |

---

## Services

### Gateway

Handles all client interactions.

Responsibilities:

- Register functions
- Build Docker images
- Invoke functions
- Publish jobs to RabbitMQ
- Fetch job status

Endpoints:

```
POST /register
POST /invoke
GET /jobs/:jobId
```
---

### Function Registry

Stores metadata about:

- Registered functions
- Submitted jobs
- Execution status
- Results

Backed by **PostgreSQL**.

---

### Worker

Consumes jobs from RabbitMQ and executes them.

Responsibilities:

- Pull jobs from queue
- Update job status
- Call container manager
- Retry failed jobs

---

### Container Manager

Handles Docker containers for function execution.

Responsibilities:

- Start containers
- Reuse warm containers
- Execute functions inside containers
- Cleanup idle containers

---

## Function Execution Flow

### 1. Register Function

```
POST /register
```
Gateway:

- Creates temporary build folder
- Writes user code
- Builds Docker image
- Stores metadata in registry
- Deletes temp folder

---

### 2. Invoke Function

```
POST /invoke
```
Gateway:

- Verifies function exists
- Creates job entry
- Pushes job to RabbitMQ

---

### 3. Worker Processes Job

Worker:

- Consumes job from queue
- Marks job as running
- Sends execution request to container manager

---

### 4. Container Execution

Container manager:

- Fetches Docker image
- Starts or reuses container
- Executes function

---

### 5. Job Completion

Worker updates job status:

```
queued → running → completed / failed
```

User can query result:

```
GET /jobs/:jobId
```

---

## Project Structure
```
cloudfunc/
│
├── gateway/
│ └── gateway.js
│
├── registry/
│ ├── index.js
│ ├── db.js
│ └── routes/
│ ├── functions.js
│ └── jobs.js
│
├── worker/
│ └── index.js
│
├── container-manager/
│ └── manager.js
│
└── tmp/
```
---

## Setup

### Clone Repository

```bash
git clone https://github.com/j1y4-j/Group-A-Cloudfunc.git
cd CloudFunc
```

### Install Dependencies

Run inside each service folder:

```bash
npm install

```

### Start PostgreSQL (Docker)

```bash
docker run -d \
-p 5433:5432 \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_DB=cloudfunc \
postgres
```

### Start RabbitMQ

```bash
docker run -d -p 5672:5672 rabbitmq

```

### Start Services

Run each service in separate terminals:

```bash
node registry/index.js
node gateway/gateway.js
node worker/index.js
node container-manager/manager.js
```

### Example Usage

#### Register Function
```
POST /register
```
```

{
  "name": "sum",
  "runtime": "nodejs",
  "code": "const payload = JSON.parse(process.env.PAYLOAD || '{}'); console.log(payload.a + payload.b);"
}
```

#### Invoke Function

```
POST /invoke
```
```

{
  "functionName": "sum",
  "payload": {
    "a": 5,
    "b": 7
  }
}
```

#### Response:

```

{
  "jobId": "uuid"
}
```

#### Check Job Status

```
GET /jobs/:jobId
```
#### Example Functions

Sum

```

const payload = JSON.parse(process.env.PAYLOAD || "{}");
console.log(payload.a + payload.b);
```

Reverse String

```

const payload = JSON.parse(process.env.PAYLOAD || "{}");
console.log(payload.text.split("").reverse().join(""));
```

---

## Future Improvements

- Horizontal worker scaling

- Distributed container orchestration

- Image registry integration

- Function versioning

- Web dashboard for monitoring

---

## Conclusion

### CloudFunc – Serverless Execution Platform

- Built a serverless function execution platform using Node.js, Docker, RabbitMQ, and PostgreSQL.

- Designed an event-driven microservices architecture for asynchronous job processing.

- Implemented warm container pooling and fault-tolerant worker execution.
