import * as model from "./module.js";
import recipeView from "./views/recipeView.js";
import "regenerator-runtime/runtime";
import "core-js/stable";
const recipeContainer = document.querySelector(".recipe");

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
    alert(err);
  }
};
// controlRecipes();
const init = function () {
  recipeView.addHandleRender(controlRecipes);
};
init();
