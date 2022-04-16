import React, { useEffect, useState, useContext, useCallback } from "react";
import PropTypes from "prop-types";
// import { makeStyles} from "@mui/styles";
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
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
  Avatar,
  Alert,
  AlertTitle,
  Backdrop,
  Button,
  Modal,
  Fade
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import EditIcon from "@mui/icons-material/Edit";
import PhotoIcon from "@mui/icons-material/Photo";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import RefreshIcon from "@mui/icons-material/Refresh";
import { visuallyHidden } from "@mui/utils";
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
  createItemWithAttributes
} from "../../Services/itemService";
import { makeStyles, useTheme } from "@mui/styles";
import ClickableAvatarList from "../../Common/ClickableAvatarList/ClickableAvatarList";
import { UserContext } from "../../Context/userContext";
import ModalForm from "../../Common/ModalForm/ModalForm.js";

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

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
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
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

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
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  selected: PropTypes.array.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
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
          <Tooltip title="Toggle Desired">
            <IconButton onClick={onToggleDesired}>
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
          {selected.filter(
            (itemId, i) => (rows[itemId] && rows[itemId].purchaserId !== localUser.id)
          ).length !== 0 && (
            <Tooltip title="Mark as Purchased">
              <IconButton onClick={onMarkAsPurchased}>
                <ShoppingBagIcon />
              </IconButton>
            </Tooltip>
          )}
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
          <Tooltip title="Toggle Desired">
            <IconButton onClick={onToggleDesired}>
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
          {rows[selected[0]] && rows[selected[0]].purchaserId !== localUser.id && (
            <Tooltip title="Mark as Purchased">
              <IconButton onClick={onMarkAsPurchased}>
                <ShoppingBagIcon />
              </IconButton>
            </Tooltip>
          )}
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

export default function ItemTable({ listId }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

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

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
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

  // TODO: UPDATE THIS
  const deleteRow = async (itemId) => {
    console.log("Selected before delete: ", selected);
    // save the row in case deletion fails
    const theRow = rows[itemId];
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
    delete theRows[itemId];
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
    const itemPhotoData = attrs.itemPhoto.currentFile;
    const purchaserId = attrs.markAsPurchased ? localUser.id : null;
    const desirerId = attrs.markAsDesired ? localUser.id : null;
    const itemObject = await createItemWithAttributes(
      itemName, price, itemPhotoData, purchaserId, desirerId, listId
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
  const onEditItemFormSubmit = (newAttrs) => {
    // TODO: call refresh in here or edit rows on success
    console.log("Handling edit item modal submit with newAttrs: ", newAttrs);
    setEditItemModalOpen(false);
  }



  return (
    <Box sx={{ width: "100%" }}>
      <div>
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
                 
                {/* {TODO: Form for editing items} */}
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
                
                {/* {TODO: Form for editing items} */}
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
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              deleteRow={deleteRow}
              selected={selected}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={Object.keys(rows).length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {
                //stableSort(rows, getComparator(order, orderBy))
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
                    height: (dense ? 33 : 53) * emptyRows,
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
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Condense Table"
      />
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
