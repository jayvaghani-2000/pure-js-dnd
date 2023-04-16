import React, { useRef } from "react";
import "./App.css";
import Draggable from "./components/Draggable copy";
// import Draggable from "./components/Draggable";

function App() {
  const clientXRef = useRef();

  const handleGetDragOver = (e) => {
    clientXRef.current = e.clientX;
  };

  return (
    <div className="app" onDragOver={handleGetDragOver}>
      <Draggable clientXRef={clientXRef} />
    </div>
  );
}

export default App;
