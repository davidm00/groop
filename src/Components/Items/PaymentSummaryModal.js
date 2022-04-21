import React, {useEffect, useState} from "react";
import {
    Modal,
    Fade,
    Box,
    Typography,
    Button,
    Backdrop,
    List as MuiList,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText
} from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
const useStyles = makeStyles((theme) => ({
    loader: {
      transition: "0.3s all",
      zIndex: 5,
    },
    modalStyle: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "450px",
      maxHeight: "550px",
      backgroundColor: "white",
      color: theme.palette.text.primary,
      p: 4,
      borderRadius: "0.5em",
      padding: "1em",
    },
    centered: {
        display: "flex",
        flexDirection: "row",
          justifyContent: "center",
    },
    modalTitle: {
      maxWidth: "80%"
    },
    paymentInfoContainer: {
        marginLeft: "10%",
        marginRight: "5%"
    },
    paymentInfoField: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    }
}));


const PaymentSummaryModal = ({open, rows, onClose, groupMembers, update}) => {
    const theme = useTheme();
    const classes = useStyles();
    const [userData, setUserData] = useState(null);
    console.log("rows in payment modal: ", rows);

    useEffect(() => {
        console.log("updating payment modal with update boolean: ", update);
        if (!rows || !groupMembers) {
            return;
        }
        let theUserData = {};
        for (let i = 0; i < groupMembers.length; i++) {
            console.log("user: ", groupMembers[i]);
            theUserData[groupMembers[i].id] = {
                amountPaid: 0,
                stake: 0,
                difference: 0,
                owesMoney: false
            }
        }
        console.log("theUserData before filling it: ", theUserData);
        // parse rows object and create userData summary
        for (const [, itemInfo] of Object.entries(rows)) {
            // key is an item id, value has a lot of extra info -- just grab the relevant stuff
            if (itemInfo.purchased) {
                // item was purchased, grab the relevant info
                theUserData[itemInfo.purchaserId].amountPaid += itemInfo.quantity * itemInfo.price;
                // add to the stake of every user in the splitAmong relation
                for (let i = 0; i < itemInfo.splitAmong.length; i++) {
                    let desirer = itemInfo.splitAmong[i];
                    // amount added is (price * quantity) / number of desirers
                    theUserData[desirer.id].stake += (itemInfo.price * itemInfo.quantity) / itemInfo.splitAmong.length;
                }
            }
        }
        for (let i = 0; i < Object.keys(theUserData).length; i++) {
            // calculate the difference between amount paid and stake
            const key = Object.keys(theUserData)[i];
            let info = theUserData[key];
            if (info.amountPaid > info.stake) {
                const difference = info.amountPaid - info.stake;
                theUserData[key].difference = difference;
                continue;
            } else if (info.amountPaid < info.stake) {
                const difference = info.stake - info.amountPaid;
                theUserData[key].difference = difference;
                theUserData[key].owesMoney = true;
            }
        }
        console.log("setting userData as: ", theUserData);
        setUserData({...theUserData});
    }, [rows, groupMembers, update]);


    return (
        <Modal
          aria-labelledby="Modal showing payment summary info"
          aria-describedby="Payment summary info"
          open={open}
          onClose={onClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box className={classes.modalStyle}>
              <Box className={classes.centered}>
                <Typography className={classes.modalTitle} variant="h6">
                  Payment Summary
                </Typography>
              </Box>
              <MuiList
                sx={{ maxHeight: 350, overflow: "auto", paddingTop: "1em" }}
              >
                {(rows && groupMembers && userData) &&
                  groupMembers.map((user) => {
                    return (
                        <Box>
                        {user.attributes.profilePhoto ? (
                        <ListItem key={user.attributes.username}>
                            <ListItemAvatar>
                            <Avatar
                                alt={user.attributes.username}
                                key={user.email}
                                src={user.attributes.profilePhoto._url}
                            />
                            </ListItemAvatar>
                            <ListItemText
                            primary={
                                user.attributes.firstName +
                                " " +
                                user.attributes.lastName
                            }
                            />
                        </ListItem>
                        ) : (
                        <ListItem key={user.attributes.username}>
                            <ListItemAvatar>
                            <Avatar
                                sx={{
                                bgcolor: theme.palette.secondary.main,
                                color: "white",
                                }}
                                alt={user.attributes.username}
                                key={user.email}
                            >
                                {user.attributes.firstName[0] +
                                user.attributes.lastName[0]}
                            </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                            primary={
                                user.attributes.firstName +
                                " " +
                                user.attributes.lastName
                            }
                            />
                        </ListItem>
                        )}
                        <Box className={classes.paymentInfoContainer}>
                            <Box className={classes.paymentInfoField}>
                                <Typography>
                                    Amount Paid:
                                </Typography>
                                <Typography>
                                    {(user.id in userData && userData[user.id].amountPaid) ? `$${(userData[user.id].amountPaid).toFixed(2)}` : "$0.00"}
                                </Typography>
                            </Box>
                            <Box className={classes.paymentInfoField}>
                                <Typography>
                                    Stake in All Purchased Items:
                                </Typography>
                                <Typography 
                                >
                                    {(user.id in userData && userData[user.id].stake) ? `$${(userData[user.id].stake).toFixed(2)}` : "$0.00"}
                                </Typography>
                            </Box>
                            <Box className={classes.paymentInfoField}>
                                <Typography>
                                {(user.id in userData && userData[user.id].owesMoney) ? "Amount owed to others:" : "Amount owed by others:"}
                                </Typography>
                                <Typography 
                                    sx={{color: ((user.id in userData && userData[user.id].owesMoney) ? "red" : "green")}}
                                >
                                    {(user.id in userData && userData[user.id].difference) ? `$${(userData[user.id].difference).toFixed(2)}` : "$0.00"}
                                </Typography>
                            </Box>
                        </Box>
                        <hr/>
                        </Box>
                    );
                  })}
              </MuiList>
              <Box className={classes.centered} sx={{marginTop: "1.5em"}}>
                <Button variant="standard" onClick={onClose}>Close</Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
    );
}

export default PaymentSummaryModal;