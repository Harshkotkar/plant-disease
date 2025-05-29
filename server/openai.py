import openai
import os
from dotenv import load_dotenv


load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

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
