// import { search } from "core-js/fn/symbol";
import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { getJSON, sendJSON } from "./helper.js";
export const state = {
  recipe: {},
  searchRecipe: {
    query: "",
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceURL: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
      return (state.recipe.bookmarked = true);
    } else {
      return (state.recipe.bookmarked = false);
    }
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
    state.searchRecipe.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultPage = function (page = state.searchRecipe.page) {
  state.searchRecipe.page = page;
  const start = (page - 1) * state.searchRecipe.resultsPerPage;
  const end = page * state.searchRecipe.resultsPerPage;
  return state.searchRecipe.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ingredient) => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const storeBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookMark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  storeBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  storeBookmarks();
};
const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ingredient) => {
        const ingredientArray = ingredient[1].replaceAll(" ", "").split(",");
        if (ingredientArray.length !== 3)
          throw new Error(
            "wrong ingredient format, please use the correct format"
          );
        const [quantity, unit, description] = ingredientArray;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};
