import initNav from './components/nav';
import initContainers from './containers';

const App = () => {
  initNav();
  initContainers();
};

document.addEventListener( 'DOMContentLoaded', App, { passive: true } );
