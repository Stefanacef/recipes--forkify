// import { search } from "core-js/fn/symbol";
import { async } from "regenerator-runtime";
import { API_URL } from "./config.js";
import { getJSON } from "./helper.js";
export const state = {
  recipe: {},
  searchRecipe: {
    query: "",
    results: [],
  },
};
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceURL: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (err) {
    throw err;
  }
};
export const loadSearchResults = async function (query) {
  try {
    state.searchRecipe.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    state.searchRecipe.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });
  } catch (err) {
    throw err;
  }
};
