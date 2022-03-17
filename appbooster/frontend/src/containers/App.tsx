import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Currencies from "./Currencies";
import Converter from "./Converter";
import Header from "../components/Header";

function App() {
  return (
    <div className="container">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Converter />} />
          <Route path="/currencies" element={<Currencies />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
