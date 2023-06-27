import json
import random
import openai
from flask import Flask, jsonify, request

app = Flask(__name__)

openai.api_key = "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"

@app.route('/recommendations', methods=['GET', 'POST'])
def get_recommendations():
    if request.method == 'GET':
        return "This endpoint only accepts POST requests.", 405

    function_description = [
        {
            "name": "extract_menu_items_calories_rating",
            "description": "Extract and provide a rating for each menu item from a restaurant while also showing their calories",
            "parameters": {
                "type": "object",
                "properties": {
                    "menuItems": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "foodItem": {
                                    "type": "string",
                                    "description": "Make sure any food item you see is placed here."
                                },
                                "details": {
                                    "type": "object",
                                    "properties": {
                                        "calories": {
                                            "type": "integer",
                                            "description": "Provide me with an integer value for the number of calories for the menu item"
                                        },
                                        "rating": {
                                            "type": "string",
                                            "enum": ["very good", "good", "okay", "bad", "very bad"],
                                            "description": "Be a nutritionist and provide me with a rating from 'very good', 'good', 'okay', 'bad', or 'very bad'"
                                        }
                                    },
                                    "required": ["calories", "rating"]
                                }
                            },
                            "required": ["foodItem", "details"]
                        }
                    }
                },
                "required": ["menuItems"]
            }
        }
    ]

    text = "Chick-fil-A Chicken Sandwich: 440-500 calories, Spicy Chicken Sandwich: 450-500 calories, Grilled Chicken Sandwich: 320-370 calories, Chicken Deluxe Sandwich: 500-550 calories, Chick-n-Strips (3-count): 330-390 calories, Chick-fil-A Nuggets (8-count): 260-280 calories, Grilled Nuggets (8-count): 140-150 calories, Cobb Salad with Grilled Chicken: 340-500 calories, Market Salad with Grilled Chicken: 230-330 calories, Side Salad: 160-180 calories, Waffle Potato Fries (medium): 360-400 calories, Chick-fil-A Sauce (1 pack): 140-150 calories, Polynesian Sauce (1 pack): 110-120 calories, Chick-fil-A Milkshake (Vanilla, small): 500-590 calories, Icedream Cone (small): 170-190 calories."

    prompt = f"Please be an expert and extract key information from the following menu list from Chick-fil-A: {text}"
    messages = [{"role": "user", "content": prompt}]

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-0613",
        messages=messages,
        functions=function_description,
        function_call="auto"
    )

    parsed_menu_items = []

    try:
        output = response['choices'][0]['message']['function_call']['arguments']
        parsed_output = json.loads(output)

        menu_items = parsed_output['menuItems']

        num_items = min(5, len(menu_items))
        selected_items = random.sample(menu_items, num_items)

        for i, item in enumerate(selected_items):
            menu_item = item['foodItem']
            calories = item['details']['calories']
            rating = item['details']['rating']

            result = {
                'item_number': i + 1,
                'menu_item': menu_item,
                'calories': calories,
                'rating': rating
            }

            parsed_menu_items.append(result)
    except KeyError:
        return "Failed to extract menu items from the response.", 500

    return jsonify(parsed_menu_items)

if __name__ == '__main__':
    app.run()
