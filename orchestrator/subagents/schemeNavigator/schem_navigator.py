import requests
from google.adk.agents import LlmAgent
from google.adk.tools.agent_tool import AgentTool

from .prompt import SCHEME_NAVIGATOR_PROMPT

from .tools.tools  import fetch_farmer_profile

# Sub-agents
from .sub_agents.scheme_explainer import scheme_explainer_agent
from .sub_agents.eligibility_checker import eligibility_checker_agent
from .sub_agents.application_guide import application_guide_agent

MODEL = "gemini-2.5-pro"

# --- 2. MAIN AGENT ASSEMBLY ---
gov_scheme_navigator = LlmAgent(
    name="gov_scheme_navigator",
    model=MODEL,
    description=(
        "Empowers farmers by providing a one-stop solution to discover, understand, and secure government schemes. "
        "The agent identifies relevant central and state schemes, explains their benefits, checks eligibility, and offers step-by-step guidance for applications. "
        "It leverages farmer profiles to provide personalized recommendations, optimize land-ceiling entitlements, and suggest demographic-specific benefits. "
        "The agent also assists in filling forms, provides government-approved supplier lists, and ensures farmers can access nearby offices for offline applications. "
        "By streamlining the application process through automated form filling, dynamic profiling, and actionable insights, the agent ensures farmers can maximize their benefits with ease and confidence."
    ),
    instruction=SCHEME_NAVIGATOR_PROMPT,
    output_key="gov_scheme_navigator_output",
    tools=[
        fetch_farmer_profile,
        AgentTool(agent=scheme_explainer_agent), # Tool 2: Scheme explainer
        AgentTool(agent=eligibility_checker_agent), # Tool 3: Eligibility checker
        AgentTool(agent=application_guide_agent),   # Tool 4: Application guide
    ],
)

root_agent = gov_scheme_navigator


# --- 3. MAIN HANDLER CLASS ---
class GovSchemeNavigator:
    def __init__(self):
        self.agent = gov_scheme_navigator

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
        self.agent.instruction = SCHEME_NAVIGATOR_PROMPT

        # profile = self.agent.tools[0].run({}) 
        # location = profile.get("location", {}).get("state")
        # taluk = profile.get("location", {}).get("taluk")
        # district = profile.get("location", {}).get("district")

        # [Step 2] Web Search (Latest schemes/updates)
        search_result = self.agent.tools[0].run({"query": query})

        # [Step 3] Scheme Explanation (contextualized with search)
        scheme_explanation = self.agent.tools[1].agent.run({
            "query": query,
            "search_result": search_result
        })

        # [Step 4] Eligibility Check
        eligibility_result = self.agent.tools[2].agent.run({
            "query": query,
            "search_result": search_result
        })

        # [Step 5] Step-by-Step Application Guidance (if eligible)
        if eligibility_result.get("eligible", False):
            application_guidance = self.agent.tools[3].agent.run({
                "query": query,
                "search_result": search_result,
                "eligibility_result": eligibility_result
            })

            # Example: Interactive form filling for online-eligible scheme
            if application_guidance.get("application_type") == "online":
                required_info = application_guidance.get("required_info", [])
                user_inputs = {}
                for info in required_info:
                    user_inputs[info] = input(f"Please provide {info}: ")

                form_link = application_guidance.get("form_link")
                if form_link:
                    print(f"Opening the application form: {form_link}")
                    for key, value in user_inputs.items():
                        print(f"Filling {key} with {value}")
        else:
            application_guidance = {"message": "You are not eligible for this scheme."}

        # [Final Response] Compose
        response = {
            # "profile": profile,
            "search_result": search_result,
            "explanation": scheme_explanation,
            "eligibility": eligibility_result,
            "application_guidance": application_guidance
        }
        return response


# --- 4. USAGE EXAMPLE ---
if __name__ == "__main__":
    navigator = GovSchemeNavigator()
    sample_query = "My daughter wants to try new technology in farming; is there any scheme?"
    result = navigator.handle_query(sample_query)
    print("\n=== AGENT RESPONSE ===")
    for k, v in result.items():
        print(f"\n--- {k.upper()} ---\n{v}")
