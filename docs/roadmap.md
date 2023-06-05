# API Design

## Primary Feature: Recommendations
Able to make food recommendations by pulling data from Nutrinix and running it through OpenAI
- To be more specific, the user chooses a restaurant they want to eat from and specifies if they are looking for an entree, dessert, etc. From here, the type of food they choose (ex: entree) will be used to search for food items that align with entrees and meet the nutrional goals of the user. OpenAI (for now) is simply acting as a psuedo-nutrionist and will rate whether the food items are good, bad, or okay for the user.

- **FUTURE CONCEPT**: As the user interacts with the application more, it can start to send notifications to the user to perhaps get food from restaurants based on frequency of going to that restaurant (ex: User goes to Olive Garden on Jan 1st and 2 weeks later, app can notify user to go again since that restaurnt is a favorite for the user)
  - This allows the application to understand not just the user's nutrional profile but also their taste palate and provides recommendations that should best match the user's taste palate

### What do you want the app to do:
- Nutrional Assessment
  - Requirements:
    - Clinical transcripts between clinican and patients
    - Bias on data (for example, how much weight does sleep have on weight loss versus activity)
    - EDA on biometrics to outcomes (ex: seeing how much perhaps neck size has on someone's BMR)
- Geolocation
  - Let's start off with seeing which restaurants are close by and allowing user to choose from there
  - **FUTURE CONCEPT** : As the user approaches a restaurant, the app notifies the user if they want to look at their menu for that particular restaurant from previous visits
- Nutrional Summary
  - Keeping track of macros, fats, proteins, etc
  - This is a yearly summary for the user and can change if the user's health goals change
    - Reason for yearly summary for the user is because most people want to go to the gym at the beginning of the year, hence this will motivate them to be better than the previous year with a fresh start
    - This data can be used to study the user more for a better personalized nutrional plan
- Store chosen food items from a particular restaurant as a list for user to refer to later on
- Keep track of user nutrional choices
- Biometrics (BMI, height, weight, etc)
- Metabolic Assessment (basal metabolic rate, number of calories allowed based on goal)
- Share a created menu list as a link to friends (for example: sending it via imessage)

### Differences between competitors:
- MyFitnessPal
  - Access to certain features are free with our application
    - Personalized nutrional plan
    - Nutrional Summary
  - Expanded biometric assessment
    - Accounts for metabolic rates for each individual
  - Accounts for weight lifting calories
    - MyFitnessPal asks you to type in the calories, however this can be generated based on number of reps, sets, and weights
      - This can be part of the subscription plan


# Future plans

> Potential ideas to add down the line.

- resturaunt geolocation
- take pictures of food and get nutrition info
- order food
- reward users for eating healthy
- social media experience within the app
  - invite other users to groups
- MACROS: Clinical Edition
  - clinical usage

# Current Deliverable for June 30th: Version 0 of MVP

## Features:
- Allow users to create a menu list
- Allow users to select from a list of restaurants from Nutrinix (pre-loading the menus)
- Generate 3-5 recommendations from the list of menu items available from the selected restaurant
- Allow users to select from the recommendations and save the recommendations as a menu list for that specific restaurant
- Allow users to view their recommendation generated menu
    - For now, if users want to have a new set of recommendations, they will have to repeat the process of making a menu rather than editing an existing menu

## Workflow:
- ### Authentication:
    - Sign Up:
        - First Name
        - Last Name
        - DOB
        - Gmail
    - Upon signing up, user is brought to the landing page
    - When the user clicks on the “+” button to go to the recommendations generation page, it will redirect to the My Profile Setup first
    - ### My Profile Setup:
        - What are your nutritional goals ?
            - Lose Weight
            - Gain Weight
            - Gain Muscle
            - Maintain Weight
        - Height
        - Weight
        - Do you have Diabetes ?
            - I do
            - I do not
        - Any Vitamin Deficiencies ?
        - What is your level of activity ?
            - Little to no exercise
            - 1-3 days a week
            - 3-5 days a week
            - Every day
    - Using this data, each of this variables should parse into the OpenAI prompt to generate the recommendations
        - Ex in Python:
            - Prompt: f”Be an expert nutritionist and provide me three food recommendations from {restaurant} and give each one a rating from very bad, bad, okay, good, and very good. To describe my medical conditions, it is based on the following: the nutritional goal is {nutrional_goal}, my height is {height}, my weight is {weight}, I have {vitamin_def} deficiencies, my level of activity is working out {working_out}, and I {diabetes} have diabetes. Recommend me only from the following list {restaurant_lst}”
        - The above is just an example
    - From here the generated recommendations should be displayed as clickable cards or clickable list options where the user can select one or more of the recommendations
    - Upon selections, user can now save the selected recommendations as a menu list
    - The menu list can now be viewed on the landing page and later can be found in the history tab for the user to view

    - The biometrics we take from the  `MyProfile` setup will be used to calculate that individual's BMI, BMR, TEE, and Calories needed [a link](https://github.com/sanman1k98/macros/blob/main/docs/nutrional_assessment.md)
- ## Settings:
    - User can modify all aspects of their MyProfile Setup but cannot modify the Sign Up setup
