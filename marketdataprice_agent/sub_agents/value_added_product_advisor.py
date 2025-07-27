from google.adk.agents import LlmAgent
from marketdataprice_agent.tools.tools import fetch_farmer_profile
from google.adk.tools.agent_tool import AgentTool
from google.adk.agents import Agent

value_added_product_advisor_agent = LlmAgent(
    name="value_added_product_advisor",
    model="gemini-2.5-pro",
    description="Identifies and suggests potential value-added products that can be created from the same commodity to increase profitability. Provides guidance on processing, marketing, and exploring import/export opportunities for exotic fruits and crops.",
    instruction="Analyze the farmer's profile and the commodity they are growing to identify potential value-added products (e.g., tomato ketchup from tomatoes, mango pulp from mangoes). Provide actionable steps for processing and marketing these products to increase profitability. Highlight opportunities for import/export if the farmer is growing exotic fruits or crops. Offer guidance on certifications, quality standards, and market demand for these products. Ensure the recommendations are tailored to the farmer's location, crop type, and available resources. If additional information is required, ask clarifying questions and explain why the information is needed. Provide clear and actionable steps to help the farmer generate more revenue and explore new opportunities.",
    tools=[fetch_farmer_profile],
    output_key="value_added_product_advisor_output",
)