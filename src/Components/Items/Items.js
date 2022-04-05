import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Typography, Box } from "@mui/material";
import {
  getAllItemsInList,
  getGroupIdByListId,
} from "../../Services/itemService";
import { getAllGroupMembers } from "../../Services/listService";
import PageHeader from "../../Common/PageHeader/PageHeader";

const useStyles = makeStyles(() => ({
  margin: {
    marginTop: "5em",
    marginLeft: "5em",
  },
}));

const Items = () => {
  const [items, setItems] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [groupMembers, setGroupMembers] = useState(null);
  const params = useParams();
  const classes = useStyles();

  useEffect(() => {
    getAllItemsInList(params.listId).then((res) => {
      console.log("Items in Items Component: ", res);
      setItems(res);
    });
  }, [params]);

  // get the groupId of the group to which this item belongs
  useEffect(() => {
    getGroupIdByListId(params.listId).then((res) => {
      console.log(`Got groupId ${res} from listId`);
      setGroupId(res);
    });
  }, [params]);

  // retrieve group members in the group to which this item belongs
  useEffect(() => {
    if (groupId) {
      getAllGroupMembers(groupId).then((res) => {
        console.log("Got group members in Items component");
        setGroupMembers(res);
      });
    }
  }, [params, groupId]);

  // TODO: Future work - Make table for items and built out this page
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="start"
      sx={{ padding: "5rem", flexGrow: 1 }}
    >
      <PageHeader pageTitle={"Items Component"} groupMembers={groupMembers} />
      <Box className={classes.margin}>
        {items && items.length > 0 ? (
          items.map((item) => {
            return (
              <Typography key={item.id}>{item.attributes.name}</Typography>
            );
          })
        ) : (
          <Typography>No items in this list.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Items;
