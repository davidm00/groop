import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  getAllLists,
  getAllGroupMembers,
  getGroupNameByGroupId,
  createList
} from "../../Services/listService";
import { makeStyles } from "@mui/styles";
import { Typography, Box, CircularProgress } from "@mui/material";
import ListCard from "./ListCard";
import PageHeader from "../../Common/PageHeader/PageHeader";
import Chat from "../Chat/Chat";
import ModalForm from "../../Common/ModalForm/ModalForm";
import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  AlertTitle,
  Fade,
  Modal,
  Backdrop,
  Tooltip
} from "@mui/material";

const useStyles = makeStyles((theme) => ({
  listGrid: {
    margin: 20,
    width: "100%",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 300px))",
    gridTemplateRows: "repeat(auto-fill, minmax(200px, 300px))",
    display: "grid",
    justifyContent: "center",
    alignContent: "end",
    gridGap: 10,
    transition: "0.3s all",
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
  listsPage: {
    display: "flex",
    flexDirection: "column",
    marginTop: "3em",
  }
}));

// List Component
const List = (group) => {
  const [lists, setLists] = useState(null);
  const [groupMembers, setGroupMembers] = useState(null);
  const [groupName, setGroupName] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const classes = useStyles();
  const params = useParams();
  const { state } = useLocation();
  console.log("State: ", state);

  useEffect(() => {
    // Get all lists in a specific group
    getAllLists(params.groupId).then((res) => {
      console.log(`${params.groupId} Lists: `, res);
      setLists(res);
    });
  }, [params, state]);

  useEffect(() => {
    console.log("getting group members in Lists component");
    getAllGroupMembers(params.groupId).then((res) => {
      setGroupMembers(res);
    });
  }, [params]);

  // get group name from groupId
  useEffect(() => {
    getGroupNameByGroupId(params.groupId).then((res) => {
      setGroupName(res);
    });
  }, [params, state]);

  // for create list modal
  const [createListModalOpen, setCreateListModalOpen] = useState(false);
  const handleCreateListModalOpen = () => setCreateListModalOpen(true);
  const handleCreateListModalClose = () => setCreateListModalOpen(false);
  const onCreateListFormSubmit = async (attrs) => {
    console.log("Handling create list modal submit with attrs: ", attrs);
    const listName = attrs.name;
    const listObject = await createList(listName, params.groupId);
    if (listObject !== null) {
      // success: update local lists state variable
      console.log("new listObject: ", listObject);
      setLists([...lists, listObject]);
    } else {
      // error: alert user
      setErrorMessage(`Failed to create new list: ${attrs.name}`);
    }
    setCreateListModalOpen(false)
  }

  // callback for ListCard to use to set the error message if necessary
  const setErrorMessageCallback = (errorMessage) => {
    setErrorMessage(errorMessage);
  }

  // callback for ListCard to remove a list from the local state if necessary
  const removeListFromListsArray = (listId) => {
    setLists(lists.filter(list => (list.id !== listId)));
  }

  return (
    <Box
      className={classes.listsPage}
      sx={{ flexGrow: 1 }}
    >
      <Modal
        aria-labelledby="Modal for creating a list"
        aria-describedby="Modal for creating a list"
        open={createListModalOpen}
        onClose={handleCreateListModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={createListModalOpen}>
          <Box className={classes.modalStyle}>
            <Box className={classes.modalTitle}>
              <Typography variant="h6">Create a New List</Typography>
            </Box> 
            <Box className={classes.modalContent}>
                
              <ModalForm 
                formType={"CREATE_LIST"}
                onSubmit={onCreateListFormSubmit}
                onClose={handleCreateListModalClose}
                attributes={null}  
              />
            </Box>
          </Box>
        </Fade>
      </Modal>
      <PageHeader
        pageTitle={groupName}
        pageSubtitle={params.groupId}
        groupMembers={groupMembers}
        showGroupMembers={true}
        groupId={params.groupId}
      />
      {lists ? (
        <Box sx={{ flexGrow: 1 }} className={classes.listGrid}>
          {lists.length > 0 ? (
            lists.map((list) => {
              return (
              <ListCard 
                key={list.id} 
                list={list} 
                setErrorMessageCallback={setErrorMessageCallback} 
                removeListFromParentStateCallback={removeListFromListsArray}
              />);
            })
          ) : (
            <Box sx={{ flexGrow: 1, width: "100%" }}>
              <Typography variant="h4" align={"left"} fontSize={24}>
                No lists in this group.
              </Typography>
            </Box>
          )}
          <Box className={classes.centered}>
            <Tooltip
              title="Create a new list"
            >
            <Box 
              className={classes.addIcon}
              onClick={handleCreateListModalOpen}
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
      <Chat data={state}/>
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
    </Box>
  );
};

export default List;
