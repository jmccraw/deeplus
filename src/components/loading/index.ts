/**
 * Sets the loading state to complete and displays the background content
 */
export function setLoadingComplete() {
  const _loading: HTMLElement = document.querySelector( '.loading' );
  _loading.classList.add( 'is-loaded' );
}

/**
 * Displays an error message and changes the loading animation image
 * @param {String} message The error message to display
 */
export function setLoadingErrorMessage( message: string ) {
  const _loading: HTMLElement = document.querySelector( '.loading' );
  const _errorMessage: HTMLElement = _loading.querySelector( '.header__hed' );
  const _errorImage: HTMLElement = _loading.querySelector( '.loading__error' );

  _loading.classList.add( 'is-error' );
  _errorMessage.innerHTML = message;
  _errorImage.setAttribute( 'src', _errorImage.dataset.src );
}
