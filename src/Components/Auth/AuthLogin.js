import React, { useContext, useEffect, useState } from "react";
import { logIn } from "./AuthService";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/userContext";

const AuthLogin = () => {
  const navigate = useNavigate();
  const {setLocalUser} = useContext(UserContext);

  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  // flags in the state to watch for add/remove updates
  const [add, setAdd] = useState(false);

  // useEffect that run when changes are made to the state variable flags
  useEffect(() => {
    if (user && add) {
      logIn(user).then((userLoggedIn) => {
        if (userLoggedIn) {
          alert(
            `${userLoggedIn.get("firstName")}, you successfully logged in!`
          );
        }
        // TODO: redirect user to main app
        setAdd(false);
        setLocalUser(user)
        navigate("/groups");
      });
    }
  }, [user, add, navigate, setLocalUser]);

  const onChangeHandler = (e) => {
    e.preventDefault();
    // console.log(e.target);
    const { name, value: newValue } = e.target;
    // console.log(newValue);

    setUser({
      ...user,
      [name]: newValue
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log("submitted: ", e.target);
    setAdd(true);
  };

  return (
    <div>
      <AuthForm
        type="login"
        user={user}
        onChange={onChangeHandler}
        onSubmit={onSubmitHandler}
      />
    </div>
  );
};

export default AuthLogin;
