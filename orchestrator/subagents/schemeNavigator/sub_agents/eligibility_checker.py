from google.adk.agents import LlmAgent
from google.adk.tools.agent_tool import AgentTool

from ..tools.tools import fetch_farmer_profile

eligibility_checker_agent = LlmAgent(
    name="eligibility_checker",
    model="gemini-2.5-pro",
    description="Analyzes farmer demographics, landholding size, and crop details to determine eligibility for central and state government schemes. The agent also evaluates eligibility for schemes based on land-ceiling rules and demographic-specific criteria. It provides clear and actionable insights into the farmer's eligibility and the benefits they can avail.",
    instruction="Evaluate the farmer's eligibility for government schemes by analyzing their demographics (e.g., gender, caste, age), landholding size, and crop details. Provide detailed information on subsidy percentages, maximum benefits, application windows, and required documents. Include eligibility criteria for schemes that consider land-ceiling rules and demographic-specific benefits. If additional information is needed, ask relevant questions and explain why the information is required. Ensure the farmer understands their eligibility and the benefits they can avail, and guide them on the next steps to apply. Display exact subsidy percentages, maximum amounts, and application windows in a clear and concise manner.",
    tools=[fetch_farmer_profile],
    output_key="eligibility_checker_output",
)