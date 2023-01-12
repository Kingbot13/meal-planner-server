const Recipe = require("../models/recipe");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const recipe = require("../models/recipe");

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
      req.params.id,
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