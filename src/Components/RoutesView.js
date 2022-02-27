import Groups from "./Groups/Groups";
import List from "./List/List";
import Navbar from "../Common/Navbar/Navbar";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function RoutesView() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route index path="/group" element={<Groups />} />
        <Route path="/group" element={<Groups />} />
        <Route path="/list/:groupId" element={<List />} />
      </Routes>
    </Router>
  );
}
