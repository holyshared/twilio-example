import React, { useContext } from 'react';
import { IdentityContext } from './contexts/identity';

export const Header = () => {
  const identity = useContext(IdentityContext);

  return (
    <header className="header">
      <h1 className="header__title">
        <span className="header__app__name">Chat Application</span>
        <span className="header__username">{identity}</span>
      </h1>
    </header>
  );
};
