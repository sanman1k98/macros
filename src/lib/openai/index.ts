import {
  OpenAIApi,
  Configuration,
  type ChatCompletionRequestMessage,
} from "openai";
import { env } from "@/env.mjs";

import * as nix from "@/lib/nutritionix";

const config = new Configuration({
  organization: env.OPENAI_ORGANIZATION_ID,
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function runRestaurantRecommendation(id: string) {
  // Initialize the library to get populate the Map containing restaurant ids and names
  await nix.init();

  const name = nix.restaurants.get(id);

  const prompt = `
    Can you be an expert nutrinionist and rate the food items on a scale from 1-10 from restaurant ${name} with the ID "${id}"? Give me your reasoning for your ratings as well as any nutritional info you may have on each item.
  `;

  const messages: ChatCompletionRequestMessage[] = [{
    role: "user",
    content: prompt,
  }];

  const functions = [
    {
      name: "getRestaurantItems",
      description: "Get the menu items from a restaurant",
      parameters: {
        // NOTE: The JSON schema passed in must be an object at the root
        type: "object",
        properties: {
          args: {
            type: "string",
            description: "The id of the restaurant which is a 24-character long alphanumeric string e.g., '513fbc1283aa2dc80c000025'",
          },
        },
      },
    },
  ];

  const res1 = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    messages: messages,
    functions: functions,
  });

  const msg1 = res1.data.choices[0].message;

  if (msg1 && msg1.function_call && msg1.function_call.name === "getRestaurantItems") {
    const args = JSON.parse(msg1.function_call.arguments!).args;
    const functionResponse = await nix.getRestaurantItems(args);

    messages.push(msg1);

    messages.push({
      role: "function",
      name: "getRestaurantItems",
      content: JSON.stringify(functionResponse),
    });

    const res2 = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages: messages,
    });

    // return res2;

    messages.push({
      role: "system",
      content: ""
    });

    const res3 = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages: messages,
      functions: [ 
        {
          name: "showFoodItems",
          description: "Show the user each food item with their respective nutritional details and ratings",
          parameters: {
            type: "object",
            properties: {
              args: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    "foodItem": {
                      "type": "string",
                      "description": "Name of the food item"
                    },
                    "details": {
                      "type": "object",
                      "properties": {
                        "calories": {
                          "type": "integer",
                          "description": "Number of calories"
                        },
                        "rating": {
                          "type": "string",
                          "enum": ["very good", "good", "okay", "bad", "very bad"],
                          "description": "Nutritional rating for this food",
                        },
                      },
                      "required": ["calories", "rating"],
                    },
                  },
                },
              },
            },
          },
        },
      ]
    });

    return res3;
  }
}
