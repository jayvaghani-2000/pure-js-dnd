import React, { useRef } from "react";
import "./App.css";
import Block from "./components/Block";

function App() {
  const clientXRef = useRef();

  const handleGetDragOver = (e) => {
    clientXRef.current = e.clientX;
  };

  return (
    <div className="app" onDragOver={handleGetDragOver}>
      <Block clientXRef={clientXRef} />
    </div>
  );
}

export default App;
