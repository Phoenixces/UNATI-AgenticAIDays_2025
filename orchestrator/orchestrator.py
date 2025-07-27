import asyncio
from google.adk.agents import LlmAgent
from google.adk.tools.agent_tool import AgentTool
from .prompt import FARMER_COORDINATOR_PROMPT

# Import the gov_scheme_navigator and crop_doctor_agent from sub_agents folder
from .subagents.schemeNavigator.schem_navigator import gov_scheme_navigator
from .subagents.cropDoctor.cropDoctor import crop_doctor_agent

# crop_health_tool = AgentTool(agent=CropHealthAgent())
# scheme_info_tool = AgentTool(agent=GovSchemeNavigator())


# class FarmerOrchestratorAgent(LlmAgent):
#     def __init__(self):
#         super().__init__(
#             name="FarmerOrchestrator",
#             model="gemini-2.5-flash",  # choose your LLM model version
#             instruction="""
# You are the orchestrator agent handling farmer queries.
# - If the query relates to crop health (diseases, pests, symptoms, treatment), route it to the crop doctor agent.
# - If the query concerns government schemes, subsidies, insurance, or applications, route it to the scheme navigator agent.
# - If the intent is unclear, ask the user for clarification.
# """,
#             tools=[
#                 AgentTool(agent=crop_doctor_agent),
#                 AgentTool(agent=gov_scheme_navigator)
#             ]
#         )
#         # for convenience:
#         self.crop_tool = self.tools[0]
#         self.scheme_tool = self.tools[1]

#     async def run(self, user_input, *args, **kwargs):
#         input_lower = user_input.lower()

#         crop_keywords = [
#             "crop", "plant", "disease", "pest", "leaf", "yellow", "spots",
#             "fertilizer", "banana", "wilt", "soil"
#         ]
#         scheme_keywords = [
#             "scheme", "insurance", "pm-kisan", "application", "credit",
#             "government", "subsidy", "loan"
#         ]

#         # Simple keyword-based routing
#         if any(word in input_lower for word in crop_keywords):
#             return await self.crop_tool.run(user_input)
#         elif any(word in input_lower for word in scheme_keywords):
#             return await self.scheme_tool.run(user_input)
#         else:
#             # Fallback to OR ask for clarification via LLM orchestrator
#             return await super().run(user_input)


farmer_coordinator = LlmAgent(
    name="farmer_coordinator",
    model="gemini-2.5-pro",
    description=("You are the orchestrator agent handling farmer queries."
            " - If the query relates to crop health (diseases, pests, symptoms, treatment), route it to the crop doctor agent."
            " - If the query concerns government schemes, subsidies, insurance, or applications, route it to the scheme navigator agent."
            " - If the intent is unclear, ask the user for clarification."
    ),
    instruction=FARMER_COORDINATOR_PROMPT,
    output_key="farmer_coordinator_output",
    tools=[
        AgentTool(agent=gov_scheme_navigator),
        AgentTool(agent=crop_doctor_agent),
        
    ],
)

root_agent = farmer_coordinator

