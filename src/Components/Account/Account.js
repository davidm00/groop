import React, { useContext, useState } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  Avatar,
  IconButton,
  InputLabel,
  FilledInput,
  FormControl,
  Divider,
} from "@mui/material";
import { UserContext } from "../../Context/userContext";
import { useNavigate } from "react-router-dom";
import { resetPassword, uploadPhoto } from "../../Services/userService";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Account = () => {
  const { localUser, setLocalUser, localLogOut } = useContext(UserContext);
  const [image, setImage] = useState({
    currentFile: undefined,
    previewImage: undefined,
    message: "",
    isError: false,
  });
  const [password, setPassword] = useState({
    new: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [uploaded, setUploaded] = useState(false);
  const navigate = useNavigate();
  const logOut = () => {
    localLogOut();
    setLocalUser(null);
    navigate("/login", { replace: true });
  };

  const selectFile = (event) => {
    setImage({
      currentFile: event.target.files[0],
      previewImage: URL.createObjectURL(event.target.files[0]),
      message: "",
    });
    console.log(event.target.files[0]);
  };

  const upload = async () => {
    await uploadPhoto(localUser, image.currentFile);
    setUploaded(true);
  };

  const reset = async () => {
    if (password.new === password.confirm) {
      resetPassword(localUser, password.new);
    } else {
      alert("Passwords do not match!");
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const onPasswordChange = (prop) => (event) => {
    setPassword({ ...password, [prop]: event.target.value });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="start"
      sx={{ padding: "5rem" }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        divider={<Divider orientation="horizontal" flexItem />}
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="h2" component="div">
            Your Account
          </Typography>
          {localUser.attributes.profilePhoto ? (
            <Avatar
              alt={localUser.attributes.username}
              src={
                uploaded
                  ? image.previewImage
                  : localUser.attributes.profilePhoto._url
              }
            />
          ) : (
            <Avatar
              sx={{
                bgcolor: "secondary.main",
                color: "white",
              }}
              alt={localUser.attributes.username}
            >
              {localUser.attributes.firstName[0] +
                localUser.attributes.lastName[0]}
            </Avatar>
          )}
        </Stack>

        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <label htmlFor="btn-upload">
            <input
              id="btn-upload"
              name="btn-upload"
              style={{ display: "none" }}
              type="file"
              accept="image/*"
              onChange={selectFile}
            />
            <Button className="btn-choose" variant="outlined" component="span">
              Choose Image
            </Button>
          </label>
          <div className="file-name">
            {image.currentFile ? image.currentFile.name : null}
          </div>
          <Button
            className="btn-upload"
            color="primary"
            variant="contained"
            component="span"
            disabled={!image.currentFile}
            onClick={upload}
          >
            Upload
          </Button>
          {image.previewImage && (
            <div>
              <Avatar alt={"preview"} src={image.previewImage} />
            </div>
          )}
          {image.message && (
            <Typography
              variant="subtitle2"
              className={`upload-message ${image.isError ? "error" : ""}`}
            >
              {image.message}
            </Typography>
          )}
        </Stack>
        <Stack direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <FormControl sx={{ m: 1, width: "25ch" }} variant="filled">
              <InputLabel htmlFor="filled-adornment-new-password">
                New Password
              </InputLabel>
              <FilledInput
                required
                id="filled-adornment-new-password"
                type={showPassword ? "text" : "password"}
                value={password.new}
                onChange={onPasswordChange("new")}
                label="New Password"
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "25ch" }} variant="filled">
              <InputLabel htmlFor="filled-adornment-confirm-password">
                Confirm Password
              </InputLabel>
              <FilledInput
                required
                id="filled-adornment-confirm-password"
                type={showPassword ? "text" : "password"}
                value={password.confirm}
                onChange={onPasswordChange("confirm")}
                label="Confirm Password"
              />
            </FormControl>
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Stack>
          <Button sx={{ m: 1, width: "25ch" }} color="inherit" onClick={reset}>
            Change password
          </Button>
        </Stack>
        <Button color="inherit" onClick={() => logOut()}>
          Log Out
        </Button>
      </Stack>
    </Box>
  );
};

export default Account;
