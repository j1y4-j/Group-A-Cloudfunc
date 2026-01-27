Absolutely 👍
Here is a **more concise, clean, and polished `README.md`**, written exactly in **Markdown file format**, ready to **copy–paste as-is**.

---

```md
# Registry Service – CloudFunc

## Overview

The **Registry Service** manages all persistent metadata in the CloudFunc system.  
It tracks **registered functions** and **execution jobs**, enabling asynchronous and scalable function execution.

This service does **not** execute functions or manage Docker containers.  
It only exposes REST APIs used by other services.

---

## Responsibilities

### Function Registry

- Stores metadata for functions built as Docker images
- Each function is registered once and referenced by name

### Job Registry

- Tracks individual function invocations as jobs
- Maintains execution lifecycle and results

---

## Tech Stack

- Node.js
- Express
- PostgreSQL (Dockerized)
- pg (Postgres client)

---

## Database Schema

### `functions`

| Column     | Description         |
| ---------- | ------------------- |
| name (PK)  | Function name       |
| image_name | Docker image tag    |
| runtime    | Runtime environment |
| created_at | Creation timestamp  |

---

### `jobs`

| Column        | Description                           |
| ------------- | ------------------------------------- |
| job_id (PK)   | Unique job ID                         |
| function_name | Function invoked                      |
| payload       | Input payload (JSON)                  |
| status        | queued / running / completed / failed |
| result        | Execution output                      |
| error         | Error message                         |
| submitted_at  | Job creation time                     |
| completed_at  | Completion time                       |
| attempts      | Retry count                           |

---

## API Endpoints

### Function Registry

**Create Function**
```

POST /functions

````
```json
{
  "name": "hello",
  "imageName": "cloudfunc-hello:latest",
  "runtime": "nodejs"
}
````

**Get Function**

```
GET /functions/:name
```

---

### Job Registry

**Create Job**

```
POST /jobs
```

```json
{
  "jobId": "job-001",
  "functionName": "hello",
  "payload": { "name": "test" }
}
```

**Get Job**

```
GET /jobs/:jobId
```

**Update Job**

```
PATCH /jobs/:jobId
```

```json
{ "status": "running" }
```

Valid transitions:

```
queued → running → completed / failed
```

---

## Job Lifecycle

```
queued → running → completed
              ↘ failed
```

Invalid state transitions are rejected.

---

## Integration

- **Gateway**: Registers functions and creates jobs
- **Worker**: Fetches function metadata and updates job state

---

## What This Service Does NOT Do

- Build Docker images
- Run containers
- Execute functions
- Manage message queues

---

## Running the Service

```bash
npm install
node index.js
```

Runs at:

```
http://localhost:3000
```

---

## Testing

Endpoints were tested using `curl` and PostgreSQL queries.

Example:

```bash
curl localhost:3000/health
```

---

## Responsibility

**Registry Service**

Implemented function metadata storage, job tracking, validations, and lifecycle enforcement.

```

---


```
