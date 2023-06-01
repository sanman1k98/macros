# Calorie Calculator Documentation

## Introduction

The Calorie Calculator is a Python module that provides functions to calculate various calorie-related metrics such as Body Mass Index (BMI), Basal Metabolic Rate (BMR), Total Energy Expenditure (TEE), and calories needed for weight management. This module is part of the nutritional assessment algorithm used in the AI nutritionist mobile application known as MACROS.

## Formulas Used

### Body Mass Index (BMI)

The Body Mass Index (BMI) is a measure of body fat based on height and weight. It provides an estimate of whether a person has a healthy body weight for a given height. The BMI formula used in the Calorie Calculator is as follows:


$$
BMI = weight / (height / 100)^2
$$


where `weight` is the weight in kilograms and `height` is the height in centimeters.

### Basal Metabolic Rate (BMR)

The Basal Metabolic Rate (BMR) represents the number of calories your body needs to maintain basic bodily functions at rest. It is the minimum number of calories required to sustain life. The BMR calculation takes into account factors such as weight, height, age, and sex. The formulas used in the Calorie Calculator are as follows:

$$
BMR = 10 * weight + 6.25 * height - 5 * age + 5 (for males)
BMR = 10 * weight + 6.25 * height - 5 * age - 161 (for females)
$$


where `weight` is the weight in kilograms, `height` is the height in centimeters, `age` is the age in years, and `sex` is the gender (either "male" or "female").

### Total Energy Expenditure (TEE)

The Total Energy Expenditure (TEE) represents the total number of calories your body needs in a day, taking into account your BMR and activity level. The TEE calculation considers the calories burned through physical activity on top of the calories required for basic bodily functions. The formula used in the Calorie Calculator is as follows:

$$
TEE = BMR * activity_factor
$$


where `BMR` is the Basal Metabolic Rate and `activity_factor` is a multiplier based on the activity level. The activity factors used in the code are as follows:

- Sedentary: 1.2
- Lightly Active: 1.375
- Moderately Active: 1.55
- Very Active: 1.725
- Extra Active: 1.9

### Calories Needed for Weight Management

The calories needed for weight management are calculated based on the Total Energy Expenditure (TEE) and the desired weight loss rate. The calculation provides an estimate of the daily calorie intake required to achieve a specific weight loss goal. The formula used in the Calorie Calculator is as follows:

$$
Calories_needed = TEE * weight_loss_rate
$$


where `TEE` is the Total Energy Expenditure and `weight_loss_rate` is the desired weight loss rate in kilograms per week. The code includes specific multipliers for different weight loss rates to adjust the calories needed:

- Mild weight loss (0.25 kg/week): Multiply by 0.91
- Weight loss (0.5 kg/week): Multiply by 0.83
- Extreme weight loss (1 kg/week): Multiply by 0.65

### Macronutrient Distribution

The distribution of macronutrients (carbohydrates, proteins, and fats) plays a vital role in a balanced diet. The Calorie Calculator provides general guidelines for macronutrient distribution based on total daily calories:

- Carbohydrates: 45-65% of total daily calories
- Proteins: 10-35% of total daily calories
- Fats: 20-35% of total daily calories

These ranges may vary depending on individual needs, goals, and dietary preferences.

## Usage

To use the Calorie Calculator, you can call the provided functions with appropriate arguments. The example usage in the code calculates various calorie-related metrics based on the given weight, height, age, sex, and activity level.

Make sure to import the module containing the functions or copy the functions into your own Python script.

```python
weight = 105  # kg
height = 182  # cm
age = 21
sex = "male"
activity_level = "lightly active"

bmi = calculate_bmi(weight, height)
bmr = calculate_bmr(weight, height, age, sex)
tee = calculate_tee(bmr, activity_level)
maintain_weight_calories = calculate_calories(tee, 0)
mild_weight_loss_calories = calculate_calories(tee, 0.25)
weight_loss_calories = calculate_calories(tee, 0.5)
extreme_weight_loss_calories = calculate_calories(tee, 1)

print("BMI:", round(bmi, 2))
print("BMR:", round(bmr))
print("TEE:", round(tee))
print("Calories needed to maintain weight:", round(maintain_weight_calories))
print("Calories needed for mild weight loss (0.25 kg/week):", round(mild_weight_loss_calories))
print("Calories needed for weight loss (0.5 kg/week):", round(weight_loss_calories))
print("Calories needed for extreme weight loss (1 kg/week):", round(extreme_weight_loss_calories))
```
