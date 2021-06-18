import React from 'react';

export const LoadingPage = ({ message }: { message: string }) => {
  return (
    <div className="main--fluid">
      <p className="loading">{message}</p>
    </div>
  );
};
