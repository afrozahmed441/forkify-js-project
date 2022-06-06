class SearchView {
  _parentElement = document.querySelector('.search');
  _searchField = document.querySelector('.search__field');

  _clearInput() {
    this._searchField.value = '';
  }

  getQuery() {
    const query = this._searchField.value;
    this._clearInput();
    return query;
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
