from google.adk.tools.agent_tool import AgentTool
from google.adk.tools.google_search_tool import GoogleSearchTool

google_search_tool_instance = GoogleSearchTool()

google_search_tool = AgentTool(
    agent=google_search_tool_instance
)
