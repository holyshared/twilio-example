import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js');

  Notification.requestPermission((result) => {
    if (result !== 'granted') {
      return;
    }
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification('ServiceWorker ready', {
        body: 'ServiceWorker ready',
      });
    });
  });
}

ReactDOM.render(<App />, document.getElementById('app'));
