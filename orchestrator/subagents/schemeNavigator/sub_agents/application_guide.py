from google.adk.agents import LlmAgent
from google.adk.tools.agent_tool import AgentTool

from ..tools.tools import fetch_farmer_profile

application_guide_agent = LlmAgent(
    name="application_guide",
    model="gemini-2.5-pro",
    description="Provides comprehensive guidance to farmers on how to apply for government schemes, including step-by-step instructions, required documents, and reasons for collecting specific information. The agent also assists in filling forms and directs farmers to nearby offices for offline applications when necessary. It includes guidance for schemes involving land-ceiling optimization and demographic-specific benefits.",
    instruction="Assist farmers in applying for government schemes by providing clear, step-by-step guidance. Explain the reasons behind collecting specific documents and information. Offer pre-filled e-forms for DBT portals (e.g., PM-KISAN, PMFBY, PMKSY) and state portals. Include guidance for applying to schemes that involve land-ceiling optimization or demographic-specific benefits. If the user accepts, assist in filling the form or guide them to nearby offices with addresses and contact information. Provide hyperlinks for application steps and ensure the farmer understands the process. If the farmer needs more assistance, ask leading questions to clarify their needs and provide actionable solutions.",
    tools=[fetch_farmer_profile],
    output_key="application_guide_output",
)