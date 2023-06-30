import {
  Configuration,
  OpenAIApi,
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

  const prompt = `Can you be an expert nutrinionist and recommend me a healthy meal from ${name} with the ID "${id}"?`;
  const messages: ChatCompletionRequestMessage[] = [{
    role: "user",
    content: prompt,
  }];

  const functions = [
    {
      name: "getRestaurantItems",
      description: "Get the menu items from a restaurant",
      parameters: {
        type: "string",
        description: "The id of the restaurant which is a 24-character long alphanumeric string e.g., '513fbc1283aa2dc80c000025'",
      },
    },
  ];

  const res1 = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    messages: messages,
    functions: functions,
  });

  const msg1 = res1.data.choices[0].message;

  if (msg1 && msg1.function_call && msg1.function_call.name === "getRestaurantItems" ) {
    const args = msg1.function_call.arguments!;
    const functionResponse = await nix.getRestaurantItems(JSON.parse(args));

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

    return res2;
  }
}
