import View from './view.js';
import icons from '../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _recipeWindow = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _message = 'Recipe was successfuly uploaded :)';

  constructor() {
    super();
    this._addHandlerShowAddRecipeWindow();
    this._addHandlerHideAddRecipeWindow();
  }

  toggleRecipeWindow() {
    this._overlay.classList.toggle('hidden');
    this._recipeWindow.classList.toggle('hidden');
  }

  _addHandlerShowAddRecipeWindow() {
    this._btnOpen.addEventListener('click', this.toggleRecipeWindow.bind(this));
  }

  _addHandlerHideAddRecipeWindow() {
    this._btnClose.addEventListener(
      'click',
      this.toggleRecipeWindow.bind(this)
    );
    this._overlay.addEventListener('click', this.toggleRecipeWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
