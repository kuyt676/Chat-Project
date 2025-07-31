# Project Overview

This project is built using a microservices architecture and consists of the following components:

- **UI**: A React-based frontend that communicates with backend services.
- **API Gateway**: Implemented in Go, it acts as a single entry point that routes client requests to the appropriate microservice. Designed to efficiently handle concurrent requests.
- **Microservices**: Two Python-based services (`MS-preProcess` and `MS-inference`) leveraging the LangChain library for advanced agent and LLM processing.

# Architecture Overview

The system follows a microservices architecture with an API Gateway directing traffic between the frontend and backend services. The React UI sends requests to the API Gateway, which forwards them to the respective microservices for processing.

# Key Design Decisions and Assumptions

- The API Gateway is implemented in Go to efficiently handle multiple concurrent client requests.
- Microservices are separated to maintain modularity and scalability.
- Communication between services uses RESTful APIs.
- Microservices are assumed to be independently deployable and scalable.
- Python was chosen for the microservices due to the powerful LangChain library for working with agents and large language models.
- Docker is used to containerize all components for easy local development and deployment.

# Running the Project Locally (with Docker)

Ensure you have Docker installed before proceeding.
