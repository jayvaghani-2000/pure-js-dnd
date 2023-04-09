import { useRef, useState } from "react";
import { INITIAL_DRAGGABLE__ELEMENTS } from "./constant";

function Draggable() {
  const [parents, setParents] = useState(INITIAL_DRAGGABLE__ELEMENTS);
  const draggedElementRef = useRef();
  const dummyRef = useRef();
  const previousDraggedOverParent = useRef("");
  const previousPlaceHolder = useRef({});
  const [draggedOverParent, setDraggedOverParent] = useState("");
  const [draggedItem, setDraggedItem] = useState({});
  const [placeholderIndex, setPlaceholderIndex] = useState({});

  const getDraggedParentIndex = (parents, item) => {
    return parents.findIndex((parent) => parent.id === item.parentId);
  };

  const handleDragStart = (event, item) => {
    setDraggedItem(item);
  };

  const handleDragEnter = (e, targetParentId) => {
    e.preventDefault();
    if (Object.keys(draggedItem).length === 0) {
      return;
    }
    const droppingElementPosition = Math.round(e.clientX / 100) - 1;
    const targetIndex = droppingElementPosition;

    const updatedParents = [...parents];
    const draggedParentIndex = getDraggedParentIndex(
      updatedParents,
      draggedItem
    );
    const targetParentIndex = parents.findIndex(
      (parent) => parent.id === targetParentId
    );

    const filteredChildren = updatedParents[draggedParentIndex].children.filter(
      (_, index) => index !== draggedItem.index
    );
    const draggedChild =
      updatedParents[draggedParentIndex].children[draggedItem.index];

    if (draggedParentIndex === targetParentIndex) {
      filteredChildren.splice(targetIndex, 0, draggedChild);
      updatedParents[draggedParentIndex].children = filteredChildren;
    } else {
      const targetChildren = updatedParents[targetParentIndex].children;
      targetChildren.splice(targetIndex, 0, draggedChild);
      updatedParents[targetParentIndex].children = targetChildren;

      updatedParents[draggedParentIndex].children = filteredChildren;
    }

    const handleAddIntermediateDroppable = [
      {
        id: "parent0",
        children: [],
      },
      ...updatedParents
        .filter((i) => i.children.length)
        .map((j, index) => [
          { ...j, id: `parent${2 * index + 1}` },
          { id: `parent${2 * index + 2}`, children: [] },
        ])
        .flat(),
    ];

    setParents(handleAddIntermediateDroppable);
  };

  const handleDrag = (event, items) => {
    if (draggedElementRef.current) {
      draggedElementRef.current.style.display = "none";
    }
  };

  const handleDragEnd = () => {
    if (draggedElementRef.current) {
      draggedElementRef.current.style.display = "block";
    }
    setDraggedItem({});
    setPlaceholderIndex({});
    setDraggedOverParent("");
    previousPlaceHolder.current = {};
    previousDraggedOverParent.current = "";
  };

  const handleDragOverParent = (e, parentId) => {
    e.preventDefault();
    if (previousDraggedOverParent.current !== parentId) {
      setDraggedOverParent(parentId);
      previousDraggedOverParent.current = parentId;
    }
  };

  const handleDropEndCapture = (e) => {
    e.preventDefault();
    if (draggedElementRef.current) {
      draggedElementRef.current.style.display = "block";
    }
    previousDraggedOverParent.current = "";
    previousPlaceHolder.current = {};
    setDraggedOverParent("");
    setPlaceholderIndex({});
  };

  const renderChild = (item, index, parent) => {
    return (
      <div
        key={item.id}
        className={`child ${
          Object.keys(draggedItem).length === 0 ? "makeChildVisible" : ""
        }`}
        id={item.id}
        draggable
        onDragStart={(e) =>
          handleDragStart(e, { item, index, parentId: parent.id })
        }
        ref={
          index === draggedItem.index && draggedItem.parentId === parent.id
            ? draggedElementRef
            : dummyRef
        }
        onDrag={(e) => handleDrag(e, { item, index, parentId: parent.id })}
        onDragEnd={handleDragEnd}
      >
        <h4>{item.text}</h4>
      </div>
    );
  };

  const getDragOverClass = (parent) => {
    return parent.children.length > 0
      ? "activeDragOverWithChild"
      : "activeDragOver";
  };

  return (
    <div className="container">
      {parents.map((parent) => (
        <div
          key={parent.id}
          className={`parent ${
            draggedOverParent === parent.id ? getDragOverClass(parent) : ""
          } ${
            draggedItem.parentId === parent.id
              ? "activeDragWithChildOneChild"
              : ""
          }`}
          onDragOver={(e) => handleDragOverParent(e, parent.id)}
          onDrop={(e) => handleDragEnter(e, parent.id)}
          onDropCapture={handleDropEndCapture}
        >
          {parent.children.map((child, index) =>
            renderChild(child, index, parent)
          )}
        </div>
      ))}
    </div>
  );
}

export default Draggable;
