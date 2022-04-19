import React, { useContext, useLayoutEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/userContext";

const Home = () => {
  const { localUser } = useContext(UserContext);
  const [auth, setAuth] = useState(false);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (localUser) {
      setAuth(true);
    }
  }, [localUser]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="start"
      minHeight="100vh"
      sx={{ padding: "5rem", overflow: "hidden", mb: 0, pb: 0 }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Typography variant="h1" component="div">
          Welcome to Groop
        </Typography>
        {!auth && (
          <div>
            <Button variant="standard" onClick={() => navigate("/login")}>Login</Button>{" "}
            <Button variant="standard" onClick={() => navigate("/register")}>Register</Button>
          </div>
        )}
        <Box
          display="flex"
          justifyContent="center"b
          alignItems="start"
          minHeight="100vh"
          sx={{ padding: "5rem", pb: 0, mb: 0 }}
        >
        </Box>
      </Stack>
    </Box>
  );
};

export default Home;
