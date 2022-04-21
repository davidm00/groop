import React, { useEffect, useState, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Avatar,
  Alert,
  AlertTitle,
  Backdrop,
  Button,
  Modal,
  Fade
} from "@mui/material";

import {
  Delete as DeleteIcon,
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
  ShoppingBag as ShoppingBagIcon,
  Edit as EditIcon,
  Photo as PhotoIcon,
  Refresh as RefreshIcon,
  CrisisAlert as CrisisAlertIcon
} from "@mui/icons-material";

import {
  getAllItemsInList,
  getUserNameByUserId,
  getUserPhotoUrlByUserId,
  getUsersFromSplitAmongRelation,
  setItemAsPurchasedByUserId,
  setItemAsNotPurchased,
  setItemAsDesiredByUser,
  setItemAsNotDesiredByUser,
  deleteItemById,
  createItemWithAttributes,
  updateItemAttributes
} from "../../Services/itemService";
import { makeStyles, useTheme } from "@mui/styles";
import ClickableAvatarList from "../../Common/ClickableAvatarList/ClickableAvatarList";
import { UserContext } from "../../Context/userContext";
import ModalForm from "../../Common/ModalForm/ModalForm.js";
import PaymentSummaryModal from "./PaymentSummaryModal";

const useStyles = makeStyles((theme) => ({
  modalStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "350px",
    backgroundColor: "white",
    color: theme.palette.text.primary,
    p: 4,
    borderRadius: "0.5em",
    padding: "1em",
  },
  modalTitle: {
    marginLeft: "10%",
    maxWidth: "80%",
    textAlign: "center"
  },
  itemImage: {
    width: "250px",
    height: "250px"
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "90%",
    marginLeft: "5%",
  }, 
  centered: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  paymentSummaryButtonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "2em"
  }
}));

async function transformData(item) {
  console.log("In transformData with item: ", item.attributes.name);
  let purchaserId = null;
  let purchaserName = null;
  let purchaserFirstName = null;
  let purchaserLastName = null;
  let purchaserPhotoUrl = null;
  let splitAmong = null;
  if (item.attributes.purchased) {
    purchaserId = item.attributes.purchased.id;
    // try to get name and photo url of item purchaser
    try {
      await getUserNameByUserId(item.attributes.purchased.id).then((name) => {
        purchaserName = name;
      });
      purchaserFirstName = purchaserName[0];
      purchaserLastName = purchaserName[1];
      purchaserName = purchaserName[0] + " " + purchaserName[1];
    } catch (error) {
      console.log("Error converting row data: ", error);
    }

    try {
      await getUserPhotoUrlByUserId(item.attributes.purchased.id).then(
        (photoUrl) => {
          purchaserPhotoUrl = photoUrl;
        }
      );
    } catch (error) {
      console.log("Error converting row data: ", error);
    }
  }
  if (item.attributes.splitAmong) {
    splitAmong = await getUsersFromSplitAmongRelation(item.id);
  }

  const rowData = {
    id: item.id,
    name: item.attributes.name,
    price: item.attributes.price,
    quantity: item.attributes.quantity ? item.attributes.quantity : 1,
    purchased: item.attributes.purchased ? true : false,
    splitAmong: splitAmong,
    itemPhotoUrl: item.attributes.photo ? item.attributes.photo._url : null,
    purchaserId: purchaserId,
    purchaserName: purchaserName,
    purchaserFirstName: purchaserFirstName,
    purchaserLastName: purchaserLastName,
    purchaserPhotoUrl: purchaserPhotoUrl,
  };
  console.log("rowData: ", rowData);
  return rowData;
}

const headCells = [
  {
    id: "selectAll",
    numeric: false,
    disablePadding: true,
    label: "Select All",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "Price",
  },
  {
    id: "quantity",
    numeric: true,
    disablePadding: false,
    label: "Quantity"
  },
  {
    id: "purchased",
    numeric: true,
    disablePadding: false,
    label: "Purchased",
  },
  {
    id: "splitAmong",
    numeric: true,
    disablePadding: false,
    label: "Desired By",
  },
  {
    id: "delete",
    numeric: true,
    disablePadding: false,
    label: "Delete",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    numSelected,
    rowCount,
  } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
          >
              {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  selected: PropTypes.array.isRequired,
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const {
    rows,
    selected,
    localUser,
    onRefresh,
    onItemPhotoModalOpen,
    onCreateItemModalOpen,
    onEditItemModalOpen,
    onMarkAsNeeded,
    onMarkAsPurchased,
    onToggleDesired
  } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(selected.length > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {selected.length > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {selected.length} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Items
        </Typography>
      )}

      {selected.length >= 2 && (
        <div style={{ display: "flex" }}>
          <Tooltip title="Refresh">
            <IconButton onClick={onRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          {selected.filter((itemId, i) => (rows[itemId] && rows[itemId].purchased === true))
            .length !== 0 && (
            <Tooltip title="Mark as Needed">
              <IconButton onClick={onMarkAsNeeded}>
                <CrisisAlertIcon />
              </IconButton>
            </Tooltip>
          )}
          {selected.filter(
            (itemId, i) => (rows[itemId] && rows[itemId].purchaserId !== localUser.id)
          ).length !== 0 && (
            <Tooltip title="Mark as Purchased">
              <IconButton onClick={onMarkAsPurchased}>
                <ShoppingBagIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Toggle Desired">
            <IconButton onClick={onToggleDesired}>
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
      {selected.length === 1 && (
        <div style={{ display: "flex" }}>
          <Tooltip title="Refresh">
            <IconButton onClick={onRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Item">
            <IconButton onClick={onEditItemModalOpen}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          {rows[selected[0]] && rows[selected[0]].itemPhotoUrl && (
          <Tooltip title="View Photo">
            <IconButton onClick={onItemPhotoModalOpen}>
              <PhotoIcon />
            </IconButton>
          </Tooltip>
          )}
          {rows[selected[0]] && rows[selected[0]].purchased && (
            <Tooltip title="Mark as Needed">
              <IconButton onClick={onMarkAsNeeded}>
                <CrisisAlertIcon />
              </IconButton>
            </Tooltip>
          )}
          {rows[selected[0]] && rows[selected[0]].purchaserId !== localUser.id && (
            <Tooltip title="Mark as Purchased">
              <IconButton onClick={onMarkAsPurchased}>
                <ShoppingBagIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Toggle Desired">
            <IconButton onClick={onToggleDesired}>
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
      {selected.length === 0 && (
        <div style={{ display: "flex" }}>
          <Tooltip title="Refresh">
            <IconButton onClick={onRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Create Item">
            <IconButton onClick={onCreateItemModalOpen}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  rows: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  localUser: PropTypes.object.isRequired,
  onItemPhotoModalOpen: PropTypes.func.isRequired,
  onCreateItemModalOpen: PropTypes.func.isRequired,
  onEditItemModalOpen: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onMarkAsNeeded: PropTypes.func.isRequired,
  onMarkAsPurchased: PropTypes.func.isRequired,
  onToggleDesired: PropTypes.func.isRequired,
};

export default function ItemTable({ listId, groupMembers }) {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const theme = useTheme();
  const { localUser } = useContext(UserContext);
  const classes = useStyles();

  // feed items through the transformData function to
  // get data objects for the rows state array
  const transformAllData = async (items) => {
    let theRowData = {};
    for (let i = 0; i < items.length; i++) {
      await transformData(items[i]).then((rowData) => {
        theRowData[rowData.id] = rowData;
      });
    }
    return theRowData;
  };

  const populateRows = useCallback(() => {
    getAllItemsInList(listId).then((res) => {
      console.log("Items in ItemTable Component: ", res);
      if (res.length === 1) {
        // only 1 item, transform it, place it in an array,
        // and set the rows state array
        transformData(res[0]).then((row) => {
          setRows({ [row.id]: row });
        });
      } else if (res.length > 1) {
        // transform the items and set the rows state array
        transformAllData(res).then((rowData) => {
          setRows(rowData);
        });
      }
    });
  }, [listId]);

  useEffect(() => {
    populateRows();
  }, [populateRows, refresh]);

  const handleSelectAllClick = (event) => {
    console.log("event for selectAll: ", event);
    if (event.target.checked) {
      setSelected(Object.keys(rows));
      console.log("After Select All: ", Object.keys(rows));
      return;
    }
    console.log("Unchecked Select All");
    setSelected([]);
  };

  const handleClick = (event, itemId) => {
    // this callback is called after an item is deleted,
    // so prevent deleted items from being added to selected
    if (!(itemId in rows)) {
      return;
    }

    const selectedIndex = selected.indexOf(itemId);
    console.log("Selected event: ", event);
    console.log("Selected Id: ", itemId);
    let newSelected = [];

    // store the selected item Ids in state for use
    // in services/functions that modify items locally and in Parse
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, itemId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    console.log("newSelected: ", newSelected);
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onRefresh = () => {
    setRefresh(refresh ? false : true);
  };

  // First try to update the item(s) in the database,
  // then update the row(s) in state if successful.
  const onMarkAsNeeded = async () => {
    let successfullyUpdatedItems = [];
    let unsuccessfullyUpdatedItems = [];
    for (let i = 0; i < selected.length; i++) {
      const rc = await setItemAsNotPurchased(selected[i]);
      if (rc === 0) {
        successfullyUpdatedItems.push(selected[i]);
      } else {
        unsuccessfullyUpdatedItems.push(rows[selected[i]].name);
      }
    }
    // update rows state to reflect the successful changes made to the database
    let theRows = rows;
    for (let i = 0; i < successfullyUpdatedItems.length; i++) {
      theRows[successfullyUpdatedItems[i]].purchased = false;
      theRows[successfullyUpdatedItems[i]].purchaserId = null;
      theRows[successfullyUpdatedItems[i]].purchaserFirstName = null;
      theRows[successfullyUpdatedItems[i]].purchaserLastName = null;
      theRows[successfullyUpdatedItems[i]].purchaserPhotoUrl = null;
    }
    // force rerender when updating a nested object by replacing the entire rows object
    setRows({ ...theRows });
    // alert user to items that could not be updated successfully
    if (unsuccessfullyUpdatedItems.length !== 0) {
      setErrorMessage(
        `Failed to mark the following items as needed: ${unsuccessfullyUpdatedItems.join(
          ", "
        )}`
      );
    }
  };

  // First try to update the item(s) in the database,
  // then update the row(s) in state if successful.
  const onMarkAsPurchased = async () => {
    let successfullyUpdatedItems = [];
    let unsuccessfullyUpdatedItems = [];
    for (let i = 0; i < selected.length; i++) {
      const rc = await setItemAsPurchasedByUserId(selected[i], localUser.id);
      if (rc === 0) {
        successfullyUpdatedItems.push(selected[i]);
      } else {
        unsuccessfullyUpdatedItems.push(rows[selected[i]].name);
      }
    }
    // update rows state to reflect the successful changes made to the database
    let theRows = rows;
    for (let i = 0; i < successfullyUpdatedItems.length; i++) {
      theRows[successfullyUpdatedItems[i]].purchased = true;
      theRows[successfullyUpdatedItems[i]].purchaserId = localUser.id;
      theRows[successfullyUpdatedItems[i]].purchaserFirstName =
        localUser.attributes.firstName;
      theRows[successfullyUpdatedItems[i]].purchaserLastName =
        localUser.attributes.lastName;
      theRows[successfullyUpdatedItems[i]].purchaserPhotoUrl =
        localUser.attributes.profilePhoto._url;
    }
    // force rerender when updating a nested object by replacing the entire rows object
    setRows({ ...theRows });
    // alert user to items that could not be updated successfully
    if (unsuccessfullyUpdatedItems.length !== 0) {
      setErrorMessage(
        `Failed to mark the following items as purchased: ${unsuccessfullyUpdatedItems.join(
          ", "
        )}`
      );
    }
  };

  // First try to update the item(s) in the database,
  // then update the row(s) in state if successful.
  const onToggleDesired = async () => {
    // first grab the items desired by current user amongst
    // the selected items
    console.log("Split among for the first selected item: ", rows[selected[0]].splitAmong);
    let itemsDesiredByUserAmongstSelected = new Set();
    for (let i = 0; i < selected.length; i++) {
      // loop over the people who desire the item, if applicable
      if (rows[selected[i]].splitAmong !== null) {
        for (let j = 0; j < rows[selected[i]].splitAmong.length; j++) {
          if (localUser.id === rows[selected[i]].splitAmong[j].id) {
            itemsDesiredByUserAmongstSelected.add(selected[i]);
            break;
          }
        }
      }
    }
    // if not all selected items are already desired by current user,
    // then set all items as desired by current user
    let unsuccessfullyUpdatedItems = [];
    let newListsOfUsers = {};
    if (itemsDesiredByUserAmongstSelected.size !== selected.length) {
      // try to set all selected items as desired by current user
      for (let i = 0; i < selected.length; i++) {
        // don't do anything if the selected item is already marked as desired
        if (!itemsDesiredByUserAmongstSelected.has(selected[i])){
          const desiredBy = await setItemAsDesiredByUser(selected[i], localUser.id);
          // null indicates failure in this case
          if (desiredBy === null) {
            unsuccessfullyUpdatedItems.push(rows[selected[i]].name);
          }
          else {
            // save the returned list of users to update row state later
            newListsOfUsers[selected[i]] = desiredBy;
          }
        }
      }
      // alert user to items that couldn't be updated
      if (unsuccessfullyUpdatedItems.length !== 0) {
        setErrorMessage(`Failed to mark the following items as desired: ${unsuccessfullyUpdatedItems.join(", ")}`);
      }
    } else {
      // try to set all items as not desired by current user
      for (let i = 0; i < selected.length; i++) {
          const desiredBy = await setItemAsNotDesiredByUser(selected[i], localUser.id);
          // null indicates failure in this case
          if (desiredBy === null) {
            unsuccessfullyUpdatedItems.push(rows[selected[i]].name);
          }
          else {
            // save the returned list of users to update row state later
            newListsOfUsers[selected[i]] = desiredBy;
          }
      }
      // alert user to items that couldn't be updated
      if (unsuccessfullyUpdatedItems.length !== 0) {
        setErrorMessage(`Failed to unmark the following items as desired: ${unsuccessfullyUpdatedItems.join(", ")}`);
      }
    }
    // update rows state with new data
    let theRows = rows;
    for (let i = 0; i < Object.keys(newListsOfUsers).length; i++) {
      theRows[Object.keys(newListsOfUsers)[i]].splitAmong = newListsOfUsers[Object.keys(newListsOfUsers)[i]];
    }
    // force rerender when updating a nested object by replacing the entire rows object
    setRows({...theRows});
  }

  // need to force payment modal to recalculate when item is deleted
  const [paymentModalUpdate, setPaymentModalUpdate] = useState(false);

  const deleteRow = async (itemId) => {
    setPaymentModalUpdate(!paymentModalUpdate);
    console.log("Selected before delete: ", selected);
    // save the row in case deletion fails
    const theRow = rows[itemId];
    console.log("theRow at top of deleteRow: ", theRow);
    // if it was selected, then remove it from the selected state list variable
    let wasSelected = false;
    for (let i = 0; i < selected.length; i++) {
      if (selected[i] === itemId) {
        wasSelected = true;
        break;
      }
    }
    console.log("Going to set selected as: ", selected.filter((id, _) => (id !== itemId)));
    setSelected(selected.filter((id, _) => (id !== itemId)));
    // update rows state first so delete feels immediate
    let theRows = rows;
    console.log("theRows before deletion in ItemTable: ", theRows);
    delete theRows[itemId];
    console.log("rows after deletion in ItemTable: ", theRows);
    setRows(theRows);
    // try to delete item from database
    const rc = await deleteItemById(itemId);
    if (rc === -1) {
      // return item to table if deletion failed
      theRows[itemId] = theRow;
      setRows(theRows);
      // and leave item marked as selected if it was selected originally
      if (wasSelected) {
        setSelected(selected.concat([itemId]));
      }
      console.log("Selected after failed delete: ", selected);
      setErrorMessage(`Failed to delete the following item: ${theRow.name}`);
    }
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - Object.keys(rows).length)
      : 0;

  // for item modal
  const [itemPhotoModalOpen, setItemPhotoModalOpen] = useState(false);
  const handleItemPhotoModalOpen = () => setItemPhotoModalOpen(true);
  const handleItemPhotoModalClose = () => setItemPhotoModalOpen(false);

  // for create item modal
  const [createItemModalOpen, setCreateItemModalOpen] = useState(false);
  const handleCreateItemModalOpen = () => setCreateItemModalOpen(true);
  const handleCreateItemModalClose = () => setCreateItemModalOpen(false);
  const onCreateItemFormSubmit = async (attrs) => {
    console.log("Handling create item modal submit with attrs: ", attrs);
    const itemName = attrs.name;
    const price = Number.parseFloat(attrs.price);
    const quantity = attrs.quantity ? Number.parseInt(attrs.quantity) : 1;
    const itemPhotoData = attrs.itemPhoto.currentFile;
    const purchaserId = attrs.markAsPurchased ? localUser.id : null;
    const desirerId = attrs.markAsDesired ? localUser.id : null;
    const itemObject = await createItemWithAttributes(
      itemName, price, quantity, itemPhotoData, purchaserId, desirerId, listId
    );
    if (itemObject !== null) {
      // success: update local rows state variable (avoid costly refresh call)
      console.log("new itemObject: ", itemObject);
      const rowData = await transformData(itemObject);
      setRows({...rows, [itemObject.id] : rowData});
    } else {
      // error: alert user
      setErrorMessage(`Failed to create new item: ${attrs.name}`);
    }
    setCreateItemModalOpen(false)
  }

  // for edit item modal
  const [editItemModalOpen, setEditItemModalOpen] = useState(false);
  const handleEditItemModalOpen = () => setEditItemModalOpen(true);
  const handleEditItemModalClose = () => setEditItemModalOpen(false);
  const onEditItemFormSubmit = async (attrs) => {
    console.log("Handling edit item modal submit with newAttrs: ", attrs);
    const itemId = attrs.id;
    const itemName = attrs.name;
    const price = Number.parseFloat(attrs.price);
    const quantity = attrs.quantity ? Number.parseInt(attrs.quantity) : 1;
    const itemPhotoData = attrs.itemPhoto.currentFile;
    const purchaserId = attrs.markAsPurchased ? localUser.id : null;
    const desirerId = attrs.markAsDesired ? localUser.id : null;
    const userId = localUser.id;
    const itemObject = await updateItemAttributes(
      itemId, itemName, price, quantity, itemPhotoData, purchaserId, desirerId, userId
    );
    if (itemObject !== null) {
      // success: update local rows state variable (avoid costly refresh call)
      console.log("updated itemObject: ", itemObject);
      const rowData = await transformData(itemObject);
      setRows({...rows, [itemObject.id] : rowData});
    } else {
      // error: alert user
      setErrorMessage(`Failed to update item: ${attrs.name}`);
    }
    setEditItemModalOpen(false);
  }

  // for payment summary modal
  const [paymentSummaryModalOpen, setPaymentSummaryModalOpen] = useState(false);
  const handlePaymentSummaryModalOpen = () => setPaymentSummaryModalOpen(true);
  const handlePaymentSummaryModalClose = () => setPaymentSummaryModalOpen(false);

  return (
    <Box sx={{ width: "100%" }}>
      <div>
        <PaymentSummaryModal
          open={paymentSummaryModalOpen}
          rows={rows}
          onClose={handlePaymentSummaryModalClose}
          groupMembers={groupMembers}
          update={paymentModalUpdate}
        />
        <Modal
          aria-labelledby="Modal showing image of item"
          aria-describedby="Modal showing image of item"
          open={itemPhotoModalOpen}
          onClose={handleItemPhotoModalClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={itemPhotoModalOpen}>
            <Box className={classes.modalStyle}>
              <Box className={classes.modalTitle}>
                <Typography variant="h6">
                  {rows[selected[0]] ? (rows[selected[0]].name) : null}
                </Typography>
              </Box>
              <Box className={classes.modalContent}>
                <img 
                  className={classes.itemImage} 
                  alt={rows[selected[0]] ? rows[selected[0]].name : ""} 
                  src={rows[selected[0]] ? rows[selected[0]].itemPhotoUrl : null} 
                />
                <Button variant="standard" onClick={handleItemPhotoModalClose}>Close</Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </div>
      <div>
        <Modal
          aria-labelledby="Modal for creating an item"
          aria-describedby="Modal for creating an item"
          open={createItemModalOpen}
          onClose={handleCreateItemModalClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={createItemModalOpen}>
            <Box className={classes.modalStyle}>
              <Box className={classes.modalTitle}>
                <Typography variant="h6">Create a New Item</Typography>
              </Box> 
              <Box className={classes.modalContent}>
                <ModalForm 
                  formType={"CREATE_ITEM"}
                  onSubmit={onCreateItemFormSubmit}
                  onClose={handleCreateItemModalClose}
                  attributes={null}  
                />
              </Box>
            </Box>
          </Fade>
        </Modal>
      </div>
      <div>
        <Modal  
          aria-labelledby="Modal for editing an item"
          aria-describedby="Modal for editing an item"
          open={editItemModalOpen}
          onClose={handleEditItemModalClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={editItemModalOpen}>
            <Box className={classes.modalStyle}>
              <Box className={classes.modalTitle}>
                <Typography variant="h6">Edit Item: {rows[selected[0]] ? rows[selected[0]].name : ""}</Typography>
              </Box>
              <Box className={classes.modalContent}>
                <ModalForm 
                  formType={"EDIT_ITEM"} 
                  onSubmit={onEditItemFormSubmit}
                  onClose={handleEditItemModalClose}
                  attributes={rows[selected[0]] ? rows[selected[0]] : null}
                />
              </Box>
            </Box>
          </Fade>
        </Modal>
      </div>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          rows={rows}
          selected={selected}
          localUser={localUser}
          onItemPhotoModalOpen={handleItemPhotoModalOpen}
          onCreateItemModalOpen={handleCreateItemModalOpen}
          onEditItemModalOpen={handleEditItemModalOpen}
          onRefresh={onRefresh}
          onMarkAsNeeded={onMarkAsNeeded}
          onMarkAsPurchased={onMarkAsPurchased}
          onToggleDesired={onToggleDesired}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"small"}
          >
            <EnhancedTableHead
              deleteRow={deleteRow}
              selected={selected}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={Object.keys(rows).length}
            />
            <TableBody>
              {
                Object.values(rows)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          <div name={row.id}>{row.name}</div>
                        </TableCell>
                        <TableCell align="right">
                          {row.price ? row.price.toFixed(2) : "-"}
                        </TableCell>
                        <TableCell align="right">
                          {row.quantity ? row.quantity : "1"}
                        </TableCell>
                        <TableCell align="right">
                          {row.purchased ? (
                            <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Tooltip
                              title={"Purchased by " + row.purchaserName}
                              arrow
                            >
                              {row.purchaserPhotoUrl ? (
                                  <Avatar
                                    sx={{
                                      width: "1.5em",
                                      height: "1.5em",
                                    }}
                                    alt={row.purchaserName}
                                    key={row.purchaserName}
                                    src={row.purchaserPhotoUrl}
                                  />
                              ) : (
                                  <Avatar
                                    sx={{
                                      bgcolor: theme.palette.secondary.main,
                                      color: "white",
                                      width: "1.5em",
                                      height: "1.5em",
                                    }}
                                    alt={row.purchaserName}
                                    key={row.purchaserName}
                                  >
                                    {row.purchaserFirstName[0] +
                                      row.purchaserLastName[0]}
                                  </Avatar>
                              )}
                            </Tooltip>
                            </Box>
                          ) : (
                            <Tooltip
                              title={"Not yet purchased"}
                              placement="bottom-end"
                            >
                              <Typography>No</Typography>
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Box>
                            {row.splitAmong && row.splitAmong.length > 0 ? (
                              <ClickableAvatarList
                                users={row.splitAmong}
                                modalTitle={row.name + " desired by:"}
                                stringIfNoUsers={""}
                              />
                            ) : (
                              "-"
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => {
                              deleteRow(row.id);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
              }
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={Object.keys(rows).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Box className={classes.paymentSummaryButtonContainer}>
          <Button variant="action" onClick={handlePaymentSummaryModalOpen}>Payment Summary</Button>
      </Box>
      {errorMessage && (
        <Alert
          severity="error"
          onClose={() => {
            setErrorMessage(null);
          }}
        >
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </Alert>
      )}
    </Box>
  );
}
