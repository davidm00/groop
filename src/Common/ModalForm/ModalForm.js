// This component provides the form that can be inserted into several of our modals.
// There are four versions of the form:
// - "CREATE_ITEM"
// - "EDIT_ITEM"
// - "CREATE_LIST"
// - "EDIT_LIST"
// This component does not wrap the form in a modal. The parent component must place
// this form in a modal. It must also provide onSubmit and onClose methods. And if
// the form is for editing an existing item or list, the parent component must provide
// the current attributes for the item or list as an object. The form will call onSubmit
// with the updated attributes of the item or list after the user has made valid changes
// and clicked submit. If no changes are made by the user, the submit button will just
// call the onClose method instead.


import React, {useState} from "react";
import { 
    Typography,
    Button,
    Box,
    Stack,
    FormControl,
    CircularProgress,
    TextField,
    Avatar,
    Checkbox
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    itemImage: {
      width: "250px",
      height: "250px"
    },
    bottomButtons: {
        marginTop: "1em",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    submitButton: {
        backgroundColor: theme.palette.secondary.main
    },
    sameRow: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    sameRowRightAlign: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        "& > *": {
            marginLeft: "1em",
            marginRight: "1em"
        }
    },
    loader: {
        transition: "0.3s all",
        zIndex: 5,
    },
}));


const priceRegex = /^[0-9]{0,7}\.?([0-9]{1,2})?$/;


// types can be:
// - "CREATE_ITEM"
// - "EDIT_ITEM"
// - "CREATE_LIST"
// - "EDIT_LIST"
const ModalForm = ({formType, onSubmit, onClose, attributes}) => {

    const classes = useStyles();

    // If creating an item or list, set all properties to null to start.
    // If editing an item or list, get a snapshot of the it's current property values.
    // Then store modifications in state as user makes changes in the form.
    // Then, on submit, simply call the callback with all the new property values.
    // (The callbacks must handle all update requests to the database.) 
    const [attrs, setAttrs] = useState(
        formType === "CREATE_ITEM" ? {
            name: "",
            price: null,
            itemPhoto: {
                currentFile: null,
                previewImage: null,
                message: "",
                isError: false,
            },
            markAsPurchased: false,
            markAsDesired: true
        } : ( formType === "CREATE_LIST" ? {
            name: null
        } : attributes)
    );

    const [updated, setUpdated] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [nameInputWarning, setNameInputWarning] = useState(false);
    const [priceInputWarning, setPriceInputWarning] = useState(false);
    const selectFile = (event) => {
        setAttrs({...attrs, 
            itemPhoto: {
                    currentFile: event.target.files[0],
                    previewImage: URL.createObjectURL(event.target.files[0]),
                    message: "",
            }
        });
        console.log(event.target.files[0]);
    };

    const noOp = () => {};

    const preventDefault = (e) => {
        e.preventDefault();
    }

    const onChangeHandler = (prop) => (event) => {
        updated ? noOp() : setUpdated(true);
        if (prop === "name") {
            // remove invalid name warning if user edits the field
            setNameInputWarning(false);
        } else if(prop === "price") {
            // check if input follows our regex
            if (priceRegex.test(event.target.value)) {
                setPriceInputWarning(false);
                setAttrs({...attrs, [prop]: event.target.value});
                return;
            } else {
                // don't update price in attributes
                setPriceInputWarning(true);
                return;
            }
        } else if (prop === "markAsPurchased" || prop === "markAsDesired") {
            // grab different attribute from the event target for a checkbox input
            setAttrs({...attrs, [prop]: event.target.checked});
            return;
        } 
        // setting any other attributes
        setAttrs({...attrs, [prop]: event.target.value});
        console.log("Attrs: ", attrs);
    }

    console.log("attrs in ModalForm: ", attrs);

    return (
        <Box>
        {formType === "CREATE_ITEM" && 
        (
        <Box>
            <form onSubmit={preventDefault} autoComplete="off">
                <Stack
                    direction="column"
                    justifyContent="left"
                    alignItems="center"
                    spacing={2}
                >
                    <Box className={classes.sameRow}>
                        <Typography variant="h7">Item Name</Typography>
                        <FormControl sx={{ m: 1, maxWidth: "60%" }} variant="filled">
                            <TextField
                                type={"text"}
                                value={attrs.name}
                                onChange={onChangeHandler("name")}
                                label="Item Name"
                                helperText={nameInputWarning ? 
                                    "Item name is required" 
                                    : null}
                                error={nameInputWarning ? true : false}
                                required
                            />
                        </FormControl> 
                    </Box>
                    <Box className={classes.sameRow}>
                        <Typography variant="h7">Price</Typography>
                        <FormControl sx={{ m: 1, maxWidth: "60%" }} variant="filled">
                            <TextField
                                type={"text"}
                                value={attrs.price}
                                onChange={onChangeHandler("price")}
                                label="Price"
                                helperText={priceInputWarning ? 
                                    "Invalid price" 
                                    : null}
                                error={priceInputWarning ? true : false}
                            />
                        </FormControl>  
                    </Box> 
                    <Box className={classes.sameRow}>
                        <Typography variant="h7">Image</Typography>
                        <Box sx={{paddingRight: "0.5em"}}>
                        <label htmlFor="btn-choose">
                            <input
                                id="btn-choose"
                                style={{display: "none"}}
                                type="file"
                                accept="image/*"
                                onChange={selectFile}
                            />
                            <Button
                                variant="standard"
                                component="span"
                            >
                                Choose Image
                            </Button>  
                        </label>
                        </Box>
                    </Box>
                    <Box className={classes.sameRowRightAlign}>
                        <Typography>
                            {attrs.itemPhoto && attrs.itemPhoto.currentFile ? attrs.itemPhoto.currentFile.name : null}
                        </Typography>
                        {attrs.itemPhoto && attrs.itemPhoto.previewImage && (
                            <Box>
                                <Avatar alt={"item image preview"} src={attrs.itemPhoto.previewImage} />
                            </Box>
                        )}
                    </Box>
                    <Box className={classes.sameRow}>
                        <Typography variant="h7">Mark as Purchased</Typography>
                        <FormControl sx={{ m: 1, maxWidth: "60%" }} autoComplete="off">
                            <Checkbox
                                onChange={onChangeHandler("markAsPurchased")}
                            />
                        </FormControl>  
                    </Box> 
                    <Box className={classes.sameRow}>
                        <Typography variant="h7">Mark as Desired</Typography>
                        <FormControl sx={{ m: 1, maxWidth: "60%" }} >
                            <Checkbox
                                onChange={onChangeHandler("markAsDesired")}
                                defaultChecked
                            />
                        </FormControl>  
                    </Box>      
                </Stack>
            </form>
        </Box>
        )
        }
        {/* #################################### */}
        {formType === "EDIT_ITEM" && 
        (
        <Box>
            <Typography variant="h6">Edit Item</Typography>
        </Box>
        )
        }
        {/* #################################### */}
        {formType === "CREATE_LIST" && 
        (
        <Box>
            <Typography variant="h6">Create a New List</Typography>
        </Box>
        )
        }
        {/* #################################### */}
        {formType === "EDIT_LIST" && 
        (
        <Box>
            <Typography variant="h6">Edit List</Typography>
        </Box>
        )
        }
        {/* #################################### */}
        <hr style={{marginTop: "1em"}}/>
        <Box className={classes.bottomButtons}>
            <Button variant="submit"
                onClick={() => {
                    // show error if name is empty
                    if (attrs.name === "") {
                        setNameInputWarning(true);
                        return;
                    }
                    if (updated) {
                        if (priceInputWarning) {
                            // do nothing if price is invalid
                            noOp();
                        } else {
                            // submit if valid updates have been made
                            setSubmitting(true);
                            onSubmit(attrs);
                        }
                    } else {
                        // if no changes, just close the modal
                        onClose();
                    }
                }}>
                    {submitting ? 
                    (
                    <CircularProgress
                        color="secondary"
                        size={"1.5em"}
                        className={classes.loader}
                    />
                    ) 
                    : "Submit"}
                </Button>
            <Button variant="standard" onClick={onClose}>Close</Button>
        </Box>
        </Box>
    );
}



export default ModalForm;