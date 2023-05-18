import React from 'react';
import ReactDOM from 'react-dom/client';

import './assets/styles/main.scss';
import './index.css';

import App from './App/App';

function main() {
   const root = ReactDOM.createRoot(
      document.getElementById('root') as HTMLElement,
   );

   root.render(
      <React.StrictMode>
         <App />
      </React.StrictMode>,
   );
}

main();
