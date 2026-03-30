# DonorNet Architecture Diagrams

These diagrams visualize the architecture and data flow of the DonorNet application to help you grasp the workflow quickly for interviews.

## High-Level Architecture
This diagram shows the broad system components (Frontend, API Gateway, Microservices, and Databases) and how they communicate.

```mermaid
graph TD
    %% User/Client Layer
    User((User Interface)) --> Frontend[React Frontend Vite]
    
    %% Gateway Layer
    Frontend -- HTTP/Axios Requests --> APIGateway{API Gateway\nExpress.js}
    
    %% Microservices Layer
    subgraph Backend Microservices
        APIGateway -- /api/auth --> AuthService[Auth Service]
        APIGateway -- /api/donors --> DonorService[Donor Service]
        APIGateway -- /api/hospitals --> HospitalService[Hospital Service]
        APIGateway -- /api/requests --> RequestService[Request Service]
    end
    
    %% Database Layer
    AuthService -. Mongoose .-> DB[(MongoDB Cluster)]
    DonorService -. Mongoose .-> DB
    HospitalService -. Mongoose .-> DB
    RequestService -. Mongoose .-> DB

    %% External APIs
    subgraph Third Party APIs
        GeminiAPI((Google Gemini AI))
    end
    
    Frontend -- Chat Queries --> APIGateway
    APIGateway -- /api/ai --> AuthService
    AuthService -- API Key --> GeminiAPI
```

---

## Low-Level Component Workflow
This sequence diagram shows exactly how data flows from a React component, through the centralized state, across the network using Axios, routed by the API Gateway, processed by a microservice, saved in MongoDB, and finally reflected back on the screen.

```mermaid
sequenceDiagram
    autonumber
    
    participant UI as React Component (e.g. Login.jsx)
    participant Store as Zustand State (authStore.js)
    participant Axios as API Client (apiClient.js)
    participant Gateway as API Gateway
    participant Microservice as Auth Service
    participant DB as MongoDB
    
    UI->>Store: User submits login form
    Store->>Axios: Call API using Credentials
    Axios->>Gateway: POST /api/auth/login
    
    Gateway->>Microservice: Route to auth-service
    Microservice->>DB: Find user by email
    DB-->>Microservice: Return user document
    Microservice->>Microservice: Verify password via bcrypt
    
    alt Correct Password
        Microservice-->>Gateway: 200 OK + JWT Token + User Data
        Gateway-->>Axios: 200 OK Response
        Axios-->>Store: Resolve data
        Store-->>UI: Update global state
        UI->>UI: Redirect to Dashboard
    else Invalid Password
        Microservice-->>Gateway: 401 Unauthorized
        Gateway-->>Axios: 401 Response
        Axios-->>Store: Catch API Error
        Store-->>UI: Show Error Toast Notification
    end
```

> [!TIP]
> **Explaining the Workflow in an Interview:** 
> "In DonorNet, when a user interacts with a React component, we update the UI state using **Zustand**. For data fetching, we leverage **Axios** to hit an **Express.js API Gateway**. The API Gateway doesn't handle business logic; it merely routes the request to the appropriate **Microservice** (like Auth or Request service). The microservice processes the logic, queries **MongoDB using Mongoose**, and sends a JSON response back through the gateway to the frontend, which handles the final React render."
