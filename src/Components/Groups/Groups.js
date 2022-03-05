import React from 'react';
import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Typography, Box } from "@mui/material";

import GroupCard from "./GroupCard";

import { getAllGroups } from "../../Services/groupService";

const useStyles = makeStyles(() => ({
  groupGrid: {
    margin: 20,
    width: '100%',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 300px))',
    gridTemplateRows: 'repeat(auto-fill, minmax(200px, 300px))',
    display: 'grid',
    justifyContent: 'center',
    alignContent: 'end',
    gridGap: 10,
  },
}))

// Parent Component of GroupCards
const Groups = () => {
  const classes = useStyles();
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    // fetch groups via Parse
    getAllGroups().then((res) => {
      console.log(`Groups: `, res);
      setGroups(res);
    });
  }, []);

  // render the groups
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h1" sx={{ fontSize: 28, padding: 5 }} gutterBottom align={'left'}>
      Groups Component
        </Typography>
      <Box sx={{ flexGrow: 1 }} className={classes.groupGrid}>
        {groups.map((group) => {
          return <GroupCard key={group.id} group={group} />;
        })}
      </Box>
    </Box>
  );
};

export default Groups;
