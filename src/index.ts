import initNav from './components/nav';
import initContainers from './containers';

// TODO FIXME See if need any globals
// declare global {
//   interface Window {

//   }
// }


const App = () => {
  initNav();
  initContainers();
};

document.addEventListener( 'DOMContentLoaded', App, { passive: true } );
