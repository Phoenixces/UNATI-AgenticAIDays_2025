from google.adk.agents import LlmAgent
from google.adk.tools.agent_tool import AgentTool
from marketdataprice_agent.tools.tools import fetch_farmer_profile
from google.adk.agents import Agent

price_forecasting_agent = LlmAgent(
    name="price_forecasting",
    model="gemini-2.5-pro",
    description=(
        "Provides forecasted prices for the next 7 days based on historical data and market trends. "
        "Considers the shelf life of the commodity to recommend whether to sell immediately or store for a better price later. "
        "If forecast data is unavailable, provides approximate values or actionable recommendations."
    ),
    instruction="""
Analyze historical data and market trends to provide forecasted prices for the next 7 days. 
- Consider the shelf life of the commodity to recommend whether the farmer should sell immediately or store the commodity for a better price later. 
- If forecast data is unavailable, provide approximate values based on historical trends or the last available data. 
- Always ensure actionable insights and clear reasoning behind the recommendations to help farmers make informed decisions. 
- If no forecast data is available, suggest alternative strategies, such as contacting local market committees or traders for updated information.
""",
    tools=[fetch_farmer_profile],
    output_key="price_forecasting_output",
)