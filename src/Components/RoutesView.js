import React, { useContext } from "react";

import Account from "./Account/Account";
import Groups from "./Groups/Groups";
import Lists from "./Lists/Lists";
import Items from "./Items/Items";
import Navbar from "../Common/Navbar/Navbar";
import Home from "./Home/Home";
import AuthLogin from "../Common/Auth/AuthLogin";
import AuthRegister from "../Common/Auth/AuthRegister";
import ProtectedRoute from "../Common/ProtectedRoute/ProtectedRoute";

import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { UserContext } from "../Context/userContext";

export default function RoutesView() {
  const { localUser } = useContext(UserContext);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          index
          path="/"
          element={<Home />}
        />
        <Route
          path="/login"
          element={!localUser ? <AuthLogin /> : <Navigate to="/"/>}
        />
        <Route
          path="/register"
          element={!localUser ? <AuthRegister /> : <Navigate to="/"/>}
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute user={localUser}>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <ProtectedRoute user={localUser}>
              <Groups />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list/:groupId"
          element={
            <ProtectedRoute user={localUser}>
              <Lists />
            </ProtectedRoute>
          }
        />
        <Route
          path="/item/:listId"
          element={
            <ProtectedRoute user={localUser}>
              <Items />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </Router>
  );
}
