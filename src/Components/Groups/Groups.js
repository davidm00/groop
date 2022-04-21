import React from "react";
import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import PageHeader from "../../Common/PageHeader/PageHeader";

import GroupCard from "./GroupCard";

import { getUsersGroups } from "../../Services/groupService";

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
    marginTop: "3em"
  }
}));

// Parent Component of GroupCards
const Groups = () => {
  const classes = useStyles();
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    // fetch groups via Parse
    getUsersGroups().then((res) => {
      console.log(`Groups: `, res);
      setGroups(res);
    });
  }, []);

  // render the groups
  return (
    <Box
      className={classes.groupsPage}
      sx={{ flexGrow: 1 }}
    >
      <PageHeader
        pageTitle={"Your Groups"}
        groupMembers={null}
        showGroupMembers={false}
      />
      <Box sx={{ flexGrow: 1 }} className={classes.groupGrid}>
        {groups.map((group) => {
          return <GroupCard key={group.id} group={group} />;
        })}
      </Box>
    </Box>
  );
};

export default Groups;
