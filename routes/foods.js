require("dotenv").config();
const express = require("express");
const axios = require("axios");

const router = express.Router();

const generateApiUrl = require("../utils/apiUrl");
const ErrorResponse = require("../utils/ErrorResponse");
const auth = require("../middleware/auth");
const Meal = require("../models/meal");

router.post("/food/search-recipies/", async (req, res, next) => {
  const { description } = req.body;

  try {
    const { data } = await axios.get(
      `${generateApiUrl(process.env.API_KEY)}&query=${description}`
    );
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.json({ succes: false, error: "Server error" });
  }
});

// Getting the current meal-plan of a certain user
router.get("/meal-plan", async (req, res, next) => {
  const { username } = req.body;

  try {
    const { data } = await axios.get(
      `https://api.spoonacular.com/mealplanner/${username}/week/2021-08-09?apiKey=${process.env.API_KEY}&hash=${process.env.USER_HASH}`
    );
    res.send(data);
  } catch (error) {
    return next(
      new ErrorResponse("Something went wrong fetching your meal plan", 401)
    );
  }
});

// Generate a randomized meal plan and specify the options in the body
router.get("/generate-meal-plan", auth, async (req, res, next) => {
  const { timeFrame, maxCal, diet } = req.body;
  try {
    const generatedPlan = await axios.get(
      `https://api.spoonacular.com/mealplanner/generate?apiKey=${process.env.API_KEY}&timeFrame=${timeFrame}&targetCalories=${maxCal}&diet=${diet}`
    );
    const mealId = generatedPlan.data.meals.map((val) => val.id);
    await Meal.create({
      meals: mealId,
      user: req.user._id,
    });
    res
      .status(200)
      .json({ succes: true, message: "Succesfully created mealplan" });
  } catch (error) {
    return next(error);
  }
});

// get an existing shopping-list
router.get("/shopping-list", async (req, res, next) => {
  const { username } = req.body;

  try {
    const shoppingList = await axios.get(
      `https://api.spoonacular.com/mealplanner/${username}/shopping-list?apiKey=${process.env.API_KEY}&hash=${process.env.USER_HASH}`
    );
    res.status(200).json({ succes: true, data: shoppingList.data });
  } catch (error) {
    return next(error);
  }
});

router.get("/recipies-by-id", async (req, res, next) => {
  const { id } = req.body;

  try {
    const { data } = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/ingredientWidget.json?apiKey=${process.env.API_KEY}`
    );
    const listIngredients = data.ingredients.map((val) => val.name);
    res.status(200).json({ succes: true, data: listIngredients });
  } catch (error) {
    return next(
      new ErrorResponse("Something went wrong when fetching recipies by id")
    );
  }
});

router.get("/ingredients", auth, async (req, res, next) => {
  try {
    const { meals } = await Meal.findOne({ user: req.user._id });

    if (!meals) {
      return next(
        new ErrorResponse("No mealplan were found for this user", 401)
      );
    }
    const promises = [];
    meals.map(async (id) => {
      promises.push(
        axios.get(
          `https://api.spoonacular.com/recipes/${id}/ingredientWidget.json?apiKey=${process.env.API_KEY}`
        )
      );
    });
    const axiosCalls = await axios.all(promises);
    const calls = axiosCalls.map((val) => val.data.ingredients);

    const listItems = [];
    for (i = 0; i < calls.length; i++) {
      listItems.push(calls[i].map((val) => val.name));
    }
    res.status(200).json({ succes: true, ingredients: listItems });
  } catch (error) {
    return next(error);
  }
 });
// Workouts api https://wger.de/en/software/api

module.exports = router;
