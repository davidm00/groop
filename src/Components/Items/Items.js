import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import {
  getGroupIdByListId,
  getListNameByListId,
} from "../../Services/itemService";
import { getAllGroupMembers } from "../../Services/listService";
import PageHeader from "../../Common/PageHeader/PageHeader";
import ItemTable from "./ItemTable";

const useStyles = makeStyles(() => ({
  itemTableContainer: {
    marginTop: "1em",
    marginLeft: "13%",
    marginRight: "13%"
  },
  itemPage: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginTop: "3em"
  }
}));

const Items = () => {
  const [groupId, setGroupId] = useState(null);
  const [groupMembers, setGroupMembers] = useState(null);
  const [listName, setListName] = useState(null);
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
      className={classes.itemPage}
      sx={{ flexGrow: 1 }}
    >
      <PageHeader
        pageTitle={listName}
        groupMembers={groupMembers}
        showGroupMembers={true}
      />
      <Box className={classes.itemTableContainer}>
        <ItemTable listId={params.listId} />
      </Box>
    </Box>
  );
};

export default Items;
