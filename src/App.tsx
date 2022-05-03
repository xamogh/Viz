import * as React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import BubbleSort from "./pages/BubbleSort";
import Home from "./pages/Home";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="bubblesort" element={<BubbleSort />} />
      </Routes>
    </div>
  );
}

export default App;
