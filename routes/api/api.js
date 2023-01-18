const express = require("express");
const apiController = require("../../controllers/api-controller");
const apiUserController = require("../../controllers/api-user-controller");
const apiRecipeController = require("../../controllers/api-recipe-controller");
const { ResultWithContext } = require("express-validator/src/chain");

const router = express.Router();

// handle registration
router.post("/register", apiController.signUpPost);

// handle log in
router.post("/login", apiController.logInPost);

// get user details
router.get("/users/:userId", apiUserController.userGet);

// create recipe
router.post("/users/:userId/recipes", apiRecipeController.recipeCreatePost);

// update recipe
router.put(
  "/users/:userId/recipes/:recipeId",
  apiRecipeController.recipeUpdate
);

// delete recipe
router.delete("/users/:userId/recipes/:recipeId");

module.exports = router;
