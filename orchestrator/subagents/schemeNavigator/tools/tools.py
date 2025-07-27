from google.adk.tools.agent_tool import AgentTool

def fetch_farmer_profile():
    """
    Fetch the farmer's profile information from an API.

    Returns:
        dict: A static JSON response containing farmer's profile information.
    """
    # Simulate an API call to fetch farmer profile information
    response = {
        "personal_details": {
            "name": "Ramesh Kumar",
            "age": 45,
            "gender": "Male"
        },
        "location": {
            "state": "Karnataka",
            "district": "Shivamogga",
            "taluk": "Sagara",
            "village": "Hosanagara"
        },
        "crop_info": {
            "primary_crop": "Paddy",
            "secondary_crop": "Arecanut"
        },
        "land_info": {
            "total_area": "5 acres",
            "irrigated_area": "3 acres",
            "soil_quality": "Fertile"
        },
        "family_members": {
            "total_members": 5,
            "adults": 3,
            "children": 2,
            "members_details": [
                {
                    "name": "Ramesh Kumar",
                    "age": 45,
                    "gender": "Male",
                    "occupation": "Farmer"
                },
                {
                    "name": "Sita Kumar",
                    "age": 40,
                    "gender": "Female",
                    "occupation": "Homemaker"
                },
                {
                    "name": "Rahul Kumar",
                    "age": 20,
                    "gender": "Male",
                    "occupation": "Student"
                },
                {
                    "name": "Anjali Kumar",
                    "age": 20,
                    "gender": "Female",
                    "occupation": "Farming Field Worker"
                },
                {
                    "name": "Mohan Kumar",
                    "age": 70,
                    "gender": "Male",
                    "occupation": "Retired"
                }
            ]
        }
    }
    return response

# # # Wrap it as an AgentTool for agent usage
# fetch_farmer_profile_tool = AgentTool(
#     function=fetch_farmer_profile,
#     description="Fetches the farmer profile for personalized recommendations."
# )

if __name__ == "__main__":
    # Execute the function and print the response when the script is run directly
    response = fetch_farmer_profile()
    print(response)