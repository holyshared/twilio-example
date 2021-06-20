import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/firebase-messaging-sw.js');

    Notification.requestPermission((result) => {
      console.log('requestPermission');
      console.log(result);
      if (result !== 'granted') {
        return;
      }
      navigator.serviceWorker.ready.then((registration) => {
        console.log('serviceWorker ready');
        registration
          .showNotification('ServiceWorker ready', {
            body: 'ServiceWorker ready',
          })
          .then(() => {
            console.log('ServiceWorker ready show');
          })
          .catch((err) => {
            console.log('failed showNotification');
            console.log(err);
          });
      });
    });
  });
}

ReactDOM.render(<App />, document.getElementById('app'));
