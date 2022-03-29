import React, { useContext, useState } from "react";
import Parse from "parse/lib/browser/Parse";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Typography,
  Box,
  Toolbar,
  Button,
  IconButton,
  List,
  Divider,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
} from "@mui/material";
import {
  ArrowBack,
  ManageAccounts as Account,
  Group,
  Settings,
  Drafts,
  Home,
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { UserContext } from "../../Context/userContext";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 240,
    flexShrink: 0,
    [`& .MuiDrawer-paper`]: {
      width: 240,
      boxSizing: "border-box",
      backgroundColor: theme.palette.secondary.main,
      color: "white",
    },
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const { localUser, setLocalUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);

  const location = useLocation();

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const logOut = async () => {
    Parse.User.logOut();
    setLocalUser(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          className={classes.appBar}
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => toggleDrawer()}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Button
                disableElevation
                variant="text"
                onClick={() => navigate("/", { replace: true })}
                startIcon={<Home />}
              >
                Groop
              </Button>
            </Typography>
            {localUser && (
              <Button
                color="inherit"
                onClick={() => {
                  logOut();
                  navigate("/login", { replace: true });
                }}
              >
                Log Out
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          open={openDrawer}
          onClose={toggleDrawer}
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 240,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              {["Account", "Groups", "Settings", "Drafts"].map((text) => (
                <Link
                  to={`/${text.toLowerCase()}`}
                  key={text}
                  onClick={() => toggleDrawer()}
                >
                  <ListItem button>
                    <ListItemIcon sx={{ color: "white" }}>
                      {text === "Account" && <Account />}
                      {text === "Groups" && <Group />}
                      {text === "Settings" && <Settings />}
                      {text === "Drafts" && <Drafts />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                </Link>
              ))}
            </List>
            <Divider />
            <Box sx={{ flexGrow: 1 }}>
              <Typography align="center" sx={{ paddingTop: 5 }}>
                <img
                  height={"150px"}
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png"
                  alt="logo"
                />
              </Typography>
            </Box>
          </Box>
        </Drawer>
      </Box>
      <Button
        sx={{
          top: 65,
          left: 0,
          marginBottom: 2.5,
          visibility:
            (location.pathname === "/" ||
              location.pathname === "/groups" ||
              location.pathname === "/login" ||
              location.pathname === "/register") &&
            "hidden",
        }}
        onClick={() => navigate(-1)}
        color="inherit"
      >
        <ArrowBack /> Back
      </Button>
    </Box>
  );
};

export default Navbar;
