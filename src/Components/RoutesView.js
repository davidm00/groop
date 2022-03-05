import React from "react";
import Groups from "./Groups/Groups";
import Lists from "./Lists/Lists";
import Navbar from "../Common/Navbar/Navbar";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function RoutesView() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route index path="/" element={<Groups />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/list/:groupId" element={<Lists />} />
      </Routes>
    </Router>
  );
}
