import requests
from geopy.geocoders import Nominatim
from PIL import Image
import google.generativeai as genai
import numpy as np
from google.adk.agents import LlmAgent
from google.adk.tools.agent_tool import AgentTool
from IPython.display import Image as IPyImage, display
# from google.generativeai import get_embedding
import vertexai
from vertexai.vision_models import Image, MultiModalEmbeddingModel
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
from PIL import Image as PILImage
 
# API KEYS
 
app = FastAPI(title="Crop Doctor")
 
genai.configure(api_key="AIzaSyAssZHJoTyoL0UP8MyBmfgK2RjpNl_tYxY")
OPENWEATHER_API_KEY = "20f708940a71e4c7f0194bb737e36529"
 
PROJECT_ID = "gen-lang-client-0898341694"
REGION = "us-central1"
 
vertexai.init(project=PROJECT_ID, location=REGION)
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
 
 
# Reference documents (summaries & links)
REFERENCE_LINKS = [
    "https://en.wikipedia.org/wiki/Banana_bunchy_top_virus",
    "https://www.agronomyjournals.com/archives/2024/vol7issue2/PartG/7-2-96-379.pdf",
    "https://agritech.tnau.ac.in/horticulture/pdf/tech_bulletin/national/IPM-Banana-Revised-Sept2011.pdf"
        "https://epubs.icar.org.in/index.php/IJAgS/article/view/134893",
        "https://nhb.gov.in/pdf/fruits/banana/ban002.pdf",
        "https://www.newindianexpress.com/xplore/2025/May/16/rising-temperatures-put-bananas-under-high-risk",
        "https://katyayanikrishidirect.com/blogs/news/complete-guide-for-banana-pests-disease-management"
]
 
REFERENCE_SUMMARIES = [
    "Banana Bunchy Top Virus causes upward leaf growth, stunted plants, transmitted by aphids.",
    "Agronomy paper discusses nutrient deficiencies and common fungal diseases in tropical crops like banana.",
    "TNAU guide lists pests like banana stem weevil, aphids, and IPM strategies including neem oil.",
    "ICAR research on temperature stress in banana yield decline, root rot symptoms.",
    "National horticulture board factsheet on banana cultivation, diseases, post-harvest handling.",
    "News: High temperatures in 2025 increasing banana susceptibility to diseases.",
    "Blog: Field guide for banana disease and pest management with photos, early signs."
]
 
# -------------------- TOOLS -------------------- #
 
 
class WeatherTool:
    name = "weather_tool"
    description = "Provides current weather information for a given location."
 
    def __call__(self, input_data):
        lat, lon = input_data["lat"], input_data["lon"]
        geolocator = Nominatim(user_agent="crop-doctor")
        location = geolocator.reverse((lat, lon), language='en')
        human_location = location.address if location else "an unknown location"
 
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        response = requests.get(url).json()
 
        return {
            "location": human_location,
            "temperature": response['main']['temp'],
            "humidity": response['main']['humidity'],
            "condition": response['weather'][0]['description'],
            "wind_speed": response['wind']['speed']
        }
 
 
class DiagnosisTool:
    name = "diagnosis_tool"
    description = "Analyzes crop image and weather to provide a diagnosis."
 
    def __call__(self, input_data):
        weather = input_data["weather"]
        image_path = input_data["image_path"]
        # or "gemini-1.5-flash" or "gemini-2.5-pro"
        model = genai.GenerativeModel("gemini-2.5-pro")
 
        with open(image_path, "rb") as f:
            image_bytes = f.read()
 
        prompt = f"""
You are a crop doctor working with rural farmers in Karnataka.
 
Location: {weather['location']}
🌡️ Temperature: {weather['temperature']}°C
💧 Humidity: {weather['humidity']}%
☁️ Condition: {weather['condition']}
🌬️ Wind Speed: {weather['wind_speed']} m/s
 
A farmer has shared a photo of their banana plant. Analyze it and return:
- 📷 What is wrong: [Explain in Kannada]
- 🌿 What to do: [Give 2 simple solutions in Kannada, based on weather and image]
 
Avoid technical terms and emoji. Be helpful and friendly.
"""
 
        response = model.generate_content([
            prompt,
            {
                "inline_data": {
                    "mime_type": "image/jpeg",
                    "data": image_bytes
                }
            }
        ])
 
        return response.text.strip()
 
 
def get_image_text_embedding(image_path: str, context_text: str, dimension: int = 128):
    model = MultiModalEmbeddingModel.from_pretrained("multimodalembedding@001")
    image = Image.load_from_file(image_path)
 
    embeddings = model.get_embeddings(
        image=image,
        contextual_text=context_text,
        dimension=dimension,
    )
 
    return {
        "image_embedding": embeddings.image_embedding,
        "text_embedding": embeddings.text_embedding,
    }
 
 
class ReferenceTool:
    name = "reference_tool"
    description = "Suggests most relevant documents based on diagnosis text."
 
    def __call__(self, input_data):
        diagnosis_text = input_data["diagnosis"]
 
        # Embed the diagnosis
        embedding_result = get_image_text_embedding(
            image_path="banana.jpeg",  # or pass as input_data["image_path"] for generality
            context_text=diagnosis_text,
            dimension=128
        )
        query_vec = np.array(embedding_result["text_embedding"])
 
        # Embed each reference summary (can be cached for production)
        scores = []
        for i, summary in enumerate(REFERENCE_SUMMARIES):
            summary_embedding = get_image_text_embedding(
                image_path="banana.jpeg",  # Dummy image to comply with API (can optimize later)
                context_text=summary,
                dimension=128
            )["text_embedding"]
 
            doc_vec = np.array(summary_embedding)
 
            similarity = np.dot(query_vec, doc_vec) / (
                np.linalg.norm(query_vec) * np.linalg.norm(doc_vec)
            )
            scores.append((similarity, REFERENCE_LINKS[i]))
 
        sorted_refs = sorted(scores, key=lambda x: x[0], reverse=True)
        return [url for _, url in sorted_refs[:3]]
 
 
# -------------------- AGENT SETUP -------------------- #
crop_doctor_agent = LlmAgent(
    name="banana_crop_doctor",
    model="gemini-1.5-pro",
    description="Diagnoses banana plant issues using weather, images, and research.",
    instruction="Use the image, weather, and reference tools to help the farmer with a disease diagnosis and solution.",
    output_key="crop_doctor_output",
    tools=[
        AgentTool(agent=WeatherTool()),
        AgentTool(agent=DiagnosisTool()),
        AgentTool(agent=ReferenceTool())
    ]
)
 
# -------------------- MAIN FUNCTION -------------------- #
 
 
def run_crop_doctor_adk(image_path, lat, lon):
    print("\n🌿 Starting banana crop doctor agent...")
 
    weather = crop_doctor_agent.tools[0].agent({"lat": lat, "lon": lon})
    diagnosis = crop_doctor_agent.tools[1].agent(
        {"weather": weather, "image_path": image_path})
    # references = crop_doctor_agent.tools[2].agent({"diagnosis": diagnosis})
 
    print("\n📍 Location:", weather['location'])
    print("🌦️ Weather:", f"{weather['temperature']}°C, {weather['condition']}")
    print("\n📷 Diagnosis:\n", diagnosis)
    print("\n📚 Suggested References:")
    # for ref in references:
    #     print("-", ref)
 
    display(IPyImage(image_path))
 
# -------------------- TEST -------------------- #
 
 
if __name__ == "__main__":
    run_crop_doctor_adk("banana.jpeg", lat=15.3173, lon=75.7139)