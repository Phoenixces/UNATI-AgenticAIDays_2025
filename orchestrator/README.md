orchestrator

**Create & Activate Virtual Environment (Recommended):**

Create env : python -m venv .venv

Activate (each new terminal) : macOS/Linux: source .venv/bin/activate

**Install ADK**
pip install google-adk

**Run agent**
adk run orchestrator


**Agent Scenarios**
1) Crop Doctor
Farmer would upload the image of diesease infested crop and ask questions. The agent orchestrator delegates to respective agent based on query. The agent responds with relevant diagnosis & remedies.
<img width="1224" height="373" alt="image" src="https://github.com/user-attachments/assets/f6fe37f6-1f56-475c-9ab5-86d77ffbd89c" />


3) Scheme Navigator
Based on user query, agent would respond with differnt personalised and applicable scheme information and steps to apply and futher information in farmer friendly way after having a conversation. 
<img width="1105" height="557" alt="image" src="https://github.com/user-attachments/assets/713a77fe-0d2c-4b83-a3c0-c3081d5f3e0a" />
