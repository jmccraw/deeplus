import initTemplates from '../templates';
import { DeePlusAPI } from '../constants/feed';
import { setLoadingErrorMessage } from '../components/loading';
let deePlusData: object = {};

/**
 * Start constructing the templates based on the data we have set
 */
function constructTemplates() {
  initTemplates( deePlusData );
}

/**
 * Set the deePlusData to the returned values in the fetch
 * @param {JSON} data The API response data JSONified
 */
function setDeePlusData( data: object ) {
  deePlusData = data;
}

/**
 * Fetch the homepage API data and delegate it to the templates for consumptions
 * @param {String} url The URL to fetch the data from
 * @param {Function} callback Where the send the data once we retrieve it
 * @return {JSON}
 */
function setHomepageAPI( url: string, callback: Function ) {
  if ( 0 === url.length ) throw new Error( 'Invalid API Request' );

  fetch( DeePlusAPI )
    .then( ( resp: Response ) => resp.json() )
    .then( ( data: object ) => {

      // If the data looks good initially, return
      if ( data?.data?.StandardCollection?.containers ) {
        setDeePlusData( data.data.StandardCollection.containers );
        callback();
      } else {
        throw new Error( 'Missing Collection Data' );
      }
    } )
    .catch( ( err: Error ) => {
      const message: string = `Something bad happened: ${err}`;

      window.console.error( message );
      setLoadingErrorMessage( message );
    } );
}

/**
 * Initialize various functions from within the Main container
 */
export default function initContainers() {
  setHomepageAPI( DeePlusAPI, constructTemplates );
}
