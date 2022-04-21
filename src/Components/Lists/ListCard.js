import React, {useState} from "react";
import { 
  Card,
  Typography, 
  Box, 
  Modal, 
  Fade, 
  Backdrop, 
  Tooltip,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import {setListName, deleteList} from "../../Services/listService";
import ModalForm from "../../Common/ModalForm/ModalForm";
import EditIcon from "@mui/icons-material/Edit";

const useStyles = makeStyles((theme) => ({
  listCard: {
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
    transition: "0.3s",
    width: 200,
    height: 300,
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      boxShadow: " 0 8px 16px 0 rgba(0, 0, 0, 0.2)",
    },
  },
  cardBody: {
    backgroundColor: theme.palette.secondary.main,
    display: "flex",
    flex: "1 0 auto",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "1.5em"
  },
  cardActions: {
    backgroundColor: theme.palette.secondary.main,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: "1em"
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
  editIcon: {
    borderRadius: "50%",
    width: "50px",
    height: "50px",
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
}));

// ListCard Component
const ListCard = ({ list, setErrorMessageCallback, removeListFromParentStateCallback }) => {
  const classes = useStyles();
  const [name, setName] = useState(list.attributes.name);
  const id = list.id;
  const navigate = useNavigate();

  // for edit list modal
  const [editListModalOpen, setEditListModalOpen] = useState(false);
  const handleEditListModalOpen = (event) => {
    event.stopPropagation();
    setEditListModalOpen(true);
  }
  const handleEditListModalClose = () => setEditListModalOpen(false);
  const onEditListFormSubmit = async (attrs) => {
    console.log("Handling edit list modal submit with attrs: ", attrs);
    const listName = attrs.name;
    if (attrs.delete) {
      // handle deletion request
      console.log("about to call deleteList with id: ", id);
      const rc = await deleteList(id);
      if (rc === 0) {
        // success: update parent List component state with callback
        console.log("deleted list: ", id);
        removeListFromParentStateCallback(id);
        // return here to avoid attempted state update of an
        // unmounted component at the end of this function
        return;
      } else {
        // error: alert user
        setErrorMessageCallback(`Failed to delete list: ${listName}`);
      }
    }
    else {
      // handle name change request
      const listObject = await setListName(id, listName);
      if (listObject) {
        // success: update local name state variable
        console.log("updated listObject: ", listObject);
        setName(listObject.attributes.name);
      } else {
        // error: alert user
        setErrorMessageCallback(`Failed to update list name to: ${attrs.name}`);
      }
    }
    setEditListModalOpen(false);
  }


  // display list name
  return (
    <Box>
      <Modal
        aria-labelledby="Modal for editing a list"
        aria-describedby="Modal for editing a list"
        open={editListModalOpen}
        onClose={handleEditListModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={editListModalOpen}>
          <Box className={classes.modalStyle}>
            <Box className={classes.modalTitle}>
              <Typography variant="h6">Edit List: {name}</Typography>
            </Box> 
            <Box className={classes.modalContent}>
              <ModalForm 
                formType={"EDIT_LIST_OR_GROUP"}
                onSubmit={onEditListFormSubmit}
                onClose={handleEditListModalClose}
                attributes={{name: name}}  
              />
            </Box>
          </Box>
        </Fade>
      </Modal>
      <Card
        className={classes.listCard}
        sx={{ flexGrow: 1 }}
        onClick={() => {
          navigate(`/item/${list.id}`);
        }}
      >
        <Box className={classes.cardBody}>
          <Typography variant="h1" sx={{ fontSize: 28 }}>
            {name}
          </Typography>
        </Box>
        <Box className={classes.cardActions}>
          <Tooltip
            title="Edit list"
            arrow
          >
          <Box 
            className={classes.editIcon}
            onClick={(e) => {handleEditListModalOpen(e)}}
          >
            <EditIcon 
              fontSize="medium"
            />
          </Box>
          </Tooltip>
        </Box>
      </Card>
    </Box>
  );
};

export default ListCard;
