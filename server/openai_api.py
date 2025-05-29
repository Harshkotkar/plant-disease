import openai
import os
from dotenv import load_dotenv

# Load API key securely from .env file (recommended practice)
load_dotenv()
openai.api_key = os.getenv("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")

# Initialize the OpenAI client
client = openai.Client()

def generate_advice(disease_name):
    prompt = f"""
    Provide details about the following plant disease:
    Disease: {disease_name}

    Include:
    - Causes
    - Precautionary Measures
    - Recommended Pesticides
    """
    
    # Updated API format for chat completion
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200
    )
    
    return response.choices[0].message.content.strip()
