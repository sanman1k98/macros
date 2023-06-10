// TODO: move this file to a more appropriate location, e.g., src/lib

type FoodItem = {
  nf_calories: number,
  food_name: string,
}

/**
 * Creates a string of food items and their calorie counts
 */
function createFoodItemListString(items: FoodItem[]) {
  let ret = "";
  items.map(item => {
    ret = ret.concat(`${item.food_name} with ${item.nf_calories} calories`, "\n")
  });
  return ret;
}

/**
 * Creates a prompt for the user to select 3-5 food items from a restaurant menu
 * @param restaurant The restaurant name
 * @param items The food items to select from
 * @returns A string that is the prompt
 */
export default function createPrompt(restaurant: string, items: FoodItem[]) {
  let prompt = `
    You are now acting as an AI nutritionist to which I will parse in some
    variables that are important to assessing menu items that are personalized
    for an individuals health. Using this information, look at the following
    menu items from ${restaurant} and select 3-5 food recommendations that are
    best for a healthy 21 year old. Here are the menu items and their calorie
    counts:
  `
  prompt = prompt.replace(/\s+/g, ' ').trim();

  return prompt.concat(`\n\n${createFoodItemListString(items)}`)
}
