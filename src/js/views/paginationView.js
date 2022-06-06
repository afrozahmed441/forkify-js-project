import icons from '../../img/icons.svg';
import View from './view.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      /// if click is not on the btn
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      if (goToPage > 1) handler(goToPage);
    });
  }

  /// generate markup for the pagniation buttons to navigate to different pages based on
  /// search results
  _generateMarkup() {
    const curPage = this._data.page;
    /// 1.calculate number of pages
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    /// 2.different cases
    // On first page and there are other pages
    if (curPage === 1 && numPages > 1)
      return `
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
    `;
    // On last page
    if (curPage === numPages && numPages > 1)
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
    `;
    // On page in between first and last page (some other page)
    if (curPage < numPages)
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
    `;
    // On first page and no other pages
    return '';
  }
}

export default new PaginationView();
