import React from 'react';
import { TwilioProvider } from './contexts/twilio';
import { Main } from './Main';

const identity = process.env.TWILIO_IDENTITY;

export const App = () => (
  <>
    <header className="header">
      <h1 className="header__title">
        <span className="header__app__name">Chat Application</span>
        <span className="header__username">{identity}</span>
      </h1>
    </header>
    <TwilioProvider>
      <Main />
    </TwilioProvider>
  </>
);
