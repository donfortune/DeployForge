Markdown
# Express Layered Monolith Boilerplate

A production-ready Node.js & Express starter template built on a **4-Layer Architecture** (Presentation, Business, Persistence, and Database). Designed for maximum maintainability, testability, and operational observability with built-in generator tooling.

---

## Architecture Overview

This project enforces a strict top-to-bottom one-way dependency flow. Business logic is completely decoupled from HTTP handlers and database connections.

┌─────────────────────────────────────────────────────────┐
│                   Presentation Layer                    │
│   (User Interface, HTTP Routes, Controllers, Specs)     │
└────────────────────────────┬────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│                     Business Layer                      │
│     (Core Domain Logic, Use Cases, Middlewares)         │
└────────────────────────────┬────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│                    Persistence Layer                    │
│       (Data Access Objects, ORM / ODM Schemas)          │
└────────────────────────────┬────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│                     Database Layer                      │
│         (Data Store, DB Config, Migrations)             │
└────────────────────────────┴────────────────────────────┘


### Layer Responsibilities

1. **Presentation Layer (`src/presentation/`)**
   * **`routes/`**: Defines API endpoints and maps requests to controllers.
   * **`controllers/`**: Extracts parameters from Express `req`/`res` objects, triggers business services, and returns HTTP status codes and responses.
   * **`middlewares/`**: Handles request pipelines (validation, authentication, global error handling).
2. **Business Layer (`src/services/`)**
   * Contains pure domain rules, calculations, data transformations, and workflows.
   * **Rule:** Completely unaware of Express or HTTP. Accepts and returns plain JavaScript objects or throws custom application errors.
3. **Persistence Layer (`src/persistence/`)**
   * **`models/`**: Mongoose / ODM schemas defining database structures.
   * **`repositories/`**: Abstractions for direct data storage interactions.
4. **Database / Infra Layer (`src/config/`)**
   * Manages database connection pooling, environment validation, logging clients, and telemetry initialization.

---

## Repository Structure

my-layered-app/
├── src/                          # Application source code
│   ├── config/                   # Database & infrastructure setup
│   │   ├── db.js                 # Mongoose connection logic
│   │   ├── env.js                # Environment variable configuration
│   │   └── logger.js             # Centralized logger setup
│   ├── presentation/             # Presentation Layer
│   │   ├── controllers/          # HTTP Controllers (req/res adapters)
│   │   ├── routes/               # API Routes (v1/ versioned)
│   │   └── middlewares/          # Custom Express middlewares
│   ├── services/                 # Business Layer (Domain logic)
│   ├── persistence/              # Persistence Layer
│   │   ├── models/               # Mongoose Schemas
│   │   └── repositories/         # Data Access Repositories
│   ├── utils/                    # Common utilities & custom error classes
│   │   └── errors/               # Custom AppError abstractions
│   ├── app.js                    # Express app configuration & middleware pipeline
│   └── server.js                 # HTTP server entry point & boot script
├── templates/                    # Handlebars (.hbs) generator templates
├── tests/                        # Automated unit & integration tests
├── telemetry/                    # Prometheus & Loki monitoring configs
├── docs/                         # OpenAPI / Swagger documentation
├── client/                       # Frontend static assets
├── dockerfile                    # Container definition
├── docker-compose.yml            # Multi-service stack (App, DB, Loki, Prometheus)
├── plopfile.js                   # Plop.js generator configuration
├── .env                          # Local environment settings
└── README.md                     # Project documentation


---

## Quick Start

### Prerequisites
* **Node.js**: `>= 18.x`
* **MongoDB**: Local instance running on `27017` or a remote MongoDB URI
* **Docker & Docker Compose** (Optional, for containerized execution)

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/my-layered-app.git](https://github.com/your-username/my-layered-app.git)
   cd my-layered-app
Install dependencies:

Bash
npm install
Configure environment variables:

Bash
cp .env.example .env # Create .env and update values as needed
Start the development server:

Bash
npm run dev
Feature Generator (Plop.js)

To maintain consistent architectural standards, this repository includes an automated module generator powered by Plop.js.

Generating a New Module

Run the generator command in your terminal:

Bash
npm run g
When prompted, enter your resource/module name (e.g., poll, user, or order). Plop automatically creates all 4 corresponding files simultaneously using pre-configured Handlebars templates:

src/presentation/controllers/<name>Controller.js

src/services/<name>Service.js

src/presentation/routes/v1/<name>Routes.js

src/persistence/models/<PascalCaseName>.js

Available Scripts

Script	Command	Description
npm run dev	nodemon src/server.js	Starts dev server with hot reloading.
npm start	node src/server.js	Starts production server instance.
npm run g	plop	Triggers the interactive module generator.
npm test	jest	Executes test suite across unit & integration layers.
Deployment & Docker

Run the entire application stack (API server, MongoDB, Prometheus, and Loki) using Docker Compose:

Bash
# Build and run containers in detached mode
docker-compose up -d --build

# View operational application logs
docker-compose logs -f app
License

This project is licensed under the MIT License.


***

### Next Steps
1. Create a `README.md` file in your project root directory and paste the markdown content above into it.
2. Commit the changes and push to GitHub:
   ```bash
   git add README.md
   git commit -m "docs: add world class README documentation"
   git push origin main