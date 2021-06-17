import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/firebase-messaging-sw.js');
  });
}

ReactDOM.render(<App />, document.getElementById('app'));
