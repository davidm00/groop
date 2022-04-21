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


import React, {useState, useContext} from "react";
import { 
    Typography,
    Button,
    Box,
    Stack,
    FormControl,
    CircularProgress,
    TextField,
    Checkbox
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { makeStyles } from "@mui/styles";
import {UserContext} from "../../Context/userContext";

const useStyles = makeStyles((theme) => ({
    itemImage: {
      width: "4em",
      height: "4em"
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
        height: "60%",
        "& > *": {
            marginLeft: "1em",
            marginRight: "1em"
        }
    },
    loader: {
        transition: "0.3s all",
        zIndex: 5,
    },
    deleteButton: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    expandArrow: {
        backgroundColor: "white",
        width: "2em",
        height: "2em",
        borderRadius: "50%",
        "&:hover": {
            boxShadow: " 0 8px 16px 0 rgba(0, 0, 0, 0.2)",
        },
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
}));


const priceRegex = /^[0-9]{0,7}\.?([0-9]{1,2})?$/;
const quantityRegex = /^[1-9]?([0-9]{1,3})?$/;


// types can be:
// - "CREATE_ITEM"
// - "EDIT_ITEM"
// - "CREATE_LIST"
// - "EDIT_LIST"
// - "CREATE_GROUP"
// - "EDIT_GROUP"
const ModalForm = ({formType, onSubmit, onClose, attributes}) => {

    const classes = useStyles();
    const { localUser } = useContext(UserContext);

    // If creating an item or list, set all properties to null to start.
    // If editing an item or list, get a snapshot of the it's current property values.
    // Then store modifications in state as user makes changes in the form.
    // Then, on submit, simply call the callback with all the new property values.
    // (The callbacks must handle all update requests to the database.) 
    const [attrs, setAttrs] = useState(
        formType === "CREATE_ITEM" ? {
            name: "",
            price: null,
            quantity: "1",
            itemPhoto: {
                currentFile: null,
                previewImage: null,
                message: "",
                isError: false,
            },
            markAsPurchased: false,
            markAsDesired: true
        } : ( (formType === "CREATE_LIST" || formType==="CREATE_GROUP") ? {
            name: ""
        } 
        : ( formType === "EDIT_ITEM" ? {
            id: attributes.id,
            name: attributes.name,
            price: attributes.price,
            quantity: attributes.quantity,
            initialImageSource: attributes.itemPhotoUrl ? attributes.itemPhotoUrl : null,
            itemPhoto: {
                currentFile: null,
                previewImage: null,
                message: "",
                isError: false,
            },
            markAsPurchased: attributes.purchaserId ? true : false,
            markAsDesired: (new Set(attributes.splitAmong.map(user => user.id))).has(localUser.id) ? true : false
        } : {
            name: attributes.name,
            delete: false
        }
        ))
    );

    const [updated, setUpdated] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [nameInputWarning, setNameInputWarning] = useState(false);
    const [priceInputWarning, setPriceInputWarning] = useState(false);
    const [quantityInputWarning, setQuantityInputWarning] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const selectFile = (event) => {
        setUpdated(true);
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
            } else {
                setPriceInputWarning(true);
            }
            setAttrs({...attrs, [prop]: event.target.value});
            return;
        } else if (prop === "quantity") {
            // check if input follows our regex
            if (quantityRegex.test(event.target.value)) {
                setQuantityInputWarning(false);
            } else {
                setQuantityInputWarning(true);
            }
            setAttrs({...attrs, [prop]: event.target.value});
            return;
        } else if (prop === "markAsPurchased" || prop === "markAsDesired") {
            // grab different attribute from the event target for a checkbox input
            setAttrs({...attrs, [prop]: event.target.checked});
            return;
        } 
        // setting any other attributes
        setAttrs({...attrs, [prop]: event.target.value});
    }

    return (
        <Box sx={{marginTop: "1em"}}>
        {(formType === "CREATE_ITEM" || formType === "EDIT_ITEM") && 
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
                                value={attrs.name ? attrs.name : ""}
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
                                value={attrs.price ? attrs.price : ""}
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
                        <Typography variant="h7">Quantity</Typography>
                        <FormControl sx={{ m: 1, maxWidth: "60%" }} variant="filled">
                            <TextField
                                type={"text"}
                                value={attrs.quantity ? attrs.quantity : ""}
                                onChange={onChangeHandler("quantity")}
                                label="Quantity"
                                helperText={quantityInputWarning ? 
                                    "Invalid quantity" 
                                    : null}
                                error={quantityInputWarning ? true : false}
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
                    {/* show the initial image from an existing item if one exists */}
                    {attrs.initialImageSource && !attrs.itemPhoto.currentFile && (
                    <Box className={classes.sameRowRightAlign}>
                            <img className={classes.itemImage} alt={"initial item preview"} src={attrs.initialImageSource} />
                    </Box>
                    )}
                    {attrs.itemPhoto && attrs.itemPhoto.currentFile && attrs.itemPhoto && attrs.itemPhoto.previewImage && (
                    <Box className={classes.sameRowRightAlign}>
                        {attrs.itemPhoto.currentFile.name && (
                            <Typography>
                            {attrs.itemPhoto.currentFile.name}
                            </Typography>
                        )}
                        <img className={classes.itemImage} alt={"new item preview"} src={attrs.itemPhoto.previewImage} />
                    </Box>
                    )}
                    <Box className={classes.sameRow}>
                        <Typography variant="h7">Mark as Purchased</Typography>
                        <FormControl sx={{ m: 1, maxWidth: "60%" }} >
                            <Checkbox
                                onChange={onChangeHandler("markAsPurchased")}
                                checked={attrs.markAsPurchased}
                            />
                        </FormControl>  
                    </Box> 
                    <Box className={classes.sameRow}>
                        <Typography variant="h7">Mark as Desired</Typography>
                        <FormControl sx={{ m: 1, maxWidth: "60%" }} >
                            <Checkbox
                                onChange={onChangeHandler("markAsDesired")}
                                checked={attrs.markAsDesired}
                            />
                        </FormControl>  
                    </Box>      
                </Stack>
            </form>
        </Box>
        )
        }
        {/* #################################### */}
        {(formType === "CREATE_LIST" || formType === "EDIT_LIST" 
        || formType==="CREATE_GROUP" || formType==="EDIT_GROUP") && 
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
                        <Typography variant="h7">
                            {(formType === "CREATE_LIST" || formType === "EDIT_LIST") && "List Name"}
                            {(formType === "CREATE_GROUP" || formType === "EDIT_GROUP") && "Group Name"}
                        </Typography>
                        <FormControl sx={{ m: 1, maxWidth: "60%" }} variant="filled">
                            <TextField
                                type={"text"}
                                value={attrs.name ? attrs.name : ""}
                                onChange={onChangeHandler("name")}
                                label="Name"
                                helperText={nameInputWarning ? 
                                    "Name is required" 
                                    : null}
                                error={nameInputWarning ? true : false}
                                required
                            />
                        </FormControl> 
                    </Box>
                    {(formType === "EDIT_LIST" || formType==="EDIT_GROUP") && (
                        <Box className={classes.sameRow}>
                            <Typography variant="h7">
                                {formType === "EDIT_LIST" && "Delete List"}
                                {formType === "EDIT_GROUP" && "Delete Group"}
                            </Typography>
                            <Box 
                                className={classes.expandArrow}
                                onClick={() => setShowDeleteButton(!showDeleteButton)}
                            >
                                {!showDeleteButton &&  <ExpandMoreIcon/>}
                                {showDeleteButton && <ExpandLessIcon/>}
                            </Box>
                        </Box>
                    )}
                    {((formType === "EDIT_LIST" || formType==="EDIT_GROUP") && showDeleteButton) && (
                        <Box className={classes.deleteButton}>
                            <Button 
                                variant="delete"
                                onClick={() => {
                                    onSubmit({...attrs, delete: true});
                                }}>
                                <Typography variant="h7">
                                    {formType === "EDIT_LIST" && "Delete List"}
                                    {formType === "EDIT_GROUP" && "Delete Group"}
                                </Typography>
                            </Button>
                        </Box>
                    )}
                </Stack>
            </form>
        </Box>
        )
        }
        {/* #################################### */}
        <hr/>
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
                            return;
                        } else if (quantityInputWarning) {
                            // do nothing if quantity is invalid
                            return;
                        } else if (attrs.quantity && attrs.quantity === ""){
                            setQuantityInputWarning(true);
                            return;
                        }
                        else {
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