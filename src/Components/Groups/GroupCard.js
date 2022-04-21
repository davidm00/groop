import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
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
import ModalForm from "../../Common/ModalForm/ModalForm";
import EditIcon from "@mui/icons-material/Edit";
import {setGroupName, deleteGroup} from "../../Services/groupService";

const useStyles = makeStyles((theme) => ({
  groupCard: {
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

// GroupCard Component
const GroupCard = ({ group, setErrorMessageCallback, removeGroupFromParentStateCallback, showEditIcon }) => {
  const classes = useStyles();
  const [name, setName] = useState(group.attributes.name);
  let navigate = useNavigate();

  // for edit group modal
  const [editGroupModalOpen, setEditGroupModalOpen] = useState(false);
  const handleEditGroupModalOpen = (event) => {
    event.stopPropagation();
    setEditGroupModalOpen(true);
  }
  const handleEditGroupModalClose = () => setEditGroupModalOpen(false);
  const onEditGroupFormSubmit = async (attrs) => {
    console.log("Handling edit group modal submit with attrs: ", attrs);
    const groupName = attrs.name;
    if (attrs.delete) {
      // handle deletion request
      console.log("about to call deleteGroup with id: ", group.id);
      const rc = await deleteGroup(group.id);
      if (rc === 0) {
        // success: update parent Groups component state with callback
        console.log("deleted group: ", group.id);
        removeGroupFromParentStateCallback(group.id);
        // return here to avoid attempted state update of an
        // unmounted component at the end of this function
        return;
      } else {
        // error: alert user
        setErrorMessageCallback(`Failed to delete group: ${groupName}`);
      }
    }
    else {
      // handle name change request
      const groupObject = await setGroupName(group.id, groupName);
      if (groupObject) {
        // success: update local name state variable
        console.log("updated groupObject: ", groupObject);
        setName(groupObject.attributes.name);
      } else {
        // error: alert user
        setErrorMessageCallback(`Failed to update list name to: ${attrs.name}`);
      }
    }
    setEditGroupModalOpen(false);
  }

  return ( 
    <Box>
      <Modal
        aria-labelledby="Modal for editing a group"
        aria-describedby="Modal for editing a group"
        open={editGroupModalOpen}
        onClose={handleEditGroupModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={editGroupModalOpen}>
          <Box className={classes.modalStyle}>
            <Box className={classes.modalTitle}>
              <Typography variant="h6">Edit Group: {name}</Typography>
            </Box> 
            <Box className={classes.modalContent}>
              <ModalForm 
                formType={"EDIT_GROUP"}
                onSubmit={onEditGroupFormSubmit}
                onClose={handleEditGroupModalClose}
                attributes={{name: name}}  
              />
            </Box>
          </Box>
        </Fade>
      </Modal>
      <Card
        className={classes.groupCard}
        sx={{ flexGrow: 1 }}
        onClick={() => {
          navigate(`/list/${group.id}`, {state: {...group.attributes, id: group.id}});
        }}
      >
        <Box className={classes.cardBody}>
          <Typography variant="h1" sx={{ fontSize: 28 }}>
            {name}
          </Typography>
        </Box>
        { showEditIcon &&
        <Box className={classes.cardActions}>
          <Tooltip
            title="Edit group"
            arrow
          >
          <Box 
            className={classes.editIcon}
            onClick={(e) => {handleEditGroupModalOpen(e)}}
          >
            <EditIcon 
              fontSize="medium"
            />
          </Box>
          </Tooltip>
        </Box>
        }
      </Card>
    </Box>
  );
};

export default GroupCard;
