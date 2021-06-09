import React from "react";

export const Loading = ({ message }: { message: string }) => {
  return (
    <p className="loading">{message}</p>
  );
};