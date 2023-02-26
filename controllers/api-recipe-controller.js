const Recipe = require("../models/recipe");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const shuffle = require("../shuffle");

// create new recipe
exports.recipeCreatePost = [
  body("name", "name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("ingredients", "ingrediants must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("steps", "steps must not be empty").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors) return res.status(400).json({ message: "error validating" });
    const recipe = new Recipe({
      name: req.body.name,
      categories: req.body.categories,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
    });
    recipe.save((err, theRecipe) => {
      if (err)
        return res
          .status(500)
          .json({ message: "could not save recipe", theRecipe });
    });
    User.findByIdAndUpdate(
      req.params.userId,
      {
        $push: { recipes: recipe._id },
      },
      { upsert: true, new: true },
      (err, user) => {
        if (err)
          return res
            .status(500)
            .json({ message: "error updating user with new recipe" });
        return res.status(200).json({ user, recipe });
      }
    );
  },
];

// update recipe
exports.recipeUpdate = [
  body("name", "name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("ingredients", "ingrediants must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("steps", "steps must not be empty").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors) return res.status(400).json({ message: "error validating" });
    Recipe.findByIdAndUpdate(
      req.params.recipeId,
      {
        ingredients: req.body.ingredients,
        name: req.body.name,
        steps: req.body.steps,
        categories: req.body.categories,
      },
      {},
      (err, recipe) => {
        if (err)
          return res
            .status(500)
            .json({ recipe, message: "error updating recipe" });
        return res.status(200).json(recipe);
      }
    );
  },
];

// delete recipe
exports.recipeDelete = (req, res, next) => {
  Recipe.findByIdAndRemove(req.params.recipeId, {}, (err, recipe) => {
    if (err)
      return res.status(500).json({ message: "could not delete recipe" });
    User.findById(req.params.userId).exec((err, user) => {
      if (err)
        return res.status(500).json({ message: "could not find user", user });
      filteredRecipes = user.recipes.filter(
        (recipe) => recipe._id !== req.params.recipeId
      );
      user.recipes = filteredRecipes;
      user.save((err, user) => {
        if (err)
          return res
            .status(500)
            .json({ message: "could not save user recipe update" });
        return res.status(200).json({ user, recipe });
      });
    });
  });
};

// shuffle recipes randomly
exports.recipeShuffleGet = (req, res, next) => {
  User.findById(req.params.userId).exec((err, user) => {
    if (err) return res.status(500).json({ message: "error finding user" });
    const shuffledRecipes = shuffle(user.recipes, user.recipes.length);
    user.shuffledRecipes = shuffledRecipes;
    user.save((err, theUser) => {
      if (err)
        return res
          .status(500)
          .json({ message: "error saving changes to user", theUser });
      return res.status(200).json({ theUser });
    });
  });
};
