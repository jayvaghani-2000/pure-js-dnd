import React, { useRef } from "react";

const Droppable = (props) => {
  const {
    children,
    previousDraggedOverParent,
    setDraggedOverParent,
    activeDragOverParent,
    setActiveDragOverParent,
    rowId,
    setDragXDifference,
    handleDragEnter,
    dragOverClassName = "",
  } = props;
  const droppableRef = useRef();

  const handleDragOverParent = (e, parentId) => {
    e.preventDefault();

    for (let i = 0; i < droppableRef.current.children.length; i++) {
      console.log(
        droppableRef.current.children[i].getBoundingClientRect().width
      );
    }


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
    setActiveDragOverParent(undefined);
    setDragXDifference(0);
  };

  return (
    <div
      onDragOver={(e) => handleDragOverParent(e, rowId)}
      onDrop={(e) => handleDragEnter(e, rowId)}
      onDropCapture={handleDropEndCapture}
      className={dragOverClassName}
      ref={droppableRef}
    >
      {children}
    </div>
  );
};

export default Droppable;
