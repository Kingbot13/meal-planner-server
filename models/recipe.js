const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    name: String,
    // categories contains strings describing the category of the meal, ex. "dinner", "breakfast", "snack"
    categories: [],
    // ingredients[] will contain objects with ingredient name and measurement required for recipe
    ingredients: [],
    // steps[] contains the recipe instructions ex. {step: 1, instruction: "preheat oven"}
    steps: []

});

module.exports = mongoose.model("Recipe", RecipeSchema);