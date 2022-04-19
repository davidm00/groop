import React, { useContext, useEffect, useState } from "react";
import Parse from "parse/lib/browser/Parse";

import { useLocation } from "react-router-dom";
import { UserContext } from "../../Context/userContext";

import { Box } from "@mui/system";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Stack,
  Avatar,
  Typography,
} from "@mui/material";
import { ChatBubbleRounded } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { createClient, handleClient, unsub } from "../../Services/chatService";

const useStyles = makeStyles(() => ({
  chatButton: {
    position: "absolute",
    top: "90vh",
    right: "2.5vw",
  },
  chatBox: {
    position: "absolute",
    top: "90vh",
    right: "2.5vw",
  },
}));

const Chat = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [socket, setSocket] = useState(false);
  const location = useLocation();
  const { localUser } = useContext(UserContext);
  const classes = useStyles();

  useEffect(() => {
    console.log("Location changed");
  }, [location]);

  const create = async () => {
    return await createClient().then((res) => {
      console.log("UEF ** Connection Successful: ", res);
      console.log("UEF ** : ", typeof res);
      return res;
    });
  };

  useEffect(() => {
    if (open) {
      let tempSocket = create();
      if (tempSocket !== "error" || tempSocket !== null) {
        setSubscription(tempSocket);
        console.log("Connected");
      }
    } else {
      handleClient("close");
    }
  }, [open]);

  useEffect(() => {
    console.log("subscription changed");
    console.log("Subscription: ", subscription);

    if (subscription) {
      subscription.then((res) => {
        console.log("PROMISE RESOLUTION: ", res);
        res.on("open", () => {
          console.log("DOM SIDE -- sub.open: CONNECTED");
        });

        res.on("create", (object) => {
          console.log("DOM SIDE -- object created: ", object);
        });

        res.on("update", (object) => {
          console.log("DOM SIDE -- object updated: ", object);
        });
      });
    }
  }, [subscription]);

  const handleClickOpen = async () => {
    setOpen(true);
    // handleClient("open");
  };
  const handleClose = () => {
    setOpen(false);
    // handleClient("close");
  };

  return (
    <Box className={classes.chatButton}>
      <IconButton size="large" onClick={handleClickOpen}>
        <ChatBubbleRounded fontSize="inherit" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        hideBackdrop={true}
        sx={{
          "& .MuiDialog-container": {
            justifyContent: "flex-start",
            alignItems: "flex-start",
          },
        }}
        PaperProps={{
          sx: {
            width: "30%",
            height: "80vh",
            position: "fixed",
            top: "10vh",
            right: 10,
            m: 0,
          },
        }}
      >
        <DialogTitle>{data.name} Chat</DialogTitle>

        <DialogContent>
          <Stack
            direction={"column"}
            justifyContent={"center"}
            alignItems={"start"}
            sx={{ height: "100%" }}
          >
            <DialogContentText></DialogContentText>
            <Box
              sx={{
                height: "100%",
                width: "100%",
                outline: "black solid 1px",
                borderRadius: 1,
                margin: "5px 0",
                padding: 1,
              }}
            >
              <Box
                sx={{
                  height: "fit-content",
                  width: "100%",
                  outline: "black solid 1px",
                  borderRadius: 1,
                  margin: "5px 0",
                  padding: 1,
                }}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"start"}
                  alignItems={"start"}
                  sx={{
                    height: "100%",
                  }}
                  spacing={1}
                >
                  <Avatar sx={{ width: 30, height: 30 }}>DM</Avatar>
                  <Box
                    sx={{
                      height: "100%",
                      width: "100%",
                      overflowWrap: "break-word",
                    }}
                  >
                    <Typography
                      component={"span"}
                      sx={{ overflowWrap: "break-word", height: "100%" }}
                    >
                      This is a message This is a message This is a message This
                      is a message This is a message This is a message This is a
                      message This is a message This is a message This is a
                      message
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
            <TextField
              autoFocus
              id="name"
              label="New Message"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              maxRows={2}
              sx={{
                mt: 1,
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chat;
