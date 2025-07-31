import sqlite3
import json
from datetime import datetime
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS

DB_PATH = "articles.db"
VECTOR_DB_PATH = "faiss_index"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            tone TEXT,
            sentiment_score REAL,
            keywords TEXT,
            topics TEXT,
            people TEXT,
            organizations TEXT,
            locations TEXT,
            created_at TEXT
        )
    """)
    conn.commit()
    conn.close()

def save_article(title, analysis):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    tone = analysis.get("tone", {})
    extracted = analysis.get("extracted", {})
    cursor.execute("""
        INSERT INTO Articles (
            title, tone, sentiment_score, keywords, topics, people, organizations, locations, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        title,
        tone.get("tone"),
        tone.get("sentiment_score"),
        json.dumps(extracted.get("keywords", []), ensure_ascii=False),
        json.dumps(extracted.get("topics", []), ensure_ascii=False),
        json.dumps(extracted.get("people", []), ensure_ascii=False),
        json.dumps(extracted.get("organizations", []), ensure_ascii=False),
        json.dumps(extracted.get("locations", []), ensure_ascii=False),
        datetime.utcnow().isoformat()
    ))
    conn.commit()
    conn.close()

def split_and_store_vector_db(article_text):
    from langchain.text_splitter import CharacterTextSplitter

    text_splitter = CharacterTextSplitter(separator="\n\n", chunk_size=500, chunk_overlap=50)
    chunks = text_splitter.split_text(article_text)

    embeddings = OpenAIEmbeddings()
    vector_store = FAISS.from_texts(chunks, embeddings)

    vector_store.save_local(VECTOR_DB_PATH)
    print(f"Saved {len(chunks)} chunks in VectorDB at '{VECTOR_DB_PATH}'.")
    vector_store.save_local(VECTOR_DB_PATH)
    print(f"Saved {len(chunks)} chunks in VectorDB at '{VECTOR_DB_PATH}'.")
