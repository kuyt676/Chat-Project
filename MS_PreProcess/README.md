# Article Analyzer Microservice

This microservice analyzes news or article content using OpenAI and LangChain. It extracts tone, sentiment, keywords, topics, and named entities, and stores the results in a SQLite database and a FAISS vector store.

## Features

- Fetches and analyzes article content from a URL.
- Extracts tone, sentiment score, keywords, topics, people, organizations, and locations.
- Stores analysis results in a SQLite database.
- Stores article embeddings in a FAISS vector database for semantic search.
- Exposes a FastAPI HTTP API for integration with other services.

## API Endpoint

- `POST /analyze_url/`  
  Fetch, analyze, and store article from a URL.
  ```json
  {
    "url": "https://example.com/article",
    "title": "Article Title"
  }
  ```

## Running Locally

### Prerequisites

- Docker (recommended) or Python 3.11+

### With Docker

Build the Docker image:
```sh
docker build -t article-analyzer .
```

Run the Docker container:
```sh
docker run -p 5001:5001 article-analyzer
```

### With Python

Install dependencies:
```sh
pip install -r requirements.txt
```

Run the FastAPI service:
```sh
uvicorn main:app --reload --port 5001
```

## Usage Example

Send a POST request to analyze an article by URL:

```sh
curl -X POST "http://localhost:5001/analyze_url/" -H "Content-Type: application/json" -d '{"url": "https://example.com/article", "title": "Example"}'
```

## Project Structure

- `main.py` - FastAPI app and CLI entry point
- `analyze.py` - Article analysis logic
- `storage.py` - Database and vector store logic
- `requirements.txt` - Python dependencies
- `Dockerfile` - Containerization instructions

## Data Storage

- **SQLite Database:**  
  Stores article metadata and extracted analysis results (tone, sentiment, keywords, topics, entities) in a local file (`articles.db`). This allows for easy querying and persistence of structured article information.

- **FAISS Vector Database:**  
  Stores vector embeddings of article text chunks in a local FAISS index (`faiss_index`). This enables fast similarity search and semantic retrieval of articles based on their content.

## Building the Database

The SQLite database (`articles.db`) and FAISS vector database (`faiss_index`) are created automatically the first time you run the service and submit an article for analysis.  
No manual setup is required.

If you want to (re)initialize the database manually, you can run:
```sh
python -c "from storage import init_db; init_db()"
```

## Notes

- Requires OpenAI API key configured for LangChain/OpenAI usage.
- The service is stateless except for the SQLite and FAISS files created in the working directory.
- The service is stateless except for the SQLite and FAISS files created in the working directory.
