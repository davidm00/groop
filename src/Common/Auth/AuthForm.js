import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Button,
  Stack,
  FilledInput,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AuthForm = ({ type, user, onChange, onSubmit }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ flexWrap: "wrap" }}
    >
      <form onSubmit={onSubmit} autoComplete="off">
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="h1" component="div">
            {type === "register" ? `Welcome!` : `Welcome Back!`}
          </Typography>
          <Typography variant="h5" gutterBottom component="div">
            {type === "register" ? `Create a new account.` : `Sign in.`}
          </Typography>
          {type === "register" && (
            <FormControl sx={{ m: 1, width: "25ch" }} variant="filled">
              <InputLabel htmlFor="filled-adornment-first-name">
                First Name
              </InputLabel>
              <FilledInput
                id="filled-adornment-first-name"
                type={"text"}
                value={user.firstName}
                onChange={onChange("firstName")}
                label="First Name"
                required
              />
            </FormControl>
          )}
          {type === "register" && (
            <FormControl sx={{ m: 1, width: "25ch" }} variant="filled">
              <InputLabel htmlFor="filled-adornment-last-name">
                Last Name
              </InputLabel>
              <FilledInput
                id="filled-adornment-last-name"
                type={"text"}
                value={user.lastName}
                onChange={onChange("lastName")}
                label="Last Name"
                required
              />
            </FormControl>
          )}
          <FormControl sx={{ m: 1, width: "25ch" }} variant="filled">
            <InputLabel htmlFor="filled-adornment-email">Email</InputLabel>
            <FilledInput
              id="filled-adornment-email"
              type={"email"}
              value={user.email}
              onChange={onChange("email")}
              label="Email"
              required
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="filled">
            <InputLabel htmlFor="filled-adornment-password">
              Password
            </InputLabel>
            <FilledInput
              required
              id="filled-adornment-password"
              type={showPassword ? "text" : "password"}
              value={user.password}
              onChange={onChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <Button type="submit" onSubmit={onSubmit}>
            Submit
          </Button>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Button 
              variant="standard"
              onClick={() => navigate("/", { replace: true })}>
              Back
            </Button>
            {type === "register" && (
              <Button 
                variant="standard"
                onClick={() => navigate("/login", { replace: true })}>
                Login
              </Button>
            )}
            {type === "login" && (
              <Button 
                variant="standard"
                onClick={() => navigate("/register", { replace: true })}>
                Register
              </Button>
            )}
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

export default AuthForm;
