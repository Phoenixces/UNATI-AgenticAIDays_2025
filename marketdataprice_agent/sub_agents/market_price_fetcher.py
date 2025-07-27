from google.adk.agents import LlmAgent
from google.adk.tools.agent_tool import AgentTool
from google.adk.agents import Agent
from marketdataprice_agent.tools.tools import fetch_farmer_profile

market_price_fetcher_agent = LlmAgent(
    name="market_price_fetcher",
    model="gemini-2.5-pro",
    description="Assists farmers in finding the market price, minimum price, maximum price, and modal price of commodities in their area. If you don't get data please provide relevant last updated information you have and do not ask for user preferd date, just give last data you gave. Fetches market price data for nearby locations to help farmers compare and identify better selling opportunities.",
    instruction="Fetch and display the market price, minimum price, maximum price, and modal price of the commodity in the farmer's area. If you don't get data please provide relevant last updated information you have and do not ask for user preferd date, just give last data you gave. Provide the last updated data. Additionally Fetch and display market price data for nearby locations to help farmers compare and identify better selling opportunities. Ensure responses are clear, concise, and actionable.",
    tools=[fetch_farmer_profile],
    output_key="market_price_fetcher_output",
)