import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import EditIcon from "@mui/icons-material/Edit";
import PhotoIcon from "@mui/icons-material/Photo";
import { visuallyHidden } from "@mui/utils";
import {
  getAllItemsInList,
  getUserNameByUserId,
  getUserPhotoUrlByUserId,
  getUsersFromSplitAmongRelation
} from "../../Services/itemService";
import { useTheme } from "@mui/styles";

async function createData(item) {
    console.log("In createData with item: ", item.attributes.name);
  let purchaserName = null;
  let purchaserFirstName = null;
  let purchaserLastName = null;
  let purchaserPhotoUrl = null;
  let splitAmong = null;
  if (item.attributes.purchased) {
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
        await getUserPhotoUrlByUserId(item.attributes.purchased.id).then((photoUrl) => {
            purchaserPhotoUrl = photoUrl;
        });
      } catch (error) {
        console.log("Error converting row data: ", error);
      }
  }
  if (item.attributes.splitAmong) {
      // TODO: try to get names and photo urls of item desirers
      const users = await getUsersFromSplitAmongRelation(item.id);
        if (users) {
            splitAmong = users.map((user) => {
                if (user.attributes.profilePhoto) {
                    return [user.attributes.firstName, user.attributes.lastName, user.attributes.profilePhoto._url];
                }
                return [user.attributes.firstName, user.attributes.lastName, null];
            })
        }
  }

  const rowData = {
    name: item.attributes.name,
    price: item.attributes.price,
    purchased: item.attributes.purchased ? true : false,
    splitAmong: splitAmong,
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
  deleteRow: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  //rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { deleteRow, numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
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

      {numSelected >= 2 && (
        <div style={{ display: "flex" }}>
          <Tooltip title="Mark as Desired">
            <IconButton>
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle Purchased">
            <IconButton>
              <ShoppingBagIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
      {numSelected === 1 && (
        <div style={{ display: "flex" }}>
          <Tooltip title="Edit Item">
            <IconButton>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Photo">
            <IconButton>
              <PhotoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mark as Desired">
            <IconButton>
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle Purchased">
            <IconButton>
              <ShoppingBagIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
      {numSelected === 0 && (
        <Tooltip title="Create Item">
          <IconButton>
            <AddIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function ItemTable({ listId }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState([]);
  const theme = useTheme();

  const deleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // feed items through the createData function to
  // get data objects for the rows state array
  const getRowData = async (items) => {
      let theRowData = [];
        for (let i = 0; i < items.length; i++) {
            await createData(items[i]).then((rowData) => {
                theRowData.push(rowData);
            })
        }
        return theRowData;
  }

  useEffect(() => {
    getAllItemsInList(listId).then((res) => {
      console.log("Items in ItemTable Component: ", res);
      if (res.length === 1) {
          // only 1 item, transform it, place it in an array,
          // and set the rows state array
          createData(res[0]).then((row) => {
              setRows([row]);
          })
      } else if (res.length > 1) {
          // transform the items and set the rows state array
        getRowData(res).then((rowData) => {
            setRows(rowData);
        })
      }
    });
  }, [listId]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

    setSelected(newSelected);
    console.log("Selected: ", selectedIndex);
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

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
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
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {
                //stableSort(rows, getComparator(order, orderBy))
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.name)}
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
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.price}</TableCell>
                        <TableCell align="right">
                          {row.purchased ? (
                            <Tooltip title={"Purchased by " + row.purchaserName} arrow>
                              {row.purchaserPhotoUrl ? (
                                <Avatar
                                  sx={{ marginLeft: "80%", width: "1.5em", height: "1.5em" }}
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
                          ) : (
                            <Tooltip title={"Not yet purchased"} placement="bottom-end">
                              <Typography>No</Typography>
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell align="right">{"-"}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => {
                              deleteRow(index);
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
          count={rows.length}
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
    </Box>
  );
}
