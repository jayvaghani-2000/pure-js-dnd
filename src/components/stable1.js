import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

function Stable1() {
  const [parent1, setParent1] = useState([
    { id: uuidv4(), content: "Child 1" },
    { id: uuidv4(), content: "Child 2" },
    { id: uuidv4(), content: "Child 3" },
  ]);
  const [parent2, setParent2] = useState([
    { id: uuidv4(), content: "Child 4" },
    { id: uuidv4(), content: "Child 5" },
    { id: uuidv4(), content: "Child 6" },
  ]);

  const [parent3, setParent3] = useState([]);

  const [dragged, setDragged] = useState(null);

  const parent1Ref = useRef(null);
  const parent2Ref = useRef(null);
  const parent3Ref = useRef(null);

  const handleDragStart = (e, index, parent) => {
    const draggedChild = parent === "parent1" ? parent1[index] : parent2[index];
    setDragged({
      ...draggedChild,
      parent,
      index,
    });
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDrop = (e, targetParent) => {
    e.preventDefault();
    const sourceParent = dragged.parent;

    const sourceIndex = dragged.index;
    const targetIndex = findTargetIndex(e.clientX, targetParent);
    const sourceArray = sourceParent === "parent1" ? parent1 : parent2;
    const targetArray = targetParent === "parent1" ? parent1 : parent2;

    const [sourceChild] = sourceArray.splice(sourceIndex, 1);
    targetArray.splice(targetIndex, 0, sourceChild);

    setParent1([...parent1]);
    setParent2([...parent2]);
    setDragged(null);
  };

  const handleDrag = (e, targetParent) => {
    e.preventDefault();
    const sourceParent = dragged.parent;
    const sourceIndex = dragged.index;
    const targetIndex = findTargetIndex(e.clientX, targetParent);
    console.log({ sourceParent, sourceIndex, targetIndex });
  };

  const handleDragEnd = () => {
    setDragged(null);
  };

  const findTargetIndex = (x, parent) => {
    const targetArray =
      parent === "parent1" ? parent1Ref.current : parent2Ref.current;
    const children = [...targetArray.children];
    const childWidth = children[0].getBoundingClientRect().width;
    const offsetLeft = targetArray.getBoundingClientRect().left;
    const relativeX = x - offsetLeft;
    const index = Math.round(relativeX / childWidth);
    return index > children.length ? children.length : index;
  };

  return (
    <div className="App">
      <div
        className="parent"
        ref={parent1Ref}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, "parent1")}
      >
        {parent1.map((child, index) => (
          <div
            key={child.id}
            className={`child ${
              dragged && dragged.id === child.id && dragged.parent === "parent1"
                ? "dragged"
                : ""
            }`}
            draggable
            onDrag={(e) => handleDrag(e, "parent2")}
            onDragStart={(e) => handleDragStart(e, index, "parent1")}
            onDragEnd={handleDragEnd}
          >
            {child.content}
          </div>
        ))}
      </div>
      <div
        className="parent"
        ref={parent2Ref}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, "parent2")}
      >
        {parent2.map((child, index) => (
          <div
            key={child.id}
            className={`child ${
              dragged && dragged.id === child.id && dragged.parent === "parent2"
                ? "dragged"
                : ""
            }`}
            draggable
            onDrag={(e) => handleDrag(e, "parent2")}
            onDragStart={(e) => handleDragStart(e, index, "parent2")}
            onDragEnd={handleDragEnd}
          >
            {child.content}
          </div>
        ))}
      </div>
      <div
        className="parent"
        ref={parent3Ref}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, "parent3")}
      >
        {parent3.map((child, index) => (
          <div
            key={child.id}
            className={`child ${
              dragged && dragged.id === child.id && dragged.parent === "parent3"
                ? "dragged"
                : ""
            }`}
            draggable
            onDrag={(e) => handleDrag(e, "parent3")}
            onDragStart={(e) => handleDragStart(e, index, "parent3")}
            onDragEnd={handleDragEnd}
          >
            {child.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stable1;
