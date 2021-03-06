import React, { useRef } from "react";
import { useEffect, useState, useContext } from "react";
import { makeStyles } from "@mui/styles";
import { 
  Box, 
  Alert,
  Modal,
  Fade,
  Typography,
  Backdrop,
  AlertTitle,
  CircularProgress,
  Tooltip,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions
} from "@mui/material";
import PageHeader from "../../Common/PageHeader/PageHeader";
import { UserContext } from "../../Context/userContext";
import GroupCard from "./GroupCard";
import { getUsersGroups, createGroup, joinGroup } from "../../Services/groupService";
import ModalForm from "../../Common/ModalForm/ModalForm";
import AddIcon from "@mui/icons-material/Add";
import { Close } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
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
    marginTop: "3em"
  },
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
    backgroundColor: "white",
    color: theme.palette.text.primary,
    p: 4,
    borderRadius: "0.5em",
    padding: "1em",
  },
  modalTitle: {
    marginLeft: "10%",
    maxWidth: "80%",
    textAlign: "center"
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "90%",
    marginLeft: "5%",
  }, 
  addIcon: {
    borderRadius: "50%",
    width: "80px",
    height: "80px",
    backgroundColor: theme.palette.primary.light,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
    transition: "0.3s",
    "&:hover": {
      boxShadow: " 0 8px 16px 0 rgba(0, 0, 0, 0.4)",
      cursor: "pointer",
    },
  },
  centered: {
    width: 200,
    height: 300,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
}));

// Parent Component of GroupCards
const Groups = () => {
  const classes = useStyles();
  const [groups, setGroups] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [joinID, setJoinID] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { localUser} = useContext(UserContext);
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
    console.log("STATE")
    if (!gRef.current && !state) {
      // fetch groups via Parse init
      getUsersGroups().then((res) => {
        setGroups(res);
        gRef.current = true;
      });
    }
    if (state && state === 'back') {
      console.log("BACK")
      // fetch groups via Parse after back
      getUsersGroups().then((res) => {
        setGroups(res);
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

  // for create group modal
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const handleCreateGroupModalOpen = () => setCreateGroupModalOpen(true);
  const handleCreateGroupModalClose = () => setCreateGroupModalOpen(false);
  const onCreateGroupFormSubmit = async (attrs) => {
    console.log("Handling create group modal submit with attrs: ", attrs);
    const groupName = attrs.name;
    const groupObject = await createGroup(groupName, localUser.id);
    if (groupObject !== null) {
      // success: update local groups state variable
      console.log("new groupObject: ", groupObject);
      setGroups([...groups, groupObject]);
    } else {
      // error: alert user
      setErrorMessage(`Failed to create new list: ${attrs.name}`);
    }
    setCreateGroupModalOpen(false);
  }

  // callback for GroupCard to use to set the error message if necessary
  const setErrorMessageCallback = (errorMessage) => {
    setErrorMessage(errorMessage);
  }

  // callback for ListCard to remove a list from the local state if necessary
  const removeGroupFromGroupsArray = (groupId) => {
    setGroups(groups.filter(group => (group.id !== groupId)));
  }

  // render the groups
  return (
    <Box
      className={classes.groupsPage}
      sx={{ flexGrow: 1 }}
    >
      <Modal
        aria-labelledby="Modal for creating a group"
        aria-describedby="Modal for creating a group"
        open={createGroupModalOpen}
        onClose={handleCreateGroupModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={createGroupModalOpen}>
          <Box className={classes.modalStyle}>
            <Box className={classes.modalTitle}>
              <Typography variant="h6">Create a New Group</Typography>
            </Box> 
            <Box className={classes.modalContent}>
              <ModalForm 
                formType={"CREATE_GROUP"}
                onSubmit={onCreateGroupFormSubmit}
                onClose={handleCreateGroupModalClose}
                attributes={null}  
              />
            </Box>
          </Box>
        </Fade>
      </Modal>
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
      {groups ? (
        <Box sx={{ flexGrow: 1 }} className={classes.groupGrid}>
          {groups.length > 0 ? (
            groups.map((group) => {
              return <GroupCard 
                  key={group.id} group={group} 
                  setErrorMessageCallback={setErrorMessageCallback}
                  removeGroupFromParentStateCallback={removeGroupFromGroupsArray}
                  showEditIcon={localUser.id === (group.attributes.createdBy ? group.attributes.createdBy.id : -1)}
                />;
            })
          ) : (
              <Box sx={{ flexGrow: 1, width: "100%" }}>
                <Typography variant="h4" align={"left"} fontSize={24}>
                  No groups.
                </Typography>
              </Box>
          )}
          <Box className={classes.centered}>
            <Tooltip
              title="Create a new group"
            >
            <Box 
              className={classes.addIcon}
              onClick={handleCreateGroupModalOpen}
            >
              <AddIcon 
                fontSize="large"
              />
            </Box>
            </Tooltip>
          </Box>
        </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              paddingTop: 20,
            }}
          >
            <CircularProgress
              color="secondary"
              size={100}
              className={classes.loader}
            />
          </Box>
        )}
      {errorMessage && (
        <Alert
          severity="error"
          onClose={() => {
            setErrorMessage(null);
          }}
        >
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </Alert>
      )}
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
