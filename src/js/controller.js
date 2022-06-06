import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';

/////////////////////////////
///////////// parcel config
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    /// 3. updated results view to mark selected search result
    resultsView.update(model.getSearchResultsPerPage());

    /// 4. update bookmarks view to mark selected bookmark
    bookmarkView.update(model.state.bookmarks);

    /// 1. Loading the recipe
    await model.loadRecipe(id);

    /// 2. Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    /// load spinner
    resultsView.renderSpinner();

    /// 1.get query and clear the input
    const query = searchView.getQuery();
    if (!query) return;

    /// 2.load search based on the query
    await model.loadSearchResults(query);

    /// 3.Render Results
    // resultsView.render(model.state.search.results);
    /// Render results by pages
    resultsView.render(model.getSearchResultsPerPage());

    /// Render pagination (buttons)
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  /// 1.Render NEW Results
  resultsView.render(model.getSearchResultsPerPage(goToPage));

  /// 2.Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  /// update recipe servings (in state)
  model.updateServings(newServings);

  /// redner the update in view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  /// 1. add bookmark (model)
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  /// or remove if bookmark already exits
  else model.deleteBookmark(model.state.recipe.id);
  /// 2. update the recipe view
  recipeView.update(model.state.recipe);

  /// 3. update the bookmarks container (view)
  /// redner bookmarks
  bookmarkView.render(model.state.bookmarks);

  // console.log(model.state.recipe);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    /// show loading spinner
    addRecipeView.renderSpinner();

    // upload new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    /// render recipe
    recipeView.render(model.state.recipe);

    /// render bookmarks view
    bookmarkView.render(model.state.bookmarks);

    /// change URL ID
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    /// success message
    addRecipeView.renderMessage();

    /// close add recipe window
    setTimeout(function () {
      addRecipeView.toggleRecipeWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

////////
//// https://forkify-api.herokuapp.com/v2
///////////

////// improvements
//// 1. Display the number of pages in between the pages
//// 2. ability to sort the search results by duration or number of ingredients
//// 3. Perform the validation of the ingredients in view, before submitting the form
