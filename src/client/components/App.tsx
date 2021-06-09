import React from "react";
import { TwilioProvider } from "./contexts/twilio";
import { Main } from "./Main";

export const App = () => (
  <>
    <header className="header">
      <h1 className="header__title">Chat Application</h1>
    </header>
    <TwilioProvider>
      <Main />
    </TwilioProvider>
  </>
);
