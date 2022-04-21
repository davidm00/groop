import React from "react";
import { makeStyles, useTheme } from "@mui/styles";
import {
  Typography,
  Box,
  CircularProgress,
  Avatar,
  AvatarGroup,
  Tooltip,
  Backdrop,
  Modal,
  Fade,
  ListItem,
  ListItemAvatar,
  ListItemText,
  List as MuiList,
  Button
} from "@mui/material";

const useStyles = makeStyles((theme) => ({
  loader: {
    transition: "0.3s all",
    zIndex: 5,
  },
  modalStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "350px",
    maxHeight: "550px",
    backgroundColor: "white",
    color: theme.palette.text.primary,
    p: 4,
    borderRadius: "0.5em",
    padding: "1em",
  },
  centered: {
      display: "flex",
      flexDirection: "row",
        justifyContent: "center",
  },
  modalTitle: {
    maxWidth: "80%"
  },
}));

const ClickableAvatarList = ({ users, modalTitle, stringIfNoUsers }) => {
  const classes = useStyles();
  const theme = useTheme();
  // for modal
  const noOp = () => {};
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    users && users.length > 0 ? setOpen(true) : noOp();
  };
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <div>
        <Modal
          aria-labelledby="Modal showing a list of Users"
          aria-describedby="A list of users"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box className={classes.modalStyle}>
              <Box className={classes.centered}>
                <Typography className={classes.modalTitle} variant="h6">
                  {modalTitle}
                </Typography>
              </Box>
              <MuiList
                sx={{ maxHeight: 350, overflow: "auto", paddingTop: "1em" }}
              >
                {users &&
                  users.map((user) => {
                    return user.attributes.profilePhoto ? (
                      <ListItem key={user.attributes.username}>
                        <ListItemAvatar>
                          <Avatar
                            alt={user.attributes.username}
                            key={user.email}
                            src={user.attributes.profilePhoto._url}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            user.attributes.firstName +
                            " " +
                            user.attributes.lastName
                          }
                        />
                      </ListItem>
                    ) : (
                      <ListItem key={user.attributes.username}>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: theme.palette.secondary.main,
                              color: "white",
                            }}
                            alt={user.attributes.username}
                            key={user.email}
                          >
                            {user.attributes.firstName[0] +
                              user.attributes.lastName[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            user.attributes.firstName +
                            " " +
                            user.attributes.lastName
                          }
                        />
                      </ListItem>
                    );
                  })}
              </MuiList>
              <Box className={classes.centered}>
                <Button variant="standard" onClick={handleClose}>Close</Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </div>
      <div className={classes.avatarsContainer} onClick={handleOpen}>
        {users ? (
          <AvatarGroup max={3}>
            {users.length > 0 ? (
              users.map((user) => {
                return user.attributes.profilePhoto ? (
                  <Tooltip
                    title={
                      user.attributes.firstName +
                      " " +
                      user.attributes.lastName
                    }
                    key={user.email}
                    arrow
                  >
                    <Avatar
                      sx={{ width: "1.5em", height: "1.5em" }}
                      alt={user.attributes.username}
                      key={user.email}
                      src={user.attributes.profilePhoto._url}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip
                    title={
                      user.attributes.firstName +
                      " " +
                      user.attributes.lastName
                    }
                    key={user.email}
                    arrow
                  >
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.secondary.main,
                        color: theme.palette.primary.light,
                        width: "1.5em",
                        height: "1.5em",
                      }}
                      alt={user.attributes.username}
                      key={user.email}
                    >
                      {user.attributes.firstName[0] +
                        user.attributes.lastName[0]}
                    </Avatar>
                  </Tooltip>
                );
              })
            ) : (
              <>{stringIfNoUsers}</>
            )}
          </AvatarGroup>
        ) : (
          <CircularProgress
            color="secondary"
            size={"1.5em"}
            className={classes.loader}
          />
        )}
      </div>
    </Box>
  );
};

export default ClickableAvatarList;
