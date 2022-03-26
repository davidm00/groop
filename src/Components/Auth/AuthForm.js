import React from "react";
import { useNavigate } from "react-router-dom";

const AuthForm = ({ type, user, onChange, onSubmit }) => {
  const navigate = useNavigate();
  const goBackHandler = () => {
    navigate("/auth");
  };

  return (
    <div style={{padding: 100}}>
      <form onSubmit={onSubmit} autoComplete="off">
        {type === "register" && (
          <div className="form-group">
            <label>First Name</label>
            <br />
            <input
              type="text"
              className="form-control"
              id="first-name-input"
              value={user.firstName}
              onChange={onChange}
              name="firstName"
              placeholder="first name"
              required
            />
          </div>
        )}
        {type === "register" && (
          <div className="form-group">
            <label>Last Name</label>
            <br />
            <input
              type="text"
              className="form-control"
              id="last-name-input"
              value={user.lastName}
              onChange={onChange}
              name="lastName"
              required
            />
          </div>
        )}{" "}
        <div className="form-group">
          <label>Email</label>
          <br />
          <input
            type="email"
            className="form-control"
            id="email-input"
            value={user.email}
            onChange={onChange}
            name="email"
            required
          />
        </div>{" "}
        <div className="form-group">
          <label>Password</label>
          <br />
          <input
            type="password"
            className="form-control"
            id="password-input"
            value={user.password}
            onChange={onChange}
            name="password"
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary" onSubmit={onSubmit}>
            Submit
          </button>
        </div>
        <br />
        <button onClick={goBackHandler}>Back</button>
      </form>
    </div>
  );
};

export default AuthForm;
