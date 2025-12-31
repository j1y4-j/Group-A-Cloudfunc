
# CloudFunc – Container Manager & Function Runner Execution


## 1. Introduction
This demonstrates a simplified serverless execution platform.
Instead of executing a simple command like `echo`, the system dynamically runs
a Function Runner container and invokes it via HTTP.

The helps understand:
- Container orchestration
- Serverless execution flow
- HTTP-based microservices
- Stateless function execution

---

## 2. Components

### Function Runner
- Node.js + Express application
- Runs inside Docker container
- Listens on fixed port 3000
- Executes different functions based on input
- Supports concurrent requests

### Container Manager
- Node.js + Express service
- Uses Dockerode to manage containers
- Exposes POST /execute endpoint
- Starts Function Runner container if not running
- Sends HTTP request to Function Runner
- Returns response upstream

---

## 3. Architecture


---

### Ports & Endpoints

| Service           | Port | Endpoint  | Method |
|------------------|------|-----------|--------|
| Container Manager | 4000 | /execute  | POST   |
| Function Runner   | 3000 | /run      | POST   |


---

## 4. Prerequisites
- Docker Desktop (WSL integration enabled)
- Node.js installed inside WSL
- curl or Postman

---

## 5. How to Run

### Step 1: Build Function Runner Image
```bash
cd function-runner
docker build -t function-runner .
```
### Step 2: Start Container Manager
```bash
cd ../container-manager
npm install
npm start
```
You should see:
Container Manager running on port 4000

---
## 6. Supported Functions
- hellofunc
- sum
- multiply
- uppercase
- reverse
- wordCount
- sortNumbers
- filterEven
- mergeObjects
- delay (async)

---
## 7. How to Test Using curl

Example: Sum of numbers
```bash
curl -X POST http://localhost:4000/execute \
-H "Content-Type: application/json" \
-d '{
  "image": "function-runner",
  "payload": {
    "action": "sum",
    "numbers": [10,20,30]
  }
}'
```
---

## 8. How to Test Using Postman(Preferred)

- Method: POST
- URL: http://localhost:4000/execute
- Header: Content-Type = application/json
- Body (raw JSON):


### hellofunc
```json
{
  "image": "function-runner",
  "payload": {
    "action": "hello",
    "name": "Prashasti"
  }
}
```
### Expected output
```json
{
    "success": true,
    "functionResponse": {
        "success": true,
        "action": "hello",
        "result": "Hello Prashasti! Welcome to CloudFunc 🚀"
    }
}
```
### Uppercase
```json
{
  "image": "function-runner",
  "payload": {
    "action": "uppercase",
    "text": "cloud func"
  }
}
```
### Sum
```json
{
  "image": "function-runner",
  "payload": {
    "action": "sum",
    "numbers": [10, 20, 30]
  }
}
```
### Multiply Numbers
```json
{
  "image": "function-runner",
  "payload": {
    "action": "multiply",
    "numbers": [2, 3, 4]
  }
}
```
### Reverse String
```json
{
  "image": "function-runner",
  "payload": {
    "action": "reverse",
    "text": "serverless"
  }
}
```
### World Count
```json
{
  "image": "function-runner",
  "payload": {
    "action": "wordCount",
    "text": "cloud func assignment"
  }
}
```
### Sort Numbers
```json
{
  "image": "function-runner",
  "payload": {
    "action": "sortNumbers",
    "numbers": [5, 1, 9, 2]
  }
}
```
### Filter Even Numbers
```json
{
  "image": "function-runner",
  "payload": {
    "action": "filterEven",
    "numbers": [1, 2, 3, 4, 5, 6]
  }
}
```
### Merge Objects
```json
{
  "image": "function-runner",
  "payload": {
    "action": "mergeObjects",
    "objects": [
      { "a": 1 },
      { "b": 2 },
      { "c": 3 }
    ]
  }
}
```
### Delay Execution (Cold Start Simulation)
```json
{
  "image": "function-runner",
  "payload": {
    "action": "delay",
    "time": 2000
  }
}
```

---



## 9. Handling Multiple Requests
The Function Runner is stateless and uses Node.js async handling,
allowing multiple concurrent requests without interference.

---

## 10.Requirement Mapping

✔ POST /execute endpoint  
✔ Accepts image name & payload  
✔ Starts container if not running  
✔ Sends HTTP request to Function Runner  
✔ Collects & returns response  
✔ Fixed port Function Runner  
✔ Handles multiple requests  
✔ Supports complex function logic  

---

## 11. Conclusion
This successfully demonstrates container-based serverless execution


---


