// Shout out to Daniela Matos de Carvalho for providing those code at 
// https://medium.com/yld-blog/handling-global-notifications-with-reacts-context-api-7d8135510d50 

import React, { useState, useCallback, useContext } from 'react';

export const ErrorContext = React.createContext({
  errorMessage: null,
  addError: () => {},
  removeError: () => {}
});

export function useAPIError() {
    const { errorMessage, addError, removeError } = useContext(ErrorContext);
    return { errorMessage, addError, removeError };
}

export default function ErrorContextProvider({ children }) {
  const [errorMessage, setError] = useState(null);

  const removeError = () => setError(null);
  //const removeError = () => console.log("remove error called");

  /**
   * A function to add the message of an error to the global context
   * @param {String} message 
   */
  const addError = (message) => setError(message);

  const contextValue = {
    errorMessage,
    addError: useCallback((message) => addError(message), []),
    removeError: useCallback(() => removeError(), [])
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
}