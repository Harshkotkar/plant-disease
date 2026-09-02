import os
import json
from typing import Optional, Dict, Any
from dotenv import load_dotenv

from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI


load_dotenv()


# 1. Pydantic Schema

class PlantAdvisoryResponse(BaseModel):
    """Structured agricultural advisory schema for plant health diagnosis."""
    diseaseName: str = Field(
        description="Formatted, human-readable name of the crop and condition (e.g. 'Tomato - Late Blight' or 'Apple - Healthy')."
    )
    pathogenType: str = Field(
        description="Type of pathogen: 'Fungal', 'Bacterial', 'Viral', 'Oomycete', 'Pest/Mite', or 'None (Healthy)'."
    )
    severity: str = Field(
        description="Assessed severity level: 'Low', 'Moderate', 'High', 'Critical', or 'None (Healthy)'."
    )
    cause: str = Field(
        description="Detailed etiology, biological cause, and environmental triggers explaining the disease onset."
    )
    prevention: str = Field(
        description="Cultural practices, field hygiene, spacing, crop rotation, and preventive guidelines."
    )
    treatment: str = Field(
        description="Comprehensive treatment and integrated pest management (IPM) guidelines."
    )
    organic_remedy: str = Field(
        description="Eco-friendly biological treatments, organic solutions (e.g., neem oil, bio-fungicides, Trichoderma)."
    )
    chemical_control: str = Field(
        description="Certified chemical fungicides/pesticides with active ingredients, application methods, and safety precautions."
    )
    weather_impact_analysis: str = Field(
        description="Analysis of how temperature, humidity, and wind in the specified location impact disease spread."
    )
    location: str = Field(
        description="The geographical location for which the advice is tailored."
    )
    language: str = Field(
        description="The language used for this advisory report."
    )


#  LangChain Tools

@tool
def weather_pathogen_risk_analyzer(disease_name: str, avg_humidity: float, avg_temp_max: float, avg_temp_min: float) -> str:
    """
    Analyzes microclimate data (humidity and temperature range) to assess pathogen transmission velocity.
    """
    is_fungal_oomycete = any(term in disease_name.lower() for term in ["blight", "rust", "scab", "mildew", "mold", "rot"])
    
    risk_level = "Moderate"
    reasons = []

    if avg_humidity >= 75.0:
        reasons.append("High relative humidity (>75%) significantly accelerates spore germination and foliar colonization.")
        if is_fungal_oomycete:
            risk_level = "High to Critical"
    elif avg_humidity < 50.0:
        reasons.append("Low relative humidity (<50%) inhibits most foliar fungal spore germination.")
        risk_level = "Low"

    if 18.0 <= avg_temp_min and avg_temp_max <= 32.0:
        reasons.append("Temperatures in the 18°C-32°C range provide the optimal biological window for rapid pathogen proliferation.")

    return f"Risk Level: {risk_level}. Analysis: {' '.join(reasons)}"


@tool
def organic_biocontrol_lookup(disease_name: str) -> str:
    """
    Retrieves organic, biological, and cultural control protocols for specific crop diseases.
    """
    disease_lower = disease_name.lower()
    if "blight" in disease_lower or "scab" in disease_lower or "spot" in disease_lower:
        return (
            "Recommended Bio-Controls: Bacillus subtilis or Trichoderma viride foliar sprays; "
            "Copper hydroxide (OMRI-approved); Neem oil (0.5%-1.0%) for preventive surface barrier; "
            "removal of lower infected foliage and mulch application to prevent soil splash."
        )
    elif "mildew" in disease_lower:
        return (
            "Recommended Bio-Controls: Potassium bicarbonate foliar spray (3g/L); "
            "Milk-water solution (1:9 dilution); sulfur dust (for powdery mildew); improved canopy ventilation."
        )
    elif "mite" in disease_lower:
        return (
            "Recommended Bio-Controls: Predatory mites (Phytoseiulus persimilis); insecticidal soap; "
            "neem seed kernel extract (NSKE 5%); wettable sulfur application."
        )
    elif "healthy" in disease_lower:
        return "Plant is healthy. Apply compost tea, vermicompost, and maintain balanced soil microbiology."
    else:
        return "General Organic Guidelines: Copper-based protective sprays, bio-fungicides (Trichoderma spp.), and field sanitation."


# Agent Prompts & Pipeline Construction

SYSTEM_PROMPT = """You are AgroPulse AI, an expert Senior Agricultural Extension Specialist, Plant Pathologist, and Agronomist.
Your mission is to provide certified, actionable, scientific, and culturally appropriate crop diagnostic advice to farmers.

OPERATIONAL GUIDELINES:
1. DIETARY & CROP SAFETY: Recommend certified chemical controls with active ingredients (e.g., Mancozeb, Azoxystrobin, Chlorothalonil) alongside strict safety guidelines (PPE, pre-harvest intervals).
2. ORGANIC-FIRST PRIORITY: Always provide practical bio-control and cultural remedies (e.g., Trichoderma, neem extract, drip irrigation adjustments) alongside chemical treatments.
3. HEALTHY CROP PROTOCOL: If the crop is diagnosed as 'healthy' (e.g. 'Tomato - Healthy'), do NOT suggest fungicides/pesticides. Instead, focus on growth stages, balanced N-P-K nutrition, micronutrients, drip irrigation, and pest monitoring.
4. CLIMATE CONTEXT: Explicitly evaluate how local humidity, temperature, and wind influence pathogen persistence and recommend preventive adjustments.
5. STRICT LANGUAGE LOCALIZATION: Provide all explanations, steps, and recommendations in the requested target language: {target_language}.
"""

HUMAN_PROMPT = """Please analyze the following agricultural diagnosis data and generate a comprehensive advisory report:

DIAGNOSTIC DATA:
- Crop & Condition: {disease_name}
- Farm Location: {location}
- Environmental Weather Metrics:
  * Relative Humidity: {avg_humidity}%
  * Maximum Temperature: {avg_temp_max}°C
  * Minimum Temperature: {avg_temp_min}°C
  * Wind Velocity: {avg_wind_speed} km/h
- Target Language: {target_language}

{format_instructions}
"""


class PlantHealthAgent:
    """
    LangChain-driven AI Agent orchestrating plant pathology diagnostics,
    microclimate risk synthesis, and multilingual structured advisory.
    """

    def __init__(self, model_name: str = "gpt-3.5-turbo", temperature: float = 0.2):
        self.model_name = model_name
        self.temperature = temperature
        self.api_key = os.getenv("OPENAI_API_KEY")
        
        if self.api_key:
            self.llm = ChatOpenAI(
                model=self.model_name,
                temperature=self.temperature,
                openai_api_key=self.api_key
            )
            self.parser = PydanticOutputParser(pydantic_object=PlantAdvisoryResponse)
            
            self.prompt = ChatPromptTemplate.from_messages([
                SystemMessagePromptTemplate.from_template(SYSTEM_PROMPT),
                HumanMessagePromptTemplate.from_template(HUMAN_PROMPT)
            ])
            
            # Construct LCEL (LangChain Expression Language) Chain
            self.chain = self.prompt | self.llm | self.parser
        else:
            self.chain = None

    @staticmethod
    def clean_disease_label(raw_name: str) -> str:
        """Converts raw model classes like 'Tomato___Late_blight' to 'Tomato - Late Blight'."""
        if not raw_name:
            return "Unknown Crop Condition"
        return raw_name.replace("___", " - ").replace("_", " ").strip()

    def run(
        self,
        disease_name: str,
        location: str = "General / Unspecified",
        weather_data: Optional[Dict[str, Any]] = None,
        language: str = "English"
    ) -> Dict[str, Any]:
        """
        Executes the LangChain advisory workflow.
        """
        formatted_name = self.clean_disease_label(disease_name)
        is_healthy = "healthy" in disease_name.lower()

        # Parse weather telemetry
        weather = weather_data or {}
        avg_humidity = weather.get("avgHumidity", "65.0")
        avg_temp_max = weather.get("avgTempMax", "30.0")
        avg_temp_min = weather.get("avgTempMin", "20.0")
        avg_wind_speed = weather.get("avgWindSpeed", "10.0")

        # Fallback if OpenAI API key is unavailable
        if not self.chain or not self.api_key:
            return {
                "diseaseName": formatted_name,
                "pathogenType": "None" if is_healthy else "Pathological",
                "severity": "None" if is_healthy else "Moderate",
                "cause": f"Diagnosed with {formatted_name}. Configure OPENAI_API_KEY in server/.env for dynamic agentic analysis.",
                "prevention": "Ensure balanced irrigation, adequate crop spacing, and routine foliar inspection.",
                "treatment": "Maintain optimal cultural practices and consult local agricultural authorities.",
                "organic_remedy": "Apply bio-fungicides (Trichoderma/Bacillus) or neem-based preventative spray.",
                "chemical_control": "Use certified crop protection products matching regional agricultural regulations.",
                "weather_impact_analysis": f"Evaluated under location {location} (Humidity: {avg_humidity}%, Temp: {avg_temp_min}-{avg_temp_max}°C).",
                "location": location,
                "language": language
            }

        try:
            # Execute LangChain LCEL pipeline
            result: PlantAdvisoryResponse = self.chain.invoke({
                "disease_name": formatted_name,
                "location": location,
                "avg_humidity": avg_humidity,
                "avg_temp_max": avg_temp_max,
                "avg_temp_min": avg_temp_min,
                "avg_wind_speed": avg_wind_speed,
                "target_language": language,
                "format_instructions": self.parser.get_format_instructions()
            })

            return result.model_dump()

        except Exception as e:
            print(f"[LangChain Agent Execution Error]: {e}")
            
            # Robust fallback response matching UI schema
            return {
                "diseaseName": formatted_name,
                "pathogenType": "Unspecified",
                "severity": "Moderate" if not is_healthy else "None",
                "cause": f"Primary condition: {formatted_name}. Detailed agent parsing encountered a temporary issue.",
                "prevention": "Implement standard field sanitation, crop rotation, and avoid overhead sprinkler watering.",
                "treatment": "Prune affected leaves, improve aeration, and apply targeted treatments.",
                "organic_remedy": "Neem oil formulation (10,000 ppm) or copper hydroxide bio-spray.",
                "chemical_control": "Apply broad-spectrum registered agricultural fungicides according to label instructions.",
                "weather_impact_analysis": f"Local conditions at {location}: Humidity {avg_humidity}%, Temp {avg_temp_min}°C - {avg_temp_max}°C.",
                "location": location,
                "language": language
            }


#  Exported Convenience Functions

# Singleton Agent Instance
_agent_instance: Optional[PlantHealthAgent] = None

def get_agent() -> PlantHealthAgent:
    """Retrieves or creates the singleton PlantHealthAgent."""
    global _agent_instance
    if _agent_instance is None:
        _agent_instance = PlantHealthAgent()
    return _agent_instance


def generate_structured_advice(
    disease_name: str,
    location: str = "General",
    weather_data: Optional[Dict[str, Any]] = None,
    language: str = "English",
    model: str = "gpt-3.5-turbo"
) -> Dict[str, Any]:
    """
    Main entry point for generating structured agentic advisory.
    """
    agent = get_agent()
    if agent.model_name != model and os.getenv("OPENAI_API_KEY"):
        agent = PlantHealthAgent(model_name=model)
    return agent.run(disease_name, location=location, weather_data=weather_data, language=language)


def generate_advice(disease_name: str, language: str = "English", location: str = "General") -> str:
    """
    Backward-compatible text formatter for legacy invocations.
    """
    data = generate_structured_advice(disease_name, location=location, language=language)
    return (
        f"Diagnosed Condition: {data.get('diseaseName', disease_name)}\n"
        f"Severity: {data.get('severity', 'N/A')} | Pathogen: {data.get('pathogenType', 'N/A')}\n\n"
        f"1. Biological Cause & Triggers:\n{data.get('cause', 'N/A')}\n\n"
        f"2. Preventive Guidelines:\n{data.get('prevention', 'N/A')}\n\n"
        f"3. Treatment & Integrated Pest Management:\n{data.get('treatment', 'N/A')}\n\n"
        f"4. Organic & Bio-control Options:\n{data.get('organic_remedy', 'N/A')}\n\n"
        f"5. Chemical Control & Pesticides:\n{data.get('chemical_control', 'N/A')}\n\n"
        f"6. Climate Impact Analysis:\n{data.get('weather_impact_analysis', 'N/A')}"
    )




if __name__ == "__main__":
    print("=" * 70)
    print("AgroPulse AI — LangChain Plant Health Agent Self-Test")
    print("=" * 70)

    sample_disease = "Tomato___Late_blight"
    sample_location = "Nashik, Maharashtra, India"
    sample_weather = {
        "avgHumidity": "84.0",
        "avgTempMax": "28.5",
        "avgTempMin": "19.2",
        "avgWindSpeed": "12.0"
    }

    print(f"\n[Input] Disease : {sample_disease}")
    print(f"[Input] Location: {sample_location}")
    print(f"[Input] Weather : {sample_weather}\n")
    print("Executing LangChain Agent Workflow...\n")

    response_dict = generate_structured_advice(
        disease_name=sample_disease,
        location=sample_location,
        weather_data=sample_weather,
        language="English"
    )

    print("[Output Agent Response (JSON)]:\n")
    print(json.dumps(response_dict, indent=2, ensure_ascii=False))
