import React from "react";
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
import PageHeader from "../../Common/PageHeader/PageHeader";

import GroupCard from "./GroupCard";

import { getUsersGroups } from "../../Services/groupService";
import { Close } from "@mui/icons-material";

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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // fetch groups via Parse
    getUsersGroups().then((res) => {
      console.log(`Groups: `, res);
      setGroups(res);
    });
  }, []);

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
              color: 'secondary.dark',
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
            sx={{mt: 2}}
          />
        </DialogContent>
        <DialogActions>
          <Button variant={"submit"} onClick={handleClose}>
            Join
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Groups;
