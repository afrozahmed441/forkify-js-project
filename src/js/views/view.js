import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  _clear() {
    this._parentElement.innerHTML = '';
  }

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(newElements);

    /// Compare the nodes (new and old)
    /// and Update the textContent of the cur Elements in DOM
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      /// check if the nodes are equal or not by using the isEqualNode method
      /// check if the nodes have the textContent only (using the nodeValue property)
      if (
        !newEl.isEqualNode(curEl) &&
        /// only nodes with textContent as their firstChild
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      /// update attributes of cur Elements in DOM
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  renderSpinner() {
    const spinnerMarkup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', spinnerMarkup);
  }

  renderError(message = this._errorMessage) {
    const errorMarkup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', errorMarkup);
  }

  renderMessage(message = this._message) {
    const messageMarkup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', messageMarkup);
  }
}
