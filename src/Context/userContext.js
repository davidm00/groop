import React, { createContext, useState, useMemo, useEffect } from "react";
import Parse from "parse/lib/browser/Parse";

// create context
const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  // the value that will be given to the context
  const [localUser, setLocalUser] = useState(null);

  const localLogOut = () => {
    Parse.User.logOut();
  };

  useEffect(() => {
    if (Parse.User.current()) {
      if (Parse.User.current().authenticated()) {
        setLocalUser(Parse.User.current());
      }
    }
  }, [localLogOut]);

  const providerValue = useMemo(
    () => ({
      localUser,
      setLocalUser,
      localLogOut,
    }),
    [localUser, setLocalUser, localLogOut]
  );

  return (
    // the Provider gives access to the context to its children
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContextProvider, UserContext };
