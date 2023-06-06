function calculateBMI(weight: number, height: number): number {
    // Convert height from cm to meters
    const height_m = height / 100;
  
    // Calculate BMI
    const bmi = weight / (height_m ** 2);
    return bmi;
  }
  
  function calculateBMR(weight: number, height: number, age: number, sex: string): number {
    // Calculate BMR based on sex
    let bmr: number;
    if (sex === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    return bmr;
  }
  
  function calculateTEE(bmr: number, activityLevel: string): number {
    // Adjust BMR based on activity level
    const activityFactors: Record<string, number> = {
      "sedentary": 1.2,
      "lightly active": 1.375,
      "moderately active": 1.55,
      "very active": 1.725,
      "extra active": 1.9
    };
    const tee = bmr * activityFactors[activityLevel] || 1.2;
    return tee;
  }
  
  function calculateCalories(tee: number, weightLossRate: number, weightGainRate: number = 0): number {
    // Calculate calories needed for weight loss or gain
    const caloriesPerKg = 7700;
    let caloriesNeeded = tee;
  
    if (weightLossRate === 0.25) {
      caloriesNeeded *= 0.91;
    } else if (weightLossRate === 0.5) {
      caloriesNeeded *= 0.83;
    } else if (weightLossRate === 1) {
      caloriesNeeded *= 0.65;
    }
  
    if (weightGainRate === 1.1) {
      caloriesNeeded *= 1.1;
    } else if (weightGainRate === 1.2) {
      caloriesNeeded *= 1.2;
    } else if (weightGainRate === 1.4) {
      caloriesNeeded *= 1.4;
    }
  
    return caloriesNeeded;
  }
  
  function getUserDetails(): [number, number, number, string, string, string, string] {
    const weight = parseFloat(prompt("Enter your weight in kg: ")!);
    const height = parseFloat(prompt("Enter your height in cm: ")!);
    const age = parseInt(prompt("Enter your age: ")!);
    const sex = prompt("Enter your sex (male/female): ")!;
    const activityLevel = prompt("Enter your activity level (sedentary, lightly active, moderately active, very active, extra active): ")!;
    const weightGoal = prompt("Do you want to lose weight or gain weight? (loss/gain): ")!;
    const intensity = prompt("Choose the degree of intensity (low, moderate, high): ")!;
    return [weight, height, age, sex, activityLevel, weightGoal, intensity];
  }  
  
  function calculateWeightLossRate(intensity: string): number {
    if (intensity === "low") {
      return 0.25;
    } else if (intensity === "moderate") {
      return 0.5;
    } else if (intensity === "high") {
      return 1;
    } else {
      throw new Error("Invalid weight loss intensity. Please choose from 'low', 'moderate', or 'high'.");
    }
  }
  
  function calculateWeightGainRate(intensity: string): number {
    if (intensity === "low") {
      return 1.1;
    } else if (intensity === "moderate") {
      return 1.2;
    } else if (intensity === "high") {
      return 1.4;
    } else {
      throw new Error("Invalid weight gain intensity. Please choose from 'low', 'moderate', or 'high'.");
    }
  }
  
  const [weight, height, age, sex, activityLevel, weightGoal, intensity] = getUserDetails();
  
  const bmi = calculateBMI(weight, height);
  const bmr = calculateBMR(weight, height, age, sex);
  const tee = calculateTEE(bmr, activityLevel);
  
  if (weightGoal === "loss") {
    const weightLossRate = calculateWeightLossRate(intensity);
    const caloriesNeeded = calculateCalories(tee, weightLossRate);
    console.log("Calories needed for weight loss:", Math.round(caloriesNeeded));
  } else if (weightGoal === "gain") {
    const weightGainRate = calculateWeightGainRate(intensity);
    const caloriesNeeded = calculateCalories(tee, 0, weightGainRate);
    console.log("Calories needed for weight gain:", Math.round(caloriesNeeded));
  } else {
    throw new Error("Invalid weight goal. Please choose either 'loss' or 'gain'.");
  }
  
  
  console.log("BMI:", Math.round(bmi * 100) / 100);
  console.log("BMR:", Math.round(bmr));
  console.log("TEE:", Math.round(tee));
  