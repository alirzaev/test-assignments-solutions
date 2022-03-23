import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Search from "../Search";
import Repository from "../Repository";

import "./index.css";

export default function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/repo/:owner/:repo" element={<Repository />} />
        </Routes>
      </Router>
    </div>
  );
}
