# Function Registry Service

A simple backend service that registers and lists serverless functions using **Node.js, Express, PostgreSQL, and Docker**.

---

## Overview

The service stores **metadata** about functions (name, owner, Docker image reference) in a PostgreSQL database. It does **not** store function code or Docker images themselves.

---

## Architecture

```
Client → Express API → PostgreSQL (Docker)
```

- Node.js runs the API
- PostgreSQL runs inside a Docker container

---

## Technologies

- Node.js + Express
- PostgreSQL
- Docker
- pg (PostgreSQL client)

---

## Database

**Database:** `functions_db`

**Table:** `functions`

```sql
CREATE TABLE functions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  owner VARCHAR(100),
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Run PostgreSQL (Docker)

```bash
docker run --name function-registry-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=functions_db \
  -p 5433:5432 \
  -d postgres
```

---

## Run the Project

```bash
npm install
node index.js
```

Server runs at:

```
http://localhost:3000
```

---

## API Endpoints

### POST `/registerFunction`

Registers a new function.

```json
{
  "name": "image-resize",
  "owner": "jiya",
  "image": "docker.io/jiya/image-resize:latest"
}
```

### GET `/functions`

Returns all registered functions.

### GET `/function/:name`

- **Returns:** Metadata for a specific function.
- **Used by:** Gateway to resolve image names.
- **Response Example:** `{"name": "...", "owner": "...", "image": "..."}`

---

## Key Points

- PostgreSQL stores only function metadata
- Docker images are referenced by name/URL
- `pg` is used to execute SQL queries

---

## Conclusion

This project demonstrates a basic function registry using REST APIs and a Dockerized PostgreSQL database for persistent storage.
