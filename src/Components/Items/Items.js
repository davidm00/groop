import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import {
  getGroupIdByListId,
  getListNameByListId,
} from "../../Services/itemService";
import { getAllGroupMembers } from "../../Services/listService";
import PageHeader from "../../Common/PageHeader/PageHeader";
import ItemTable from "./ItemTable";
import Chat from "../Chat/Chat";

const useStyles = makeStyles(() => ({
  margin: {
    marginTop: "2em",
    marginLeft: "13%",
    marginRight: "13%",
  },
}));

const Items = () => {
  const [groupId, setGroupId] = useState(null);
  const [groupMembers, setGroupMembers] = useState(null);
  const [listName, setListName] = useState(null);
  const { state } = useLocation();
  console.log("ITEM STATE: ", state)
  const params = useParams();
  const classes = useStyles();

  // get the groupId of the group to which this item belongs
  useEffect(() => {
    getGroupIdByListId(params.listId).then((res) => {
      setGroupId(res);
    });
  }, [params]);

  // retrieve group members in the group to which this item belongs
  useEffect(() => {
    if (groupId) {
      getAllGroupMembers(groupId).then((res) => {
        setGroupMembers(res);
      });
    }
  }, [params, groupId]);

  // get list name from listId
  useEffect(() => {
    getListNameByListId(params.listId).then((res) => {
      setListName(res);
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
        pageTitle={listName}
        groupMembers={groupMembers}
        showGroupMembers={true}
      />
      <Box className={classes.margin}>
        <ItemTable listId={params.listId} />
      </Box>
      <Chat data={state} />
    </Box>
  );
};

export default Items;
