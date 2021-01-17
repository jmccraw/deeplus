
type Coords = {
  x: number
  y: number
};

/**
 * Create the main Nav unit that keeps track of the current item
 * and moving around the board
 */
class Nav {
  navBoard: Array<Array<HTMLElement>>;
  offsets: Array<number>;
  currItem: Coords;
  _collectionContainer: HTMLElement;
  _collections: NodeListOf<HTMLElement>;

  /**
   * Constructor for the Nav
   */
  constructor() {
    this.navBoard = [];
    this.offsets = [];
    this.currItem = {
      x: 0,
      y: 0,
    };
    this._collectionContainer = document.querySelector( '.deeplus__container' );
    this._collections;
  }

  /**
   * Shifts over the current items and adjusts the xOffset
   */
  shiftBoardItems() {
    const y: number = this.currItem.y;

    // Shift the collection based the newX divided by 5, the number of visible tiles, times 90,
    // the width of the tile collection
    this._collections[y].style.transform = `translate3d(-${this.offsets[y] * 90}vw, 0, 0)`;
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
   * Adjusts the x-axis offset when moving between Collections because
   * the current grid layout of one could be several pages deep compared
   * to others in the group
   * @param {Number} newY The newY we're moving into
   */
  adjustXOffset( newY: number ) {
    const y: number = this.currItem.y;
    const currOffset: number = this.offsets[y];
    const newOffset: number = this.offsets[newY];

    // If the new offset is greater than the current offset,
    // then add some to the current x to offset the difference,
    // else, do the opposite
    if ( currOffset < newOffset ) {
      this.currItem.x += ( newOffset - currOffset ) * 5;
    } else if ( currOffset > newOffset ) {
      this.currItem.x -= ( currOffset - newOffset ) * 5;
    }
  }

  /**
   * Unhighlight the currently selected item
   */
  unhighlightCurrentItem() {
    const classes: Array<string> = [ 'is-highlighted', 'is-left', 'is-right', 'is-up', 'is-down', 'is-none' ];
    this.navBoard[this.currItem.y][this.currItem.x].classList.remove( ...classes );
  }

  /**
   * Updates the current highlighted item to the latest values
   * @param {String} direction The direction of the nav movement
   */
  updateCurrItem( direction: string ) {
    const x: number = this.currItem.x;
    const y: number = this.currItem.y;

    // Check if new values trigger a board shift
    if ( 0 !== x && this.offsets[y] !== Math.floor( x / 5 ) ) {
      this.offsets[y] = Math.floor( x / 5 );
      this.shiftBoardItems();
    }

    // Shift the y-axis so the current content is always in view at roughly the same location
    this.shiftBoardCollection( y );

    this.navBoard[y][x].classList.add( 'is-highlighted', `is-${direction}` );
  }

  /**
   * Sets a new x-coordinate, if applicable, and updates the current highlight
   * @param {Number} newX The new x-coordinate we want to set to
   * @param {String} direction The direction of the movement
   */
  setNewX( newX: number, direction: string ) {
    if ( 0 <= newX && this.navBoard[this.currItem.y].length - 1 >= newX ) {
      this.unhighlightCurrentItem();
      this.currItem.x = newX;
      this.updateCurrItem( direction );
    }
  }

  /**
   * Sets the new y-coordinate and adjusts the x-offset when going into a new Collection
   * @param {Number} newY The new y-coordinate we want to set to
   * @param {String} direction The direction of the movement
   */
  setNewY( newY: number, direction: string ) {
    if ( 0 <= newY && this.navBoard.length - 1 >= newY ) {
      this.unhighlightCurrentItem();
      this.adjustXOffset( newY );
      this.currItem.y = newY;
      this.updateCurrItem( direction );
    }
  }

  /**
   * Delegates the key press handler to universally look for the Nav link component
   * @event event The click event
   */
  checkKeyboardDelegate( event: Event ) {
    const self = this;
    const keyPress: number = event.keyCode;

    // Check for arrow key presses or WASD
    switch ( keyPress ) {
      case 38:
      case 87:
        self.setNewY( self.currItem.y - 1, 'up' );
        break;
      case 40:
      case 83:
        self.setNewY( self.currItem.y + 1, 'down' );
        break;
      case 37:
      case 65:
        self.setNewX( self.currItem.x - 1, 'left' );
        break;
      case 39:
      case 68:
        self.setNewX( self.currItem.x + 1, 'right' );
        break;

      // Where we would add modal activation to display playback information for this item
      case 32:
        window.console.log( 'SPACE' );
        break;

      // Where we would add the ability to close the modal
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

      // Set initial navBoard to empty array for the new Items we get in next step
      self.navBoard[index]= [];

      // Set initial offsets to 0
      self.offsets[index] = 0;

      _items.forEach( ( _item: HTMLElement, itemIndex: number ) => {
        self.navBoard[index][itemIndex] = _item;
      } );
    } );

    self.updateCurrItem( 'none' );
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
