import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAllLists,
  getAllGroupMembers,
  getGroupNameByGroupId,
} from "../../Services/listService";
import { makeStyles } from "@mui/styles";
import { Typography, Box, CircularProgress } from "@mui/material";
import ListCard from "./ListCard";
import PageHeader from "../../Common/PageHeader/PageHeader";

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
}));

// List Component
const List = () => {
  const [lists, setLists] = useState(null);
  const [groupMembers, setGroupMembers] = useState(null);
  const [groupName, setGroupName] = useState(null);
  const classes = useStyles();
  const params = useParams();

  useEffect(() => {
    // Get all lists in a specific group
    getAllLists(params.groupId).then((res) => {
      console.log(`${params.groupId} Lists: `, res);
      setLists(res);
    });
  }, [params]);

  useEffect(() => {
    getAllGroupMembers(params.groupId).then((res) => {
      setGroupMembers(res);
    });
  }, [params]);

  // get group name from groupId
  useEffect(() => {
    getGroupNameByGroupId(params.groupId).then((res) => {
      setGroupName(res);
    });
  }, [params]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="start"
      sx={{ padding: "5rem", flexGrow: 1 }}
    >
      <PageHeader
        pageTitle={groupName}
        groupMembers={groupMembers}
        showGroupMembers={true}
      />
      {lists ? (
        <Box sx={{ flexGrow: 1 }} className={classes.listGrid}>
          {lists.length > 0 ? (
            lists.map((list) => {
              return <ListCard key={list.id} list={list} />;
            })
          ) : (
            <Box sx={{ flexGrow: 1, width: "100%" }}>
              <Typography variant="h4" align={"left"} fontSize={24}>
                No lists in this group.
              </Typography>
            </Box>
          )}
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
    </Box>
  );
};

export default List;
