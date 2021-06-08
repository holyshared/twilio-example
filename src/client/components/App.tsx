import React from "react";
import { TwilioProvider } from "./contexts/twilio";
import { Main } from "./Main";

export const App = () => (
  <TwilioProvider>
    <header>
      <h1>Chat Application</h1>
    </header>
    <Main />
  </TwilioProvider>
);
