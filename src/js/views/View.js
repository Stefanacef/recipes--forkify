import icons from "../../img/icons.svg";

export default class View {
  _data;
  render(data, render = true) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    this._data = data;
    const updateMarkup = this._generateMarkup();
    const updateDom = document
      .createRange()
      .createContextualFragment(updateMarkup);
    const updateElements = Array.from(updateDom.querySelectorAll("*"));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll("*")
    );

    updateElements.forEach((updateElement, index) => {
      const currentElement = currentElements[index];
      //updates changed text
      if (
        !updateElement.isEqualNode(currentElement) &&
        updateElement.firstChild?.nodeValue.trim() !== ""
      ) {
        currentElement.textContent = updateElement.textContent;
      }
      //updates changed attributes
      if (!updateElement.isEqualNode(currentElement)) {
        Array.from(updateElement.attributes).forEach((attribute) => {
          currentElement.setAttribute(attribute.name, attribute.value);
        });
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = "";
  }
  renderSpinner() {
    const markup = `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  renderSuccessMessage(message = this._successMessage) {
    const markup = `<div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
