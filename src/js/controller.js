import * as model from "./module.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
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
// controlRecipes();
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandleRender(controlRecipes);
  recipeView.addHandleUpdateServings(controlServings);
  recipeView.addHandleAddBookmark(controlAddBookmark);
  searchView.addHandledSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};
