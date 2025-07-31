import sys
import requests
from bs4 import BeautifulSoup
from analysis import analyze_article
from storage import init_db, save_article, split_and_store_vector_db
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import threading

app = FastAPI()

class ArticleURLRequest(BaseModel):
    url: str
    title: str

@app.on_event("startup")
def startup_event():
    init_db()

@app.post("/analyze_url/")
def analyze_and_store_article_from_url(request: ArticleURLRequest):
    try:
        article_text = fetch_article_text_from_url(request.url)
         # Run chunking and vector DB storage in parallel
        threading.Thread(target=split_and_store_vector_db, args=(article_text,), daemon=True).start()
        analysis = analyze_article(article_text)
        save_article(request.title, analysis)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def fetch_article_text_from_url(url):
    response = requests.get(url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    paragraphs = soup.find_all("p")
    article_text = "\n\n".join(p.get_text() for p in paragraphs)
    return article_text

def run_pipeline_from_url(article_url, title):
    init_db()
    article_text = fetch_article_text_from_url(article_url)
    analysis = analyze_article(article_text)
    save_article(title, analysis)
    # Run chunking and vector DB storage in parallel
    threading.Thread(target=split_and_store_vector_db, args=(article_text,), daemon=True).start()
    print(f"Completed processing for article '{title}' from URL: {article_url}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python main.py <article_url> <article_title>")
        sys.exit(1)

    url = sys.argv[1]
    title = sys.argv[2]

    run_pipeline_from_url(url, title)
    print(f"Completed processing for article '{title}' from URL: {article_url}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python main.py <article_url> <article_title>")
        sys.exit(1)

    url = sys.argv[1]
    title = sys.argv[2]

    run_pipeline_from_url(url, title)
