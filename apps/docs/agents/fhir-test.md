# FHIR Test Agent

This document outlines the structure and functionality of the FHIR Test Agent.

## Overview

- **Name:** `fhir-resources-agent`
- **Description:** An assistant to test FHIR mcp servers.
- **Model:** `groq('llama-3.3-70b-versatile')`

## Instructions

```
You are an Agent that helps developers to test FHIR resources.
```

## Tools

The agent has access to tools provided by the `openMCPServer.getTools()` method. These tools are related to interacting with FHIR resources.

The `openMCPServer` is configured as an `MCPClient` with the following server details:
- **Server Name:** `fhirresources`
- **Command:** `npx`
- **Args:** `['-y', '/home/jose/Documents/workspace/smedrec/fhir-mcp/build/index.js']`
- **Environment Variables:**
    - `FHIR_BASE_URL`: `http://joseantcordeiro.hopto.org:4000/v/r4/fhir`
    - `SMART_CLIENT_ID`: (long token string)
    - `SMART_SCOPE`: `system/*.read`
    - `SMART_ISS`: `https://launch.smarthealthit.org/v/r4/sim/WzQsIiIsIiIsIiIsMCwwLDAsIiIsIiIsIiIsIiIsIiIsIiIsIiIsMSwxLCIiXQ/fhir`

## Memory

The agent uses a `Memory` instance with the following configuration:
- **Embedder:** `ollama.embedding('nomic-embed-text:latest')`
- **Storage:** `pgStorage` (PostgreSQL)
- **Vector:** `pgVector` (PostgreSQL vector search)
- **Options:**
    - `lastMessages: 10`
    - `semanticRecall: { topK: 3, messageRange: 2 }`
