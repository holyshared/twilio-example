import React from 'react';
import { TwilioProvider } from './contexts/twilio';
import { IdentityProvider } from './contexts/identity';
import { Header } from './Header';
import { Main } from './Main';

export const App = () => {
  const identity = location.hash
    ? location.hash.substr(1)
    : process.env.TWILIO_IDENTITY;

  return (
    <IdentityProvider value={identity}>
      <Header />
      <TwilioProvider>
        <Main />
      </TwilioProvider>
    </IdentityProvider>
  );
};
