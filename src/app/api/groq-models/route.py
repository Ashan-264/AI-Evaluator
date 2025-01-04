import requests
import os

api_key ="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"
url = "https://api.groq.com/openai/v1/models"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)
data = response.json()  # Parse JSON from response

    # Extract the models
models = [{"id": model["id"], "owned_by": model["owned_by"]} for model in data["data"]]

print(models)