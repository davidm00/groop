import React, { createContext, useState, useMemo, useEffect } from "react";
import Parse from "parse/lib/browser/Parse";

// create context
const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  // the value that will be given to the context
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    if (Parse.User.current()) {
      setLocalUser(Parse.User.current());
    }
  }, []);

  const providerValue = useMemo(
    () => ({
      localUser,
      setLocalUser,
    }),
    [localUser, setLocalUser]
  );

  return (
    // the Provider gives access to the context to its children
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContextProvider, UserContext };
