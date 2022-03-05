import React from "react";
import { useNavigate } from "react-router-dom";
import { CardContent, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  groupCard: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.text.primary,
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
    transition: "0.3s",
    width: 200,
    height: 300,
    "&:hover": {
      boxShadow: " 0 8px 16px 0 rgba(0, 0, 0, 0.2)",
    },
  },
}));

// GroupCard Component
const GroupCard = ({ group }) => {
  const classes = useStyles();
  const { name } = group.attributes;
  let navigate = useNavigate();

  // display group
  return (
    <Box
      className={classes.groupCard}
      sx={{ flexGrow: 1 }}
      onClick={() => {
        navigate(`/list/${group.id}`);
      }}
    >
      <CardContent>
        <Typography variant="h1" sx={{ fontSize: 28 }} gutterBottom align={'center'}>
          {name}
        </Typography>
      </CardContent>
    </Box>
  );
};

export default GroupCard;
