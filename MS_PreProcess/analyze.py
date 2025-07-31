from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import json

llm = OpenAI(model_name="gpt-4o-mini", temperature=0)

analyze_prompt = PromptTemplate(
    input_variables=["article_text"],
    template="""
Given the following article, analyze and return a JSON object with these keys:
- tone
- sentiment_score
- keywords
- topics
- people
- organizations
- locations

Article:
{article_text}
"""
)

analyze_chain = LLMChain(llm=llm, prompt=analyze_prompt, output_key="analysis")

def analyze_article_text(article_text):
    outputs = analyze_chain.run(article_text=article_text)
    try:
        analysis_json = json.loads(outputs.get("analysis", "{}"))
    except Exception:
        analysis_json = {}
    return analysis_json
        paragraphs = soup.find_all('p')
        text = "\n".join([p.get_text() for p in paragraphs])
        return text.strip()
    except Exception:
        return ""

def analyze_article_url(url):
    article_text = fetch_article_text(url)
    outputs = analyze_chain.run(article_text=article_text)
    try:
        analysis_json = json.loads(outputs.get("analysis", "{}"))
    except Exception:
        analysis_json = {}
    return analysis_json
