import React, { useContext, useLayoutEffect, useState } from "react";
import { createUser } from "./AuthService";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/userContext";

const AuthRegister = () => {
  const navigate = useNavigate();
  const { setLocalUser } = useContext(UserContext);

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // flags in the state to watch for add/remove updates
  const [add, setAdd] = useState(false);

  // useEffect that run when changes are made to the state variable flags
  useLayoutEffect(() => {
    if (newUser && add) {
      createUser(newUser)
        .then((userCreated) => {
          if (userCreated) {
            console.log(
              `${userCreated.get("firstName")}, you successfully registered!`
            );
            // TODO: redirect user to main app
            setAdd(false);
            setLocalUser(userCreated);
            navigate("/groups");
          } else {
            setAdd(false);
          }
        })
        .catch((e) => {
          alert("Incorrect credentials");
          setAdd(false);
        });
    }
  }, [newUser, add, navigate, setLocalUser]);

  const onChangeHandler = (prop) => (event) => {
    setNewUser({ ...newUser, [prop]: event.target.value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    // console.log("submitted: ", e.target);
    setAdd(true);
  };

  return (
    <div>
      <AuthForm
        type="register"
        user={newUser}
        onChange={onChangeHandler}
        onSubmit={onSubmitHandler}
      />
    </div>
  );
};

export default AuthRegister;
