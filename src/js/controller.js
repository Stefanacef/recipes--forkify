import * as model from "./module.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import "regenerator-runtime/runtime";
import "core-js/stable";
import { MODEL_CLOSED_SEC } from "./config.js";
import { async } from "regenerator-runtime";
// import { search } from "core-js/fn/symbol";

// https://forkify-api.herokuapp.com/v2
// 89d4e7b3-9b9c-4b1c-b82b-f96582017943
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
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);

    //Rendering
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
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
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);
    addRecipeView.renderSuccessMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSED_SEC * 1000);
  } catch (err) {
    console.log(err, "😎");
    addRecipeView.renderError(err.message);
  }
};
// controlRecipes();
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandleRender(controlRecipes);
  recipeView.addHandleUpdateServings(controlServings);
  recipeView.addHandleAddBookmark(controlAddBookmark);
  searchView.addHandledSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};
