import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllLists, getAllGroupMembers } from "../../Services/listService";
import { makeStyles, useTheme } from "@mui/styles";
import { Typography, Box, CircularProgress, Avatar, AvatarGroup, Tooltip } from "@mui/material";

import ListCard from "./ListCard";

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
  avatarsContainer: {
    // border: "1px solid",
    marginRight: "2em",
    padding: "0.3em 1em 0.3em 1em",
    borderRadius: "1.2em",
    backgroundColor: theme.palette.primary.light,
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}));

// List Component
const List = () => {
  const [lists, setLists] = useState(null);
  const [groupMembers, setGroupMembers] = useState(null);
  const classes = useStyles();
  const params = useParams();
  const theme = useTheme();

  useEffect(() => {
    // Get all lists in a specific group
    getAllLists(params.groupId).then((res) => {
      console.log(`${params.groupId} Lists: `, res);
      setLists(res);
    });
  }, [params.groupId]);

  useEffect(() => {
    getAllGroupMembers(params.groupId).then((res) => {
      setGroupMembers(res);
    });
  }, [params.groupId])

  // display list
  return (
    <Box sx={{ flexGrow: 1 }}>
      <div className={classes.pageHeader}>
        <Typography
          variant="h1"
          sx={{ fontSize: 28, padding: 5, width: '50%' }}
          gutterBottom
          align={"left"}
        >
          List Component
        </Typography>
        <div className={classes.avatarsContainer}>
          {groupMembers ? (
            <AvatarGroup max={4}>
            {
            groupMembers.length > 0 ? 
              groupMembers.map((member) => {
              //return <li key={member.attributes.username}>{member.attributes.firstName + " " + member.attributes.lastName}</li>;
              console.log("Member Attributes: ", member.attributes);
              return (member.attributes.profilePhoto) ? 
              (
              <Tooltip title={member.attributes.firstName + " " + member.attributes.lastName} arrow>
                <Avatar sx={{width: '1.5em', height: '1.5em'}} alt={member.attributes.username} key={member.email} src={member.attributes.profilePhoto._url} />
              </Tooltip>
              )
              : 
              (
              <Tooltip title={member.attributes.firstName + " " + member.attributes.lastName} arrow>
                <Avatar sx={{bgcolor: theme.palette.secondary.main, color: theme.palette.primary.light, width: '1.5em', height: '1.5em'}} alt={member.attributes.username} key={member.email}>{member.attributes.firstName[0] + member.attributes.lastName[0]}</Avatar>
              </Tooltip>
              )
            

            }) : <>No Group Members</>
            }
            </AvatarGroup>)
            :
            (
            <CircularProgress
              color="secondary"
              size={'1.5em'}
              className={classes.loader}
            />
            )
          }
        </div>
      </div>
      {lists ? (
        <Box sx={{ flexGrow: 1 }} className={classes.listGrid}>
          {lists.length > 0 ? (
            lists.map((list) => {
              return <ListCard key={list.id} list={list} />;
            })
          ) : (
            <Box sx={{ flexGrow: 1, width: "100%" }}>
              <Typography variant="h4" align={"left"} fontSize={24}>No lists in this group.</Typography>
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