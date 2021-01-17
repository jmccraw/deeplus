
type Coords = {
  x: number,
  xOffset: number,
  y: number,
  yOffset: number
};

/**
 * Create the main Nav unit that keeps track of the current item
 * and moving around the board
 */
class Nav {
  navBoard: Array<Array<HTMLElement>>;
  currItem: Coords;
  _collectionContainer: HTMLElement;
  _collections: NodeListOf<HTMLElement>;

  /**
   * Constructor for the Nav
   */
  constructor() {
    this.navBoard = [];
    this.currItem = {
      x: 0,
      xOffset: 0,
      y: 0,
      yOffset: 0
    };
    this._collectionContainer = document.querySelector( '.deeplus__container' );
    this._collections;
  }

  /**
   * Shifts over the current items and adjusts the xOffset
   * @param {Number} newX The newX to shift
   */
  shiftBoardItems( newX: number ) {

    // Shift the collection based the newX divided by 5, the number of visible tiles, times 90,
    // the width of the tile collection
    this._collections[this.currItem.y].style.transform = `translate3d(-${newX / 5 * 90}vw, 0, 0)`;
  }

  /**
   * Shifts over the current collection and adjusts the yOffset
   * @param {Number} newY The newY to shift
   */
  shiftBoardCollection( newY: number ) {

    // Shift it roughly half the size of a full collection height
    // Would need to better calculate this for more elements so as to never have to worry about
    // shifting too little. But since there are only around four visible collections, this should be fine
    this._collectionContainer.style.transform = `translate3d(0, -${newY * 13 }vh, 0)`;
  }

  /**
   * Unhighlight the currently selected item
   */
  unhighlightCurrentItem() {
    this.navBoard[this.currItem.y][this.currItem.x].classList.remove( 'is-highlighted' );
  }

  /**
   * Updates the current highlighted item to the latest values
   */
  updateCurrItem() {
    const x: number = this.currItem.x;
    const y: number = this.currItem.y;

    // Check if new values trigger a board shift
    if ( 0 !== x && 0 === x % 5 && this.currItem.xOffset !== x ) {
      this.currItem.xOffset = x;
      this.currItem.yOffset = y;
      this.shiftBoardItems( x );
    }

    // Shift the y-axis so the current content is always in view at roughly the same location
    this.shiftBoardCollection( y );

    // TODO FIXME Some modulo that gets the offset of the current position for figuring out the place in the navBoard
    this.navBoard[y][x].classList.add( 'is-highlighted' );
  }

  /**
   * Sets a new x-coordinate, if applicable, and updates the current highlight
   * @param {Number} newX The new x-coordinate we want to set to
   */
  setNewX( newX: number ) {
    if ( 0 <= newX && this.navBoard[this.currItem.y].length - 1 >= newX ) {
      this.unhighlightCurrentItem();
      this.currItem.x = newX;
      this.updateCurrItem();
    }
  }

  /**
   * Sets the
   * @param {Number} newY The new y-coordinate we want to set to
   */
  setNewY( newY: number ) {
    if ( 0 <= newY && this.navBoard.length - 1 >= newY ) {
      this.unhighlightCurrentItem();
      this.currItem.y = newY;
      this.updateCurrItem();
    }
  }

  /**
   * Delegates the key press handler to universally look for the Nav link component
   * @event event The click event
   */
  checkKeyboardDelegate( event: Event ) {
    const self = this;
    const keyPress: number = event.keyCode;

    switch ( keyPress ) {
      case 38:
        window.console.log( 'UP' );
        self.setNewY( self.currItem.y - 1 );
        break;
      case 40:
        window.console.log( 'DOWN' );
        self.setNewY( self.currItem.y + 1 );
        break;
      case 37:
        window.console.log( 'LEFT' );
        self.setNewX( self.currItem.x - 1 );
        break;
      case 39:
        window.console.log( 'RIGHT' );
        self.setNewX( self.currItem.x + 1 );
        break;
      case 32:
        window.console.log( 'SPACE' );
        break;
      case 27:
        window.console.log( 'ESC' );
        break;
    }
  }

  /**
   * Fills in the navBoard with coordinates it can travel to
   * We need to get a double array that takes care of the current grouping
   * we're in and the translation for navigating up or down from there into
   * other collections
   * @event event The template-updated event
   */
  fillNavBoard( event: Event ) {
    if ( ! event?.detail?.updated ) return;

    const self = this;

    self._collections = document.querySelectorAll( '.collection .collection__container' );

    self._collections.forEach( ( _collection: HTMLElement, index: number ) => {
      const _items: NodeListOf<HTMLElement> = _collection.querySelectorAll( '.item' );

      self.navBoard[index]= [];

      _items.forEach( ( _item: HTMLElement, itemIndex: number ) => {
        self.navBoard[index][itemIndex] = _item;
      } );
    } );

    self.updateCurrItem();
  }

  /**
   * Attach various event listeners
   */
  attachEventListeners() {
    window.addEventListener( 'keyup', this.checkKeyboardDelegate.bind( this ), { passive: true } );
    window.addEventListener( 'template-updated', this.fillNavBoard.bind( this ), { passive: true } );
  }

  /**
   * Initialize the Nav
   */
  init() {
    this.attachEventListeners();
  }
}

/**
 * Build the Nav constructor
 */
function buildNav() {
  const nav: Nav = new Nav();
  nav.init();
}

/**
 * Initialize the Nav component
 */
export default function initNav() {
  buildNav();
}
