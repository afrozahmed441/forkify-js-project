import { API_KEY, API_URL, RES_PER_PAGE } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    /// get recipe
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    /// recreating the object
    state.recipe = createRecipeObject(data);

    /// bookmarking the recipe in the bookmark array (while loading the recipe)
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    // console.log(state);
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    // console.log(data);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    /// reset page
    state.search.page = 1;

    // console.log(state);
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const getSearchResultsPerPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  /// update quantity of ingredients in recipe
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (
      ing.quantity *
      (newServings / state.recipe.servings)
    ).toFixed(2);
  });

  /// update the new servings
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  /// Add bookmark
  state.bookmarks.push(recipe);

  /// Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  /// update bookmarks in the localstorage
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  /// find index of the recipe with given id
  const index = state.bookmarks.findIndex(el => el.id === id);

  /// remove the recipe from the bookmarks array
  state.bookmarks.splice(index, 1);

  /// Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  /// update bookmarks in the localstorage
  persistBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    // console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredients format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // console.log(ingredients);

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // console.log(recipe);
    /// upload recipe
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    /// recreate the recipe object
    state.recipe = createRecipeObject(data);

    /// bookmark the uploaded recipe
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const localBookmarks = localStorage.getItem('bookmarks');
  if (localBookmarks) state.bookmarks = JSON.parse(localBookmarks);
};

init();

// const clearBookmarks = function() {
//   localStorage.clear('bookmarks');
// }
// clearBookmarks();
