import * as model from "./module.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";

import "regenerator-runtime/runtime";
import "core-js/stable";
import { async } from "regenerator-runtime";
// import { search } from "core-js/fn/symbol";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    await model.loadRecipe(id);

    //Rendering
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);
    console.log(model.state.searchRecipe.results);
  } catch (err) {
    console.log(err);
  }
};

// controlRecipes();
const init = function () {
  recipeView.addHandleRender(controlRecipes);
  searchView.addHandledSearch(controlSearchResults);
};
init();
