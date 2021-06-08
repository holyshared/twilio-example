import React, { createContext, PropsWithChildren } from "react";
import Twilio from "twilio-chat";
import axios from "axios";

const httpClient = axios.create({
  baseURL: 'http://localhost:3000',
});

export const TwilioContext = createContext<Twilio | null>(null);

export const TwilioProvider = ({ children }: PropsWithChildren<{}>) => {
  let currentClient = null;

  httpClient.post("/token").then((res) => {
    return Twilio.create(res.data.jwt);
  }).then((client) => {
    currentClient = client;
  }).catch(err => {
    console.log(err);
  });

  return currentClient ? (
    <TwilioContext.Provider value={currentClient}>
      {children}
    </TwilioContext.Provider>
  ): null;
};