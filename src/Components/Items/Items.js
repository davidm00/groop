import React from 'react';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Typography, Box } from "@mui/material";
import { getAllItemsInList } from '../../Services/itemService';

const useStyles = makeStyles(() => ({
    margin: {
      marginTop: '5em',
      marginLeft: '5em',
    },
}));


const Items = (listId) => {

    const [items, setItems] = useState(null);
    const params = useParams();
    const classes = useStyles();

    useEffect(() => {
        getAllItemsInList(params.listId).then((res) => {
            console.log("Items in Items Component: ", res);
            setItems(res);
        })
    }, [params]);
    

    return (
        <Box>
            <Typography
            variant="h1"
            sx={{ fontSize: 28, padding: 5, width: '50%' }}
            gutterBottom
            align={"left"}
            >
            Items Component
            </Typography>
            <Box className={classes.margin}>
                {(items && items.length > 0) ? 
                (
                    items.map((item) => {
                        return (
                            <Typography key={item.id}>
                                {item.attributes.name}
                            </Typography>
                        );
                    })
                ) : 
                (
                    <Typography>
                        No items in this list.
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

export default Items;