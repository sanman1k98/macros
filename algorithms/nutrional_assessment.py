import math
import random
import matplotlib.pyplot as plt
import seaborn as sns

def calculate_bmi(weight, height):
    # Convert height from cm to meters
    height_m = height / 100

    # Calculate BMI
    bmi = weight / (height_m ** 2)
    return bmi


def calculate_bmr(weight, height, age, sex):
    # Calculate BMR based on sex
    if sex == "male":
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    return bmr


def calculate_tee(bmr, activity_level):
    # Adjust BMR based on activity level
    activity_factors = {
        "sedentary": 1.2,
        "lightly active": 1.375,
        "moderately active": 1.55,
        "very active": 1.725,
        "extra active": 1.9
    }
    tee = bmr * activity_factors.get(activity_level, 1.2)
    return tee


def calculate_calories(tee, weight_loss_rate, weight_gain_rate=0):
    # Calculate calories needed for weight loss or gain
    calories_per_kg = 7700
    calories_needed = tee

    if weight_loss_rate == 0.25:
        calories_needed *= 0.91
    elif weight_loss_rate == 0.5:
        calories_needed *= 0.83
    elif weight_loss_rate == 1:
        calories_needed *= 0.65

    if weight_gain_rate == 1.1:
        calories_needed *= 1.1
    elif weight_gain_rate == 1.2:
        calories_needed *= 1.2
    elif weight_gain_rate == 1.4:
        calories_needed *= 1.4

    return calories_needed


def get_user_details():
    weight = float(input("Enter your weight in kg: "))
    height = float(input("Enter your height in cm: "))
    age = int(input("Enter your age: "))
    sex = input("Enter your sex (male/female): ")
    activity_level = input("Enter your activity level (sedentary, lightly active, moderately active, very active, "
                           "extra active): ")
    weight_goal = input("Do you want to lose weight or gain weight? (loss/gain): ")
    intensity = input("Choose the degree of intensity (low, moderate, high): ")
    return weight, height, age, sex, activity_level, weight_goal, intensity


def calculate_weight_loss_rate(intensity):
    if intensity == "low":
        return 0.25
    elif intensity == "moderate":
        return 0.5
    elif intensity == "high":
        return 1
    else:
        raise ValueError("Invalid weight loss intensity. Please choose from 'low', 'moderate', or 'high'.")


def calculate_weight_gain_rate(intensity):
    if intensity == "low":
        return 1.1
    elif intensity == "moderate":
        return 1.2
    elif intensity == "high":
        return 1.4
    else:
        raise ValueError("Invalid weight gain intensity. Please choose from 'low', 'moderate', or 'high'.")


weight, height, age, sex, activity_level, weight_goal, intensity = get_user_details()

bmi = calculate_bmi(weight, height)
bmr = calculate_bmr(weight, height, age, sex)
tee = calculate_tee(bmr, activity_level)

if weight_goal == "loss":
    weight_loss_rate = calculate_weight_loss_rate(intensity)
    calories_needed = calculate_calories(tee, weight_loss_rate)
    print("Calories needed for weight loss:", round(calories_needed))
elif weight_goal == "gain":
    weight_gain_rate = calculate_weight_gain_rate(intensity)
    calories_needed = calculate_calories(tee, 0, weight_gain_rate)
    print("Calories needed for weight gain:", round(calories_needed))
else:
    raise ValueError("Invalid weight goal. Please choose either 'loss' or 'gain'.")

print("BMI:", round(bmi, 2))
print("BMR:", round(bmr))
print("TEE:", round(tee))

# Food Example Implementation for MVP V0.1:

import random

calories_dict = {
    "Apple": 59,
    "Banana": 151,
    "Grapes": 100,
    "Orange": 53,
    "Pear": 82,
    "Peach": 67,
    "Pineapple": 82,
    "Strawberry": 53,
    "Watermelon": 50,
    "Asparagus": 27,
    "Broccoli": 45,
    "Carrots": 50,
    "Cucumber": 17,
    "Eggplant": 35,
    "Lettuce": 5,
    "Tomato": 22,
    "Beef, regular, cooked": 142,
    "Chicken, cooked": 136,
    "Tofu": 86,
    "Egg": 78,
    "Fish, Catfish, cooked": 136,
    "Pork, cooked": 137,
    "Shrimp, cooked": 56,
    "Bread, white": 75,
    "Butter": 102,
    "Caesar salad": 481,
    "Cheeseburger": 285,
    "Hamburger": 250,
    "Dark Chocolate": 155,
    "Corn": 132,
    "Pizza": 285,
    "Potato": 130,
    "Rice": 206,
    "Sandwich": 200,
    "Beer": 154,
    "Coca-Cola Classic": 150,
    "Diet Coke": 0,
    "Milk (1%)": 102,
    "Milk (2%)": 122,
    "Milk (Whole)": 146,
    "Orange Juice": 111,
    "Apple cider": 117,
    "Yogurt (low-fat)": 154,
    "Yogurt (non-fat)": 110
}


# Select a random food item
food_item = random.choice(list(calories_dict.keys()))
calories = calories_dict[food_item]

# Print the random food item and its calories
print(f"Random Food Item: {food_item}")
print(f"Calories: {calories}")

# Calculate the calories left after eating the random food item
calories_left = calories_needed - calories
print(f"Calories Left: {round(calories_left)}")
