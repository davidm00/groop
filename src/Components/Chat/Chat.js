import React, { useCallback, useContext, useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import { UserContext } from "../../Context/userContext";

import {
  Box,
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
  CircularProgress,
  Fade,
  Alert,
  AlertTitle,
} from "@mui/material";
import { ChatBubbleRounded, CloseRounded } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import {
  closeClient,
  createClient,
  createMessage,
  deleteMessage,
  getAllMessages,
  loadMoreMessages,
} from "../../Services/chatService";
import { getMonth, getTime } from "../../Constants/dates";

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
  loader: {
    transition: "0.3s all",
    zIndex: 5,
  },
}));

const Chat = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [loadMore, setLoadMore] = useState(true);
  const [messages, setMessages] = useState(null);
  const [subEvent, setSubEvent] = useState(null);
  const [created, setCreated] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const [newMessage, setNewMessage] = useState("");
  const [popUp, setPopUp] = useState(false);
  const location = useLocation();
  const { localUser } = useContext(UserContext);
  const classes = useStyles();

  useEffect(() => {
    console.log("Location changed");
  }, [location]);

  const create = async () => {
    return await createClient().then((res) => {
      return res;
    });
  };

  useEffect(() => {
    if (open) {
      let tempSub = create();
      if (tempSub !== "error" || tempSub !== null) {
        setSubscription(tempSub);
      }
      getAllMessages(data.id).then((res) => {
        setMessages(res);
      });
    } else {
      closeClient();
      setMessages(null);
    }
  }, [open, data.id]);

  useEffect(() => {
    if (subscription) {
      subscription.then((res) => {
        res.on("create", (object) => {
          console.log("DOM SIDE -- object created: ", object);
          setCreated(true);
          setSubEvent(object);
        });

        res.on("delete", (object) => {
          console.log("object deleted: ", object);
          setDeleted(true);
          setSubEvent(object);
        });
      });
    }
  }, [subscription]);

  useEffect(() => {
    if (created && messages && subEvent) {
      let temp = messages;
      let newMsg = { ...subEvent.attributes, id: subEvent.id };
      temp = [...temp, newMsg];
      setMessages(temp);
      setCreated(false);
      setSubEvent(null);
    }
    if (deleted && messages && subEvent) {
      let temp = messages;
      temp = temp.filter((msg) => msg.id !== subEvent.id);
      setMessages(temp);
      setDeleted(false);
      setSubEvent(null);
    }
  }, [created, deleted, messages, subEvent]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setNewMessage("");
    setMessages(null);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    createMessage(data.id, localUser.id, newMessage).then(setNewMessage(""));
  };

  const onMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleScroll = (e) => {
    if (e.currentTarget.scrollTop > 0 && messages.length > 0) {
      setLoadMore(false);
    } else {
      setLoadMore(true);
    }
  };

  const handleLoad = () => {
    loadMoreMessages(messages.length, data.id).then((newMsgs) => {
      if (newMsgs.length < 1) {
        setPopUp(true);
        setTimeout(() => {
          setPopUp(false);
        }, 4000);
        return;
      }
      let temp = messages;
      temp = [...newMsgs, ...temp];
      setMessages(temp);
    });
  };

  const handleDeleteMessage = (id) => {
    deleteMessage(id).then(() => {
      setDeleted(true);
    });
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
              id="chatScroll"
              onScroll={handleScroll}
              sx={{
                height: "100%",
                width: "100%",
                outline: "black solid 1px",
                borderRadius: 1,
                margin: "5px 0",
                padding: 1,
                overflow: "scroll",
              }}
            >
              <Box
                sx={{
                  height: "fit-content",
                  width: "100%",
                }}
              >
                <Fade in={popUp} sx={{ width: "100%" }} unmountOnExit>
                  <Alert
                    severity="warning"
                    sx={{ width: "100%", mt: 1, mb: 1.5 }}
                  >
                    <AlertTitle>Warning</AlertTitle>
                    <strong>No more messages to load!</strong>
                  </Alert>
                </Fade>

                <Fade in={loadMore} sx={{ width: "100%", mt: 1.5, mb: 1.5 }}>
                  <Stack alignItems="center" sx={{ width: "100%" }}>
                    <Button onClick={() => handleLoad()}>
                      Load More Messages
                    </Button>
                  </Stack>
                </Fade>
                <Box sx={{ height: "100%" }}></Box>
                {messages &&
                  messages.length > 0 &&
                  messages.map((message) => {
                    return (
                      <Stack
                        key={message.id}
                        direction={"row"}
                        justifyContent={"start"}
                        alignItems={"start"}
                        sx={{
                          height: "100%",
                          outline: "black solid 1px",
                          borderRadius: 1,
                          margin: "5px 0",
                          padding: 1,
                        }}
                        spacing={1}
                      >
                        {message.user.id !== localUser.id &&
                          (message.user.attributes.profilePhoto ? (
                            <Avatar
                              alt={message.user.attributes.username}
                              src={message.user.attributes.profilePhoto._url}
                            />
                          ) : (
                            <Avatar
                              sx={{
                                width: 25,
                                height: 25,
                                bgcolor: "secondary.main",
                                padding: 2.5,
                                color: "white",
                              }}
                            >
                              {message.user.attributes.firstName[0]}
                              {message.user.attributes.lastName[0]}
                            </Avatar>
                          ))}
                        <Box
                          sx={{
                            height: "100%",
                            width: "100%",
                            overflowWrap: "break-word",
                          }}
                        >
                          <Stack
                            direction={"column"}
                            justifyContent={"start"}
                            alignItems={"start"}
                          >
                            <Typography
                              component={"span"}
                              variant={"body2"}
                              sx={{
                                overflowWrap: "break-word",
                                height: "100%",
                              }}
                              gutterBottom
                            >
                              {message.body}
                            </Typography>
                            <Typography
                              component={"span"}
                              variant={"caption"}
                              // sx={{ overflowWrap: "break-word", height: "100%" }}
                            >
                              {`${message.createdAt.getDate()} ${getMonth(
                                message.createdAt.getMonth() + 1
                              )} ${message.createdAt.getFullYear()} at ${getTime(
                                message.createdAt
                              )}`}
                            </Typography>
                          </Stack>
                        </Box>
                        {message.user.id === localUser.id &&
                          (message.user.attributes.profilePhoto ? (
                            <Avatar
                              alt={message.user.attributes.username}
                              src={message.user.attributes.profilePhoto._url}
                            />
                          ) : (
                            <Avatar
                              sx={{
                                width: 25,
                                height: 25,
                                bgcolor: "secondary.main",
                                padding: 2.5,
                                color: "white",
                              }}
                            >
                              {message.user.attributes.firstName[0]}
                              {message.user.attributes.lastName[0]}
                            </Avatar>
                          ))}
                        {message.user.id === localUser.id && (
                          <IconButton
                            onClick={() => {
                              console.log("MESSAGE: ", message);
                              handleDeleteMessage(message.id);
                            }}
                            size="small"
                            sx={{
                              position: "relative",
                              top: -5,
                              right: -5,
                              m: 0,
                              p: 0,
                            }}
                          >
                            <CloseRounded fontSize="10" />
                          </IconButton>
                        )}
                      </Stack>
                    );
                  })}
                <Fade
                  in={messages && messages.length < 1}
                  sx={{ width: "100%" }}
                  unmountOnExit
                >
                  <Typography variant="body1">No messages</Typography>
                </Fade>
                <Fade
                  in={messages && messages.length < 1}
                  sx={{ width: "100%" }}
                  unmountOnExit
                >
                  <Stack justifyContent={"center"} alignItems={"center"}>
                    <CircularProgress
                      color="secondary"
                      size={100}
                      className={classes.loader}
                    />
                  </Stack>
                </Fade>
              </Box>
            </Box>
            <TextField
              onChange={onMessageChange}
              value={newMessage}
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
          <Button onClick={handleSendMessage}>Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chat;
