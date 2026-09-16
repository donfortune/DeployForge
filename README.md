# Express Layered Monolith Boilerplate

A production-ready Node.js and Express starter template built around a **4-Layer Architecture**: Presentation, Business, Persistence, and Database/Infrastructure.

Designed for **maintainability, testability, scalability, and operational observability**, with built-in module generation powered by Plop.js.

---

## Architecture Overview

This project enforces a strict **top-to-bottom, one-way dependency flow**.

Business logic remains decoupled from HTTP concerns, while persistence and infrastructure concerns are isolated from the application domain.

```text
┌─────────────────────────────────────────────────────────┐
│                   Presentation Layer                    │
│   Routes • Controllers • Middlewares • HTTP Concerns    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                     Business Layer                      │
│        Domain Logic • Use Cases • Workflows             │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   Persistence Layer                     │
│       Repositories • Models • Data Access Logic         │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│              Database / Infrastructure Layer            │
│        Database • Configuration • Telemetry • Logs      │
└─────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

#### 1. Presentation Layer — `src/presentation/`

Responsible for HTTP and Express-specific concerns.

* **`routes/`** — Defines API endpoints and maps requests to controllers.
* **`controllers/`** — Extracts data from Express `req`/`res` objects, invokes business services, and formats HTTP responses.
* **`middlewares/`** — Handles request-level concerns such as validation, authentication, authorization, and error handling.

#### 2. Business Layer — `src/services/`

Contains the application's core business logic.

* Domain rules
* Calculations
* Data transformations
* Application workflows
* Business validations

**Architectural rule:** Services should remain unaware of Express, HTTP requests, and HTTP response objects.

Services accept and return plain JavaScript objects and throw application-specific errors where necessary.

#### 3. Persistence Layer — `src/persistence/`

Responsible for data access and database-facing abstractions.

* **`models/`** — Mongoose/ODM schemas representing persisted data.
* **`repositories/`** — Encapsulates direct database interactions and provides a clean interface to the business layer.

#### 4. Database / Infrastructure Layer — `src/config/`

Responsible for application infrastructure and external technical concerns.

* Database connections
* Environment configuration
* Logging
* Telemetry initialization
* Infrastructure clients
* Connection pooling and related configuration

---

## Repository Structure

```text
my-layered-app/
├── src/
│   ├── config/                    # Database & infrastructure setup
│   │   ├── db.js                  # Mongoose connection logic
│   │   ├── env.js                 # Environment configuration
│   │   └── logger.js              # Centralized logger setup
│   │
│   ├── presentation/              # Presentation Layer
│   │   ├── controllers/           # HTTP controllers
│   │   ├── routes/                # API routes
│   │   │   └── v1/                # Versioned API routes
│   │   └── middlewares/            # Express middlewares
│   │
│   ├── services/                  # Business Layer
│   │
│   ├── persistence/               # Persistence Layer
│   │   ├── models/                # Mongoose schemas
│   │   └── repositories/          # Data access repositories
│   │
│   ├── utils/                     # Shared utilities
│   │   └── errors/                # Custom application errors
│   │
│   ├── app.js                     # Express application configuration
│   └── server.js                  # HTTP server entry point
│
├── templates/                     # Plop/Handlebars generator templates
├── tests/                         # Unit & integration tests
├── telemetry/                     # Prometheus & Loki configuration
├── docs/                          # OpenAPI / Swagger documentation
├── client/                        # Frontend/static assets
│
├── Dockerfile                     # Container definition
├── docker-compose.yml             # Multi-service Docker stack
├── plopfile.js                    # Plop.js generator configuration
├── .env.example                   # Environment variable template
└── README.md                      # Project documentation
```

---

## Quick Start

### Prerequisites

Before getting started, ensure you have:

* **Node.js** `>= 18.x`
* **MongoDB** running locally on port `27017` or a remote MongoDB instance
* **Docker & Docker Compose** *(optional, for containerized execution)*

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/my-layered-app.git
cd my-layered-app
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Configure environment variables

Create your local environment file from the provided example:

```bash
cp .env.example .env
```

Update `.env` with the appropriate values for your environment.

> **Note:** Never commit your `.env` file or secrets to version control.

#### 4. Start the development server

```bash
npm run dev
```

The application will start using the development configuration with hot reloading enabled.

---

## Feature Generator

To maintain architectural consistency, this project includes an automated module generator powered by **Plop.js**.

### Generating a New Module

Run:

```bash
npm run g
```

Enter the name of your resource/module when prompted.

For example:

```text
poll
user
order
```

The generator automatically creates the corresponding files using the configured Handlebars templates.

For a module named `poll`, the generator creates:

```text
src/
├── presentation/
│   ├── controllers/
│   │   └── pollController.js
│   └── routes/
│       └── v1/
│           └── pollRoutes.js
│
├── services/
│   └── pollService.js
│
└── persistence/
    └── models/
        └── Poll.js
```

This helps ensure that new features follow the project's architectural conventions rather than introducing ad-hoc structures.

---

## Available Scripts

| Command       | Description                                       |
| ------------- | ------------------------------------------------- |
| `npm run dev` | Starts the development server with hot reloading. |
| `npm start`   | Starts the production server.                     |
| `npm run g`   | Launches the interactive Plop module generator.   |
| `npm test`    | Runs the Jest unit and integration test suites.   |

---

## Testing

Run the complete test suite with:

```bash
npm test
```

Tests are organized under:

```text
tests/
├── unit/
└── integration/
```

The goal is to keep business logic independently testable while using integration tests to verify interactions between application layers.

---

## API Documentation

OpenAPI/Swagger documentation is maintained under:

```text
docs/
```

This provides a centralized reference for available API endpoints and their expected request/response structures.

---

## Observability

The project includes an operational observability stack designed to support application monitoring and centralized logging.

Current components include:

* **Prometheus** — Metrics collection
* **Loki** — Log aggregation
* Application logging
* Telemetry configuration

Configuration is maintained under:

```text
telemetry/
```

---

## Docker

The entire application stack can be run using Docker Compose.

### Build and start the stack

```bash
docker compose up -d --build
```

### View application logs

```bash
docker compose logs -f app
```

### Stop the stack

```bash
docker compose down
```

The Docker Compose environment can include:

* Express application
* MongoDB
* Prometheus
* Loki

---

## Architectural Principles

This boilerplate is built around several core principles:

### Separation of Concerns

Each layer has a clearly defined responsibility.

### Dependency Direction

Dependencies flow from:

```text
Presentation
     ↓
Business
     ↓
Persistence
     ↓
Database / Infrastructure
```

Higher-level application logic should not depend directly on HTTP or database implementation details.

### Testability

Business logic is isolated from Express and database concerns, making services easier to unit test independently.

### Consistency

The Plop generator provides a standardized structure for introducing new modules and features.

### Observability

Logging, metrics, and telemetry are treated as first-class operational concerns rather than afterthoughts.

---

## License

This project is licensed under the **MIT License**.
