import View from "./View.js";
import icons from "../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");
  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");

      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  _markupNextBtn(currentPage) {
    return `<button data-goto=${
      currentPage + 1
    } class="btn--inline pagination__btn--next">
      <span> Page ${currentPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
  }
  _markupPreviousBtn(currentPage) {
    return ` 
    <button data-goto=${
      currentPage - 1
    } class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
         <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span> Page ${currentPage - 1}</span> 
    </button>`;
  }
  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //page 1 and there are others pages
    if (currentPage === 1 && numPages > 1) {
      return this._markupNextBtn(currentPage);
    }
    //last pages
    if (currentPage === numPages && numPages > 1) {
      return this._markupPreviousBtn(currentPage);
    }
    //other pages
    if (currentPage < numPages) {
      return ` 
      ${this._markupPreviousBtn(currentPage)}
      ${this._markupNextBtn(currentPage)}
        `;
    }
    return "";
  }
  //page 1 and there are not other pages
}
export default new PaginationView();
