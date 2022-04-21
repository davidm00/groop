import Parse from "parse";

// used in auth register component
export const createUser = (newUser) => {
  const user = new Parse.User();

  user.set("username", newUser.email);
  user.set("firstName", newUser.firstName);
  user.set("lastName", newUser.lastName);
  user.set("password", newUser.password);
  user.set("email", newUser.email);

  // console.log("User: ", user);
  return user
    .signUp()
    .then((newUserSaved) => {
      return newUserSaved;
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
    });
};

// used in login component
export const logIn = (userInfo) => {
  const user = new Parse.User();

  user.set("username", userInfo.email);
  user.set("email", userInfo.email);
  user.set("password", userInfo.password);

  if(userInfo.email)

  // console.log("User: ", user);
  return user
    .logIn()
    .then((userLoggedIn) => {
      // console.log("userLoggedIn: ", userLoggedIn)
      return userLoggedIn;
    })
    .catch((error) => {
      alert(`In LogIn Error: ${error.message}`);
      return null;
    });
};
