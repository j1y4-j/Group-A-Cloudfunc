# Function Runner Service – CloudFunc 

## Overview

The Function Runner Service is one of the core microservices in the **CloudFunc** project.
This service represents a simple runtime that executes a user function.

The goal is not to execute real user code, but to:
- Accept input from a request
- Simulate function execution
- Return a response

This service will later be started and managed dynamically by the **Container Manager Service**.

---

## Technology Used

- Node.js (v20 LTS)
- Express.js
- Docker

---

## Service Description

The Function Runner exposes a single HTTP endpoint.

When a request is sent:
1. The service receives JSON input
2. Logs the input to the console
3. Returns a response indicating the function was executed

This demonstrates how a user function would be invoked in the CloudFunc system.

---

## API Endpoint

### POST /

**Description:**  
Simulates execution of a function with provided input.

**Request Body (JSON):**
```json
{
  "input": "sample data"
}
{
  "result": "Function executed with input {\"input\":\"sample data\"}"
}
```
## How to Run the Service Locally (Without Docker) 
1. npm install
2. npm start
3. http://localhost:3000

## How to Run the Service Using Docker
1. docker build -t function-runner .
2. docker run -p 3000:3000 function-runner
3. http://localhost:3000

## How to Test the Service
Use curl or any API testing tool (Postman).

###  Using curl (Command-Line)(Linux)

Send a POST request to the service:

```bash
curl -X POST http://localhost:3000/ \
-H "Content-Type: application/json" \
-d '{"input":"Hello CloudFunc"}'
```
Expected Response:
```json
{
  "result": "Function executed with input {\"input\":\"Hello CloudFunc\"}"
}
```
## If u are using windows powershell
```
Invoke-WebRequest `
  -Uri http://localhost:3000 `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"input":"CloudFunc"}'
```
## Testing the Function Runner Service Using Postman

You can use **Postman**, a graphical API testing tool, to test the Function Runner service.  

---

### Steps to Test

1. **Open Postman** → Click **New → Request**.  
2. **Set HTTP Method** to **POST**.  
3. **Enter the URL**: http://localhost:3000/ 
4. **Go to the Body tab** → Select **Raw** → Choose **JSON**.  
5. **Enter the JSON payload**:

```json
{
  "input": "Hello CloudFunc"
}
```
6.Click Send → You should receive the response:
```json
{
  "result": "Function executed with input {\"input\":\"Hello CloudFunc\"}"
}
```