import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  Box,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

import PageHeader from "../../Common/PageHeader/PageHeader";
import GroupCard from "./GroupCard";
import { getUsersGroups, joinGroup } from "../../Services/groupService";

const useStyles = makeStyles(() => ({
  groupGrid: {
    margin: 20,
    width: "100%",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 300px))",
    gridTemplateRows: "repeat(auto-fill, minmax(200px, 300px))",
    display: "grid",
    justifyContent: "center",
    alignContent: "end",
    gridGap: 10,
  },
  groupsPage: {
    display: "flex",
    flexDirection: "column",
    marginTop: "3em",
  },
}));

// Parent Component of GroupCards
const Groups = () => {
  const classes = useStyles();
  const [groups, setGroups] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [joinID, setJoinID] = useState("");
  const { state } = useLocation();
  const gRef = useRef(null);

  const handleChange = (event) => {
    setJoinID(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    joinGroup(joinID).then((res) => {
      handleClose();
      let temp = groups;
      temp = [...temp, res];
      setGroups(temp);
    });
  };

  useEffect(() => {
    if (!gRef.current && !state) {
      // fetch groups via Parse init
      getUsersGroups().then((res) => {
        setGroups(res);
        gRef.current = true;
      });
    }
  }, [state]);

  useEffect(() => {
    if (state && state.leave) {
      // fetch groups via Parse after leaving a group
      getUsersGroups().then((res) => {
        let temp = res;
        temp = temp.filter((group) => group.id !== state.leave);
        setGroups(temp);
        state.leave = null;
      });
    }
  }, [groups, state]);

  // render the groups
  return (
    <Box className={classes.groupsPage} sx={{ flexGrow: 1 }}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"start"}
        spacing={2}
        sx={{ flexGrow: 1, ml: 20, mr: 20 }}
      >
        <PageHeader
          pageTitle={"Your Groups"}
          groupMembers={null}
          showGroupMembers={false}
        />
        <Box sx={{ flexGrow: 1 }}></Box>
        <Button variant="standard" onClick={() => handleOpen()}>
          Join a Group!
        </Button>
      </Stack>
      <Box sx={{ flexGrow: 1 }} className={classes.groupGrid}>
        {groups.map((group) => {
          return <GroupCard key={group.id} group={group} />;
        })}
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Join A Group!{" "}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "secondary.dark",
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText color={"text.primary"}>
            Enter group ID to join a new group.
          </DialogContentText>
          <TextField
            autoFocus
            id="groupId"
            label="Group ID"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button variant={"submit"} onClick={(e) => handleJoin(e)}>
            Join
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Groups;
