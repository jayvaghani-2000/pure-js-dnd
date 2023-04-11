import { useRef, useState } from "react";
import { handleCreateChildParentRelation } from "./constant";

function Draggable(props) {
  const { clientXRef } = props;
  const draggedElementRef = useRef();
  const dummyRef = useRef();
  const previousDraggedOverParent = useRef("");

  const [parents, setParents] = useState(handleCreateChildParentRelation());
  const [draggedOverParent, setDraggedOverParent] = useState("");
  const [draggedItem, setDraggedItem] = useState({});
  const [placeholderIndex, setPlaceholderIndex] = useState();
  const [activeDragOverParent, setActiveDragOverParent] = useState();
  const [dragXDifference, setDragXDifference] = useState(0);

  const getDraggedParentIndex = (parents, item) => {
    return parents.findIndex((parent) => parent.id === item.parentId);
  };

  const handleDragStart = (event, item) => {
    setDragXDifference(event.clientX - item.index * 120);
    setDraggedItem(item);
    event.target.style.boxShadow = "inset 0 0 10px 10px rgba(39, 43, 84, 0.5)";
  };

  const handleDragEnter = (e, targetParentId) => {
    e.preventDefault();
    e.target.style = null;
    if (Object.keys(draggedItem).length === 0) {
      return;
    }
    const targetIndex = placeholderIndex === -1 ? 0 : placeholderIndex;

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
        id: "droppable0",
        children: [],
      },
      ...updatedParents
        .filter((i) => i.children.length)
        .map((j, index) => [
          {
            id: `droppable${2 * index + 1}`,
            children: j.children.map((k, colIndex) => ({
              ...k,
              col: colIndex,
              row: index,
            })),
          },
          { id: `droppable${2 * index + 2}`, children: [] },
        ])
        .flat(),
    ];
    setParents(handleAddIntermediateDroppable);
    setDraggedItem({});
  };

  const handleDrag = (e, items) => {
    if (draggedElementRef.current) {
      draggedElementRef.current.classList.add("handleRemoveSelectedElement");
    }
    const dragBetweenIndex = Math.round(
      (clientXRef.current - dragXDifference) / 120
    );
    if (
      placeholderIndex !== dragBetweenIndex &&
      typeof clientXRef.current !== "undefined"
    ) {
      setPlaceholderIndex(dragBetweenIndex);
    }
  };

  const handleDragEnd = (e) => {
    e.target.style = null;
    if (draggedElementRef.current) {
      draggedElementRef.current.classList.remove("handleRemoveSelectedElement");
    }
    setDraggedItem({});
    setDraggedOverParent("");
    previousDraggedOverParent.current = "";
    setActiveDragOverParent(undefined);
    setDragXDifference(0);
  };

  const handleDragOverParent = (e, parentId) => {
    e.preventDefault();
    if (previousDraggedOverParent.current !== parentId) {
      setDraggedOverParent(parentId);
      previousDraggedOverParent.current = parentId;
    }
    if (parentId !== activeDragOverParent) {
      setActiveDragOverParent(parentId);
    }
  };

  const handleDropEndCapture = (e) => {
    e.preventDefault();
    if (draggedElementRef.current) {
      draggedElementRef.current.classList.remove("handleRemoveSelectedElement");
    }
    previousDraggedOverParent.current = "";
    setDraggedOverParent("");
    setActiveDragOverParent(undefined);
    setDragXDifference(0);
  };

  const renderChild = (item, index, parent) => {
    return item.id === "placeholder" ? (
      <div key={item.id} className="childPlaceholder"></div>
    ) : (
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
          item.id === draggedItem.item?.id && draggedItem.parentId === parent.id
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

  const addPlaceholderHelper = (childrens) => {
    const updatedChildren = [...childrens];
    const placeholder = { id: "placeholder", text: "" };

    if (placeholderIndex < 0) {
      updatedChildren.unshift(placeholder);
    } else {
      updatedChildren.splice(
        draggedItem.index < placeholderIndex &&
          draggedItem.parentId === activeDragOverParent
          ? placeholderIndex + 1
          : placeholderIndex,
        0,
        placeholder
      );
    }
    return updatedChildren;
  };

  return (
    <div className="container">
      {parents.map((parent) => (
        <div
          key={parent.id}
          className={`droppable ${
            draggedOverParent === parent.id ? getDragOverClass(parent) : ""
          } ${
            draggedItem.parentId === parent.id && parent.children.length === 1
              ? "activeDragWithChildOneChild"
              : ""
          }`}
          onDragOver={(e) => handleDragOverParent(e, parent.id)}
          onDrop={(e) => handleDragEnter(e, parent.id)}
          onDropCapture={handleDropEndCapture}
        >
          {parent.id === activeDragOverParent
            ? addPlaceholderHelper(parent.children).map((child, index) =>
                renderChild(child, index, parent)
              )
            : parent.children.map((child, index) =>
                renderChild(child, index, parent)
              )}
        </div>
      ))}
    </div>
  );
}

export default Draggable;
