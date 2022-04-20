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
  Stack,
} from "@mui/material";
import {
  ManageAccounts as Account,
  Group,
  Settings,
  Drafts,
  ChevronLeft,
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { UserContext } from "../../Context/userContext";

const font = "'Francois One', sans-serif";

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
  navTitle: {
    fontFamily: font,
    height: "100%",
    padding: "15px 10px",
    boxShadow: 0,
    transition: "boxShadow 1s",
    "&:hover": {
      // backgroundColor: theme.palette.secondary.dark,
      boxShadow: " 0 8px 16px 0 rgba(0, 0, 0, 0.4)",
      cursor: "pointer",
    },
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const { localUser, setLocalUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);
  const location = useLocation();

  // useEffect(() => {
  //   console.log('Location changed');
  // }, [location]);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const logOut = async () => {
    Parse.User.logOut();
    setLocalUser(null);
  };


  return (
    <Box maxWidth={"100%"} sx={{ flexGrow: 1 }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          className={classes.appBar}
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Stack
              width={"100%"}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={4}
            >
              <Stack
                direction="row"
                justifyContent="start"
                alignItems="center"
                spacing={0}
              >
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="back"
                  sx={{
                    display:
                      (location.pathname === "/" ||
                        location.pathname === "/groups" ||
                        location.pathname === "/login" ||
                        location.pathname === "/register") &&
                      "none",
                  }}
                  onClick={() => navigate(-1)}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  size="large"
                  color="inherit"
                  aria-label="menu"
                  edge="start"
                  sx={{ mr: 0 }}
                  onClick={() => toggleDrawer()}
                >
                  <MenuIcon />
                </IconButton>
              </Stack>
              <Typography
                className={classes.navTitle}
                variant="h6"
                component="div"
                m={2}
                sx={{ flexGrow: 0 }}
                onClick={() => navigate("/", { replace: true })}
              >
                Groop
              </Typography>
              {/* {localUser && (
                <Typography
                  sx={{
                    display:
                      (location.pathname !== "/account" ||
                        location.pathname !== "/login" ||
                        location.pathname !== "/register") &&
                      "block",
                  }}
                ></Typography>
              )} */}
              {localUser ? (
                <Button
                  color="inherit"
                  sx={{
                    display:
                      (location.pathname === "/account" ||
                        location.pathname === "/login" ||
                        location.pathname === "/register") &&
                      "none",
                  }}
                  onClick={() => {
                    logOut();
                    navigate("/login", { replace: true });
                  }}
                >
                  Log Out
                </Button>
              ) : (
                <Typography
                // sx={{
                //   display:
                //     (location.pathname == "/account" ||
                //       location.pathname !== "/login" ||
                //       location.pathname !== "/register") &&
                //     "block",
                // }}
                ></Typography>
              )}
            </Stack>
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
      {/* <Button
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
      </Button> */}
    </Box>
  );
};

export default Navbar;
