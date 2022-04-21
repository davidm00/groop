import React from "react";
import { makeStyles } from "@mui/styles";
import { Typography, Box, CircularProgress, Stack } from "@mui/material";
import ClickableAvatarList from "../ClickableAvatarList/ClickableAvatarList";

const useStyles = makeStyles((theme) => ({
  loader: {
    transition: "0.3s all",
    zIndex: 5,
  },
  avatarsContainer: {
    marginTop: "-1em",
    padding: "0.3em 1em 0.3em 1em",
    borderRadius: "1.2em",
    backgroundColor: "white",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
    "&:hover": {
      boxShadow: " 0 8px 16px 0 rgba(0, 0, 0, 0.2)",
    },
  },
  pageHeader: {
    marginLeft: "13%",
    marginRight: "13%",
    marginTop: "4em",
    marginBottom: "2em",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

const PageHeader = ({
  pageTitle,
  pageSubtitle,
  groupMembers,
  showGroupMembers,
}) => {
  const classes = useStyles();

  return (
    <Box>
      <div className={classes.pageHeader}>
        {pageTitle ? (
          <Stack>
            <Typography
              variant="h1"
              sx={{ fontSize: 28, width: "100%", mr: "10vw" }}
              gutterBottom
              align={"left"}
            >
              {pageTitle}
            </Typography>
            {pageSubtitle && (
              <Typography
                variant="h1"
                sx={{ fontSize: 14, width: "100%" }}
                gutterBottom
                align={"left"}
              >
                Shareable Group ID: {pageSubtitle}
              </Typography>
            )}
          </Stack>
        ) : (
          <CircularProgress
            color="secondary"
            size={"1.5em"}
            className={classes.loader}
          />
        )}
        {showGroupMembers && (
          <Box className={classes.avatarsContainer}>
            <ClickableAvatarList
              users={groupMembers}
              modalTitle={"Group Members"}
              stringIfNoUsers={"No Group Members"}
            />
          </Box>
        )}
      </div>
    </Box>
  );
};

export default PageHeader;
