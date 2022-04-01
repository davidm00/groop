import React from "react";
import { CardContent, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  listCard: {
    backgroundColor: theme.palette.secondary.main,
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

// ListCard Component
const ListCard = ({ list }) => {
  const classes = useStyles();
  const { name } = list.attributes;
  const navigate = useNavigate();

  // display list name
  return (
    <Box
      className={classes.listCard}
      sx={{ flexGrow: 1 }}
      onClick={() => {
        navigate(`/item/${list.id}`);
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

export default ListCard;
