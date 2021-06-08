import React, { createContext, useState, useEffect, PropsWithChildren } from "react";
import { create, Chat }from "./twilio-client";
import { httpClient } from "./axios";

export const TwilioContext = createContext<Chat | null>(null);

export const TwilioProvider = ({ children }: PropsWithChildren<{}>) => {
  const [currentClient, setClient] = useState(null);

  useEffect(() => {
    httpClient.post("/token").then((res) => {
      return create(res.data.jwt);
    }).then((client) => {
      console.log("set current");
      setClient(client);
    }).catch(err => {
      console.log(err);
    });
  }, [setClient]);

  return currentClient ? (
    <TwilioContext.Provider value={currentClient}>
      {children}
    </TwilioContext.Provider>
  ): null;
};