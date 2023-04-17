import React, { useRef } from "react";

const DraggableItem = (props) => {
  const {
    item,
    index,
    parent,
    draggedItem,
    setDragXDifference,
    setDraggedItem,
    setDraggedOverParent,
    previousDraggedOverParent,
    setActiveDragOverParent,
    draggedItemDimension,
  } = props;

  const handleDragStart = (event, item) => {
    setDragXDifference(
      event.clientX - event.target.getBoundingClientRect().left
    );
    draggedItemDimension.current = event.target.getBoundingClientRect();
    setDraggedItem(item);
    event.target.style.boxShadow = "inset 0 0 10px 10px rgba(39, 43, 84, 0.5)";
  };

  const draggedElementRef = useRef();

  const handleDrag = (e, items) => {
    if (draggedElementRef.current) {
      draggedElementRef.current.classList.add("handleRemoveSelectedElement");
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

  return item.id === "placeholder" ? (
    <div
      className="childPlaceholder"
      style={{ width: `${draggedItemDimension.current.width}px` }}
    ></div>
  ) : (
    <div
      className={`child ${
        Object.keys(draggedItem).length === 0 ? "makeChildVisible" : ""
      }`}
      id={item.id}
      draggable
      onDragStart={(e) => handleDragStart(e, { item, index, parentId: parent })}
      ref={draggedElementRef}
      onDrag={(e) => handleDrag(e, { item, index, parentId: parent })}
      onDragEnd={handleDragEnd}
    >
      <h4>{item.text}</h4>
    </div>
  );
};

export default DraggableItem;
