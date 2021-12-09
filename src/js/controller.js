import * as model from "./module.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import "regenerator-runtime/runtime";
import "core-js/stable";
import { async } from "regenerator-runtime";
// import { search } from "core-js/fn/symbol";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
if (module.hot) {
  module.hot.accept();
}
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    resultsView.update(model.getSearchResultPage());

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
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultPage());

    paginationView.render(model.state.searchRecipe);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultPage(goToPage));

  paginationView.render(model.state.searchRecipe);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);

  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  model.addBookMark(model.state.recipe);
  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);
};

// controlRecipes();
const init = function () {
  recipeView.addHandleRender(controlRecipes);
  recipeView.addHandleUpdateServings(controlServings);
  recipeView.addHandleAddBookmark(controlAddBookmark);
  searchView.addHandledSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
