import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  PropsWithChildren,
} from 'react';
import { create, TwilioClient } from './twilio-client';
import { httpClient } from './axios';
import { LoadingPage } from '../LoadingPage';
import { IdentityContext } from '../contexts/identity';

export const TwilioContext = createContext<TwilioClient | null>(null);

export const TwilioProvider = ({ children }: PropsWithChildren<{}>) => {
  const identity = useContext(IdentityContext);
  const [currentClient, setClient] = useState<TwilioClient | null>(null);

  useEffect(() => {
    httpClient
      .post('/token', { identity })
      .then((res) => {
        return create(res.data.jwt);
      })
      .then((client) => {
        console.log('set current');
        setClient(client);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setClient, identity]);

  return currentClient ? (
    <TwilioContext.Provider value={currentClient}>
      {children}
    </TwilioContext.Provider>
  ) : (
    <LoadingPage message="Initializing" />
  );
};
