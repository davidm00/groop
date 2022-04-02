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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const useStyles = makeStyles((theme) => ({
  loader: {
    transition: "0.3s all",
    zIndex: 5,
  },
  avatarsContainer: {
    marginRight: "2em",
    padding: "0.3em 1em 0.3em 1em",
    borderRadius: "1.2em",
    backgroundColor: "white",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
    "&:hover": {
      boxShadow: " 0 8px 16px 0 rgba(0, 0, 0, 0.2)",
    },
  },
  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: "1em",
  },
  modalStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 350,
    backgroundColor: "white",
    color: theme.palette.text.primary,
    p: 4,
    borderRadius: "0.5em",
    padding: "1em",
  },
  closeButtonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "-2em",
  },
  closeButton: {
    backgroundColor: "darkGray",
    color: "white",
    borderRadius: "50%",
    boxShadow: " 0 2px 4px 0 rgba(0, 0, 0, 0.2)",
    "&:hover": {
      backgroundColor: "gray",
    },
  },
}));

const PageHeader = ({ pageTitle, groupMembers }) => {
  const classes = useStyles();
  const theme = useTheme();
  // for group members modal
  const noOp = () => {};
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    groupMembers && groupMembers.length > 0 ? setOpen(true) : noOp();
  };
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <div>
        <Modal
          aria-labelledby="Group Members Modal"
          aria-describedby="A list of the current members in this group"
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
              <Box>
                <Typography align="center" variant="h6">
                  Group Members
                </Typography>
                <Box className={classes.closeButtonContainer}>
                  <CloseIcon
                    className={classes.closeButton}
                    fontSize="small"
                    onClick={handleClose}
                  />
                </Box>
              </Box>
              <MuiList
                sx={{ maxHeight: 250, overflow: "auto", paddingTop: "1em" }}
              >
                {groupMembers &&
                  groupMembers.map((member) => {
                    return member.attributes.profilePhoto ? (
                      <ListItem key={member}>
                        <ListItemAvatar>
                          <Avatar
                            alt={member.attributes.username}
                            key={member.email}
                            src={member.attributes.profilePhoto._url}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            member.attributes.firstName +
                            " " +
                            member.attributes.lastName
                          }
                        />
                      </ListItem>
                    ) : (
                      <ListItem key={member}>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: theme.palette.secondary.main,
                              color: "white",
                            }}
                            alt={member.attributes.username}
                            key={member.email}
                          >
                            {member.attributes.firstName[0] +
                              member.attributes.lastName[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            member.attributes.firstName +
                            " " +
                            member.attributes.lastName
                          }
                        />
                      </ListItem>
                    );
                  })}
              </MuiList>
            </Box>
          </Fade>
        </Modal>
      </div>
      <div className={classes.pageHeader}>
        <Typography
          variant="h1"
          sx={{ fontSize: 28, padding: 5, width: "50%" }}
          gutterBottom
          align={"left"}
        >
          {pageTitle}
        </Typography>
        <div className={classes.avatarsContainer} onClick={handleOpen}>
          {groupMembers ? (
            <AvatarGroup max={4}>
              {groupMembers.length > 0 ? (
                groupMembers.map((member) => {
                  console.log("Member Attributes: ", member.attributes);
                  return member.attributes.profilePhoto ? (
                    <Tooltip
                      title={
                        member.attributes.firstName +
                        " " +
                        member.attributes.lastName
                      }
                      arrow
                    >
                      <Avatar
                        sx={{ width: "1.5em", height: "1.5em" }}
                        alt={member.attributes.username}
                        key={member.email}
                        src={member.attributes.profilePhoto._url}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title={
                        member.attributes.firstName +
                        " " +
                        member.attributes.lastName
                      }
                      arrow
                    >
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.secondary.main,
                          color: theme.palette.primary.light,
                          width: "1.5em",
                          height: "1.5em",
                        }}
                        alt={member.attributes.username}
                        key={member.email}
                      >
                        {member.attributes.firstName[0] +
                          member.attributes.lastName[0]}
                      </Avatar>
                    </Tooltip>
                  );
                })
              ) : (
                <>No Group Members</>
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
      </div>
    </Box>
  );
};

export default PageHeader;
