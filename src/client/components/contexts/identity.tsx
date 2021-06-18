import React, { createContext, PropsWithChildren } from 'react';

export const IdentityContext = createContext<string>('');

export const IdentityProvider = ({
  value,
  children,
}: PropsWithChildren<{ value: string }>) => (
  <IdentityContext.Provider value={value}>{children}</IdentityContext.Provider>
);
