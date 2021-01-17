const _mainContainer: HTMLElement = document.querySelector( '.deeplus__container' );
const _collectionTemplate: HTMLElement = document.getElementById( 'collection' );
const _itemTemplate: HTMLElement = document.getElementById( 'item' );
const fallbackImage = 'https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/FFA0BEBAC1406D88929497501C84019EBBA1B018D3F7C4C3C829F1810A24AD6E/scale?width=600&aspectRatio=1.78&format=png';

class TemplateMaker {
  data: Array<object>;
  _frag: DocumentFragment;
  currCollection: number;
  _collection: HTMLTemplateElement;
  _item: HTMLTemplateElement;

  /**
   * Create a TemplateMaker constructor with the data to use
   * TODO Needs to clear this data object once the collection's contents are created
   * Built out like this in case we make it to the Refs collection lazy loading content section
   * @param {Array} data The data to construct this particular series of templates with
   */
  constructor( data: Array<object> ) {
    this.data = data;
    this._frag = document.createDocumentFragment();
    this.currCollection = 0;
    this._collection;
    this._item;
  }

  /**
   * Dispatch a custom event saying this template has been updated
   */
  dispatchTemplateUpdate() {
    const event: Event = new CustomEvent( 'template-updated', {
      detail: {
        updated: true
      }
    } );

    window.dispatchEvent( event );
  }

  /**
   * Get the text value from a series of nested objects
   * @param {Object} props The text title object
   * @param {String} search The expected key we're looking for
   * @return {String}
   */
  getTextValue( props: object, search: string ): string {
    for ( let key in props ) {
      if ( 'object' === typeof props[key] ) {
        return this.getTextValue( props[key], search );
      } else if ( 'string' === typeof props[key] && search === key ) {
        return props[key];
      }
    }

    return '';
  }

  /**
   * Construct each of the Items and returns the new Item
   * @param {Object} currItem The current item data to construct
   * @return {Object}
   */
  getItem( currItem: object ) {
    const _item = document.importNode( _itemTemplate.content, true );
    const _itemFrag = document.createDocumentFragment();
    const _image = _item.querySelector( '.image' );
    let title = '';
    let imageSrc = '';

    // Get the title for this item
    if ( currItem?.text?.title?.full ) {
      title = this.getTextValue( currItem.text.title.full, 'content' );
    }

    _item.querySelector( '.header__hed' ).innerHTML = title;

    // Get the hero collection image for this title
    if ( currItem?.image?.tile['1.78'] ) {
      imageSrc = this.getTextValue( currItem.image.tile['1.78'], 'url' );
    }

    // If the image failes to load, try loading in a default image and unregister the listener
    _image.onerror = () => {
      _image.setAttribute( 'src', fallbackImage );
      _image.onerror = null;
    };

    _image.setAttribute( 'src', imageSrc );
    _itemFrag.appendChild( _item );

    return _itemFrag;
  }

  /**
   * Contruct each of the Collections and returns the entire Collection
   * @param {Object} currSet The current set of data to parse through
   * @param {Number} index The current set's index
   * @return {Object}
   */
  getCollection( currSet: object, index: number ) {
    const _collectionFrag = document.createDocumentFragment();
    const _set = document.importNode( _collectionTemplate.content, true );
    const _container = _set.querySelector( '.collection__container' );

    let title = '';

    if ( currSet?.text?.title?.full) {
      title = this.getTextValue( currSet.text.title.full, 'content' );
    }

    _set.querySelector( '.header__hed' ).innerHTML = title;

    window.console.log( 'Current Set: ', currSet, index );

    currSet.items.forEach( ( item: object ) => {
      _container.appendChild( this.getItem( item ) );
    } );

    _collectionFrag.appendChild( _set );

    return _collectionFrag;
  }

  /**
   * Construct the Templates based on the data we received
   */
  constructTemplates() {
    const self = this;

    self.data.forEach( ( dataSet: object ) => {

      // If the current set has items, create the Collection, else, it probably has a
      // refsID and needs to use the other API call
      if ( dataSet?.set?.items ) {
        self._frag.appendChild( self.getCollection( dataSet.set, self.currCollection++ ) );
      }
    } );

    _mainContainer.appendChild( self._frag );
    self.dispatchTemplateUpdate();
  }

  init() {
    this.constructTemplates();
  }
}

/**
 * Initialize the Templates with the DeePlusAPI data we receive from the Main component
 * @param {Array} data The DeePlusAPI call data
 */
export default function initTemplates( data: Array<object> ) {
  if ( data ) {
    const templateMaker = new TemplateMaker( data );
    templateMaker.init();
  }
}
