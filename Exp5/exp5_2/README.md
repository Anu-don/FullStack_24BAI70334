# exp1_5_2 — Global Exception Handling & Structured Logging (Spring Boot + React)

**Aim:** To implement global exception handling and structured logging for
building robust and observable backend systems.

**Objectives covered:**
- Handle exceptions centrally using `@ControllerAdvice`
- Implement logging mechanisms for request tracking
- Use correlation IDs for tracing requests
- Improve system observability and debugging
- (Carried over from exp1_5_1) REST API design, CRUD, Bean Validation, CORS

---

## Project Structure

```
exp1_5_2/
├── backend/     → Spring Boot REST API (Java, Maven)
├── frontend/    → React app (Product Manager UI)
└── README.md    → this file
```

---

## Prerequisites (install these first)

| Tool | Version | Check with |
|------|---------|------------|
| JDK  | 17 or newer | `java -version` |
| Maven| 3.6+    | `mvn -version` |
| Node.js | 18+  | `node -version` |
| npm  | comes with Node | `npm -version` |

This project does **not** use Lombok, so it compiles cleanly on any modern JDK
(17 through the very latest release) with no annotation-processor issues.

---

## STEP 1 — Run the Backend (Spring Boot)

1. Open a terminal and go into the backend folder:
   ```bash
   cd exp1_5_2/backend
   ```

2. Download dependencies and build:
   ```bash
   mvn clean install
   ```

3. Run the server:
   ```bash
   mvn spring-boot:run
   ```

4. Wait until you see `Started RestApiApplication` in the console.
   The API is now running at **http://localhost:8080**

5. Verify it works — open in a browser:
   ```
   http://localhost:8080/api/products
   ```
   You should see:
   ```json
   {"success":true,"message":"Products fetched successfully","data":[]}
   ```

   You can also browse the in-memory database at
   **http://localhost:8080/h2-console**
   (JDBC URL: `jdbc:h2:mem:productdb`, user: `sa`, password: blank)

**Keep this terminal running** — don't close it while using the app.

---

## STEP 2 — Run the Frontend (React)

1. Open a **new** terminal (leave the backend running in the first one) and go into the frontend folder:
   ```bash
   cd exp1_5_2/frontend
   ```

2. Install the required npm packages (reads `package.json` and installs
   React, Axios, react-scripts, etc.):
   ```bash
   npm install
   ```

3. Start the React app:
   ```bash
   npm start
   ```

4. Your browser should automatically open **http://localhost:3000**
   showing the **Product Manager** page — a form to add products and a
   table listing them.

**Keep this terminal running too.** You now have two servers running:
backend on port 8080, frontend on port 3000.

---

## STEP 3 — Use the App

- Fill in the form (Name, Description, Price, Quantity) and click **Add Product**.
- It appears instantly in the table below (fetched live from the Spring Boot API).
- Click **Edit** on any row to load it into the form and update it.
- Click **Delete** to remove it (with a confirmation prompt).
- Try submitting an empty name or a negative price — you'll see the
  validation error messages returned directly from the backend
  (`@NotBlank`, `@Positive`, etc. in `ProductDTO.java`), proving the
  validation layer works end-to-end.

---

## Observability: Correlation IDs & Structured Logging

Every request gets a unique **correlation ID**:

- `CorrelationIdFilter` (backend) reads it from the `X-Correlation-Id` request
  header if the caller sent one, otherwise generates a new UUID.
- It's stored in SLF4J's MDC, so **every log line for that request** —
  across the filter, service layer, and exception handler — is automatically
  tagged with it.
- It's returned in the JSON body (`correlationId` field) and as a response
  header, so the frontend can display it.
- The React UI shows a small badge with the correlation ID of the last
  request — click into `backend/logs/application.log` and search for that
  ID to see every log line generated while handling it, end to end.

This means: if something goes wrong, you don't have to guess which log
lines belong to which request — just match the correlation ID.

Try it: create a product with an empty name, then look at the last few
lines of `backend/logs/application.log` — you'll see the validation warning
tagged with the same correlation ID shown in the red error banner in the UI.

---



```bash
# Create a product
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Keyboard","description":"Mechanical","price":999.0,"quantity":10}'

# Get all products
curl http://localhost:8080/api/products

# Update a product (id=1)
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Keyboard","description":"Mechanical RGB","price":1099.0,"quantity":8}'

# Delete a product (id=1)
curl -X DELETE http://localhost:8080/api/products/1

# Trigger a validation error (empty name, negative price)
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"","price":-5,"quantity":1}'
```

---

## Standardized Response Shape

Every backend response follows this shape, success or error:

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { "id": 1, "name": "Keyboard", "price": 999.0, "quantity": 10 },
  "timestamp": "2026-08-16T21:00:00"
}
```

---

## Endpoints Reference

| Method | Endpoint              | Description       |
|--------|-----------------------|--------------------|
| POST   | /api/products          | Create a product   |
| GET    | /api/products          | Get all products    |
| GET    | /api/products/{id}     | Get product by id   |
| PUT    | /api/products/{id}     | Update a product    |
| DELETE | /api/products/{id}     | Delete a product    |

---

## Architecture (backend)

```
CorrelationIdFilter → assigns/reads correlation ID, logs request/response, sets MDC
   ↓
Controller  → handles HTTP requests, validates input (@Valid)
   ↓
Service     → business logic, entity ↔ DTO mapping, logs each operation
   ↓
Repository  → Spring Data JPA, talks to the database
   ↓
Entity      → JPA-mapped table (Product)

GlobalExceptionHandler (@RestControllerAdvice) → catches validation & not-found
                          errors, logs them with full context, returns them
                          in the same ApiResponse shape (with correlationId)
CorsConfig              → whitelists http://localhost:3000 so the
                          React app can call the API securely
```

## Key Concepts Demonstrated

- **Resource-based design**: `/api/products` maps to the Product resource; HTTP verbs express the action.
- **Standard response structure**: every response uses `ApiResponse<T>` (success flag, message, data, timestamp).
- **Bean Validation**: `@NotBlank`, `@Positive`, `@Min`, etc. on `ProductDTO`, enforced via `@Valid`.
- **Centralized error handling**: `@RestControllerAdvice` converts exceptions into consistent JSON errors with correct HTTP status codes (400, 404, 500).
- **Layered architecture**: Controller → Service → Repository → Entity, keeping concerns separated and the code scalable.
- **CORS**: explicit, restricted cross-origin policy rather than a wildcard, so only the trusted frontend origin can call the API.

---

## Troubleshooting

**Frontend shows "Could not reach the backend"**
→ Make sure the backend terminal is still running and shows no errors,
and that `http://localhost:8080/api/products` loads directly in a browser.

**CORS error in browser console**
→ Confirm the frontend is running on port 3000 exactly (`npm start` default).
If you changed the port, update `allowedOrigins` in
`backend/src/main/java/com/example/restapi/config/CorsConfig.java`
and the `@CrossOrigin` value in `ProductController.java`.

**Port already in use**
→ Backend: change `server.port` in `backend/src/main/resources/application.properties`.
→ Frontend: React will prompt to use a different port automatically if 3000 is taken.
