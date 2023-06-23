import {  } from "next/cache";
const NUTRITIONIX_URL = "https://trackapi.nutritionix.com";

type Restaurant = { name: string, id: string };

export default class NutritionixClient {

  protected url = NUTRITIONIX_URL;
  protected fetch: typeof fetch;
  protected headers: {
    [key: string]: string,
    "x-app-id": string,
    "x-app-key": string,
  }

  public restaurants: Restaurant[];

  private constructor( protected nutritionixAppId: string, protected nutritionixAppKey: string) {
    if (!nutritionixAppId || !nutritionixAppKey) throw new Error("missing parameter(s)");

    this.headers = {
      "x-app-id": this.nutritionixAppId,
      "x-app-key": this.nutritionixAppKey,
    };

    this.fetch = async (input, init?) => {
      return fetch(input, { ...init, ...this.headers });
    }
  }

  static async create(
    nutritionixAppId: string,
    nutritionixAppKey: string
  ): Promise<NutritionixClient> {
    const client = new NutritionixClient(nutritionixAppId, nutritionixAppKey);
    const res = await fetch("https://d1gvlspmcma3iu.cloudfront.net/restaurants-3d-party.json.gz");
    client.restaurants = await res.json() as Restaurant[];
    return client;
  }

  async refreshRestaurants() {
    const res = await fetch("https://d1gvlspmcma3iu.cloudfront.net/restaurants-3d-party.json.gz", {
      next: { revalidate: 84_600 }
    });
  }

  async getItems(id: string) {
    this.restaurants ??= await this.refreshRestaurants();
    const restaurant = this.restaurants.find(r => r.id === id);
    if (!restaurant) throw new Error("invalid restaurant id");
  }
}
