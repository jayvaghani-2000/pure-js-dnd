import React, { useState } from "react";
import "./App.css";
import Stable from "./components/stable";

// function App() {
//   const [spans, setSpans] = useState(["1", "2", "3", "4", "5"]);

//   const addSpan = (index) => {
//     const newSpans = [...spans];
//     newSpans.splice(index, 0, "new");
//     setSpans(newSpans);
//   };

//   return (
//     <div className="container">
//       {spans.map((span, index) => (
//         <div
//           key={span}
//           style={{
//             transition: "all 0.5s",
//             transform: `translateX(${index * 60}px)`,
//           }}
//         >
//           {span}
//         </div>
//       ))}
//       <button onClick={() => addSpan(2)}>Add new span</button>
//     </div>
//   );
// }
function App() {
  return (
    <div className="App">
      <Stable />
    </div>
  );
}

export default App;
