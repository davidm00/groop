import React, { useContext } from "react";

import Groups from "./Groups/Groups";
import Lists from "./Lists/Lists";
import Navbar from "../Common/Navbar/Navbar";
import AuthModule from "./Auth/Auth";
import AuthLogin from "./Auth/AuthLogin";
import AuthRegister from "./Auth/AuthRegister";
import ProtectedRoute from "../Common/ProtectedRoute/ProtectedRoute";

import {
  BrowserRouter as Router,
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
          element={<AuthModule />}
        />
        <Route
          path="/login"
          element={<AuthLogin />}
        />
        <Route
          path="/register"
          element={<AuthRegister />}
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
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </Router>
  );
}
