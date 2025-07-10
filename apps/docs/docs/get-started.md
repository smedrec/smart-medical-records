# Get Started

This guide will walk you through setting up your development environment for SMEDREC and running the project locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [pnpm](https://pnpm.io/installation)
- [Just](https://github.com/casey/just#installation) (a command runner)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/smedrec/smart-medical-records.git # Replace with actual repo URL
    cd YOUR_REPOSITORY_NAME
    ```

    _Note: If you are a contributor, fork the repository first and clone your fork._

2.  **Install dependencies:**
    The project uses `pnpm` for package management and `Just` for running scripts. Install all dependencies using the following command:
    ```bash
    just install
    ```
    This command will install dependencies for all apps and packages in the monorepo.

## Running the Development Servers

To start the development servers for all applications (e.g., API, web frontend), run:

```bash
just dev
```

This will typically start the API server and the web application, allowing you to interact with SMEDREC in your local environment. Check your terminal output for the specific ports they are running on (e.g., `http://localhost:3000` for the web app, `http://localhost:8801` for the API).

## Building for Production

To build all applications for production, use:

```bash
just build
```

## Running Tests

To run all tests across the project, use:

```bash
just test
```

You can also run tests for a specific application or package. For example, to test the API:

```bash
pnpm turbo -F @smedrec/api test
```

## Deployment

To deploy the applications (typically to Cloudflare Workers), use:

```bash
just deploy
```

## Next Steps

- Explore the [Project Structure](./project-structure.md)
- Learn about our [Development Workflow](./development/workflow.md)
