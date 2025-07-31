from dotenv import load_dotenv
load_dotenv()

from langchain.chat_models import ChatOpenAI
from langchain.agents import Tool, initialize_agent
from langchain.agents.agent_types import AgentType
from langchain.chains import SQLDatabaseChain, RetrievalQA
from langchain.sql_database import SQLDatabase
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.prompts import SystemMessagePromptTemplate
import yaml

# === NEW: Add cache setup ===
from langchain.globals import set_llm_cache
from langchain.cache import SQLiteCache

# Set up a persistent cache using SQLite
set_llm_cache(SQLiteCache(database_path=".langchain.db"))

# === 1. Load the system prompt and tool descriptions from YAML ===
with open("prompts.yaml", "r", encoding="utf-8") as f:
    yaml_data = yaml.safe_load(f)
    system_prompt_text = yaml_data["system_prompt"]
    tool_descriptions = yaml_data["tool_descriptions"]

system_message_prompt = SystemMessagePromptTemplate.from_template(system_prompt_text)

# === 2. Initialize the language model ===
llm = ChatOpenAI(temperature=0)

# === 3. Setup SQL database connection ===
db = SQLDatabase.from_uri("sqlite:///articles.db")
sql_chain = SQLDatabaseChain.from_llm(llm, db, verbose=True)

# === 4. Setup Vector DB for semantic search ===
embedding = OpenAIEmbeddings()
vector_db = FAISS.load_local("faiss_articles", embedding)
retriever = vector_db.as_retriever(search_type="similarity", search_kwargs={"k": 5})
vector_qa = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

# === 5. Define tool functions that wrap the chains ===
def sql_search_tool(query: str) -> str:
    return sql_chain.run(query)

def vector_search_tool(query: str) -> str:
    return vector_qa.run(query)

def summarize_article_tool(article_content: str) -> str:
    """
    Summarize the given article content using the LLM.
    """
    prompt = f"Summarize the following article in a concise paragraph:\n\n{article_content}"
    return llm.predict(prompt)

# === 6. Create tools for the agent to use ===
tools = [
    Tool(
        name="SQLSearch",
        func=sql_search_tool,
        description=tool_descriptions["SQLSearch"]
    ),
    Tool(
        name="VectorDBSearch",
        func=vector_search_tool,
        description=tool_descriptions["VectorDBSearch"]
    ),
    Tool(
        name="SummarizeArticle",
        func=summarize_article_tool,
        description=tool_descriptions["SummarizeArticle"]
    )
]

# === 7. Initialize the agent ===
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.OPENAI_FUNCTIONS,
    system_message_prompt=system_message_prompt,
    verbose=True,
)

# === 8. Example queries ===
if __name__ == "__main__":
    example_questions = [
        "Which article has a more positive tone regarding AI regulation?",
        "What are the main economic trends discussed in the articles?"
    ]

    for question in example_questions:
        print(f"Question: {question}")
        response = agent.run(question)
        print(f"Answer: {response}\n{'-'*60}\n")
