import requests
from google.adk.agents import LlmAgent
from google.adk.tools.agent_tool import AgentTool
from google.adk.tools.google_search_tool import GoogleSearchTool
from google.adk.agents import Agent

from .prompt import MARKET_PRICE_AGENT_PROMPT

# Sub-agents
from .sub_agents.market_price_fetcher import market_price_fetcher_agent
from .sub_agents.price_forecasting import price_forecasting_agent
from .sub_agents.value_added_product_advisor import value_added_product_advisor_agent
from marketdataprice_agent.tools.tools import fetch_farmer_profile
# from multi_tool_agent.tools.tools import fetch_farmer_profile_tool 

MODEL = "gemini-2.5-pro"

# --- 1. SEARCH TOOL DEFINITION ---
google_search_tool = GoogleSearchTool()

# --- 2. MAIN AGENT ASSEMBLY ---
market_data_navigator = LlmAgent(
    name="market_data_navigator",
    model=MODEL,
    description=(
        "Empowers farmers by fetching market prices, forecasting trends, and providing personalized recommendations. "
        "Considers shelf life to suggest the best time to sell or store crops and identifies value-added opportunities to maximize profits."
    ),
    instruction=MARKET_PRICE_AGENT_PROMPT,
    output_key="market_data_navigator_output",
    tools=[
        fetch_farmer_profile,
        AgentTool(agent=market_price_fetcher_agent),  # Tool 0: Fetch market prices
        AgentTool(agent=price_forecasting_agent),    # Tool 1: Forecast prices
        AgentTool(agent=value_added_product_advisor_agent),  # Tool 2: Value-added product advisor
          # Tool 3: Search for additional resources
    ],
)

root_agent = market_data_navigator


# --- 3. MAIN HANDLER CLASS ---
class MarketDataNavigator:
    def __init__(self):
        self.agent = market_data_navigator

    def handle_query(self, query):
        """
        Process the farmer's query to find applicable schemes, explain them, check eligibility, and guide application.
        :param query: The query from the farmer.
        :return: A comprehensive response addressing the query.
        """
        # [Step 1] Fetch farmer profile dynamically
        # profile = fetch_farmer_profile.function()
        # location = profile.get("location", {}).get("state")
        # taluk = profile.get("location", {}).get("taluk")
        # district = profile.get("location", {}).get("district")

        # Ensures agent prompt uses latest context
        self.agent.instruction = MARKET_PRICE_AGENT_PROMPT

        profile = self.agent.tools[0].run({}) 
        location = profile.get("location", {}).get("state")
        taluk = profile.get("location", {}).get("taluk")
        district = profile.get("location", {}).get("district")

        # [Step 2] Fetch current market prices
        market_price_result = self.agent.tools[1].agent.run({
            "query": query
        })

        # [Step 3] Forecast prices for the next 7 days
        price_forecast_result = self.agent.tools[2].agent.run({
            "query": query
        })

        # [Step 4] Provide value-added product recommendations
        value_added_result = self.agent.tools[3].agent.run({
            "query": query
        })

        # [Final Response] Compose
        response = {
            "market_price": market_price_result,
            "price_forecast": price_forecast_result,
            "value_added_recommendations": value_added_result,
        }
        return response

# --- 4. USAGE EXAMPLE ---
if __name__ == "__main__":
    navigator = MarketDataNavigator()
    sample_query = "What are the current market prices and future trends for mango?"
    result = navigator.handle_query(sample_query)
    print("\n=== AGENT RESPONSE ===")
    for k, v in result.items():
        print(f"\n--- {k.upper()} ---\n{v}")
