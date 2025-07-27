from google.adk.agents import LlmAgent
from google.adk.tools.agent_tool import AgentTool

from ..tools.tools import fetch_farmer_profile

scheme_explainer_agent = LlmAgent(
    name="scheme_explainer",
    model="gemini-2.5-pro",
    description="Explains relevant government schemes and benefits to farmers based on their profile, including crop(s), location, landholding size, and socioeconomic category. The agent provides clear and actionable insights into how these schemes can benefit the farmer and their family members. It also explains how land-ceiling rules and demographic-specific schemes can maximize benefits for the farmer and their family members.",
    instruction="Provide detailed explanations of relevant government schemes and benefits tailored to the farmer's profile. Include central schemes (e.g., PM-KISAN, PMFBY, KCC) and Karnataka state schemes (e.g., Krishi Bhagya, Pashu Bhagya). Explain the benefits of each scheme, the eligibility criteria, and the application process. Highlight how land-ceiling rules can be leveraged to divide landholdings among family members for maximum benefits. Also, include demographic-specific schemes based on gender, caste, and age. Use the farmer's profile information to make the explanations contextually relevant and personalized. If the farmer needs more information, ask clarifying questions and provide actionable guidance. Ensure the farmer understands the steps to apply and how these schemes can improve their livelihood.",
    tools=[fetch_farmer_profile],
    output_key="scheme_explainer_output",
)