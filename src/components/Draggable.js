import { useRef, useState } from "react";
import {
  groupCardRowWise,
  handleCreateChildParentRelation,
  INITIAL_DRAGGABLE_CHILDREN_ELEMENTS,
} from "./constant";
import DraggableItem from "./DraggableItem";

function Draggable(props) {
  const { clientXRef } = props;
  const previousDraggedOverParent = useRef("");

  const [parents, setParents] = useState(handleCreateChildParentRelation());
  const [cards, setCards] = useState(INITIAL_DRAGGABLE_CHILDREN_ELEMENTS);
  const [draggedOverParent, setDraggedOverParent] = useState("");
  const [draggedItem, setDraggedItem] = useState({});
  const [placeholderIndex, setPlaceholderIndex] = useState();
  const [activeDragOverParent, setActiveDragOverParent] = useState();
  const [dragXDifference, setDragXDifference] = useState(0);

  const getDraggedParentIndex = (parents, item) => {
    return parents.findIndex((parent) => parent.id === item.parentId);
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
    previousDraggedOverParent.current = "";
    setDraggedOverParent("");
    setActiveDragOverParent(undefined);
    setDragXDifference(0);
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

  const draggableProps = {
    draggedItem,
    setDragXDifference,
    setDraggedItem,
    clientXRef,
    dragXDifference,
    placeholderIndex,
    setPlaceholderIndex,
    setDraggedOverParent,
    previousDraggedOverParent,
    setActiveDragOverParent,
    handleDropEndCapture,
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
            ? addPlaceholderHelper(parent.children).map((child, index) => (
                <DraggableItem
                  key={child.id}
                  item={child}
                  index={index}
                  parent={parent}
                  {...draggableProps}
                />
              ))
            : parent.children.map((child, index) => (
                <DraggableItem
                  key={child.id}
                  item={child}
                  index={index}
                  parent={parent}
                  {...draggableProps}
                />
              ))}
        </div>
      ))}
    </div>
  );
}

export default Draggable;
