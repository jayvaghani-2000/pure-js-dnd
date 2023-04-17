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
    draggedItemDimension,
    dragXDifference,
    setPlaceholderIndex,
    placeholderIndex,
  } = props;
  const droppableRef = useRef();

  const handleDragOverParent = (e, parentId) => {
    e.preventDefault();
    const { width } = draggedItemDimension.current;

    const draggedInitialClientX = e.clientX - dragXDifference;
    const draggedLastClientX = e.clientX + width - dragXDifference;
    const draggedMiddleClientX =
      (draggedInitialClientX + draggedLastClientX) / 2;

    const children = [];
    let passPlaceholder = false;

    for (let i = 0; i < droppableRef.current.children.length; i++) {
      if (droppableRef.current.children[i].getBoundingClientRect().width) {
        if (
          droppableRef.current.children[i].classList.value ===
          "childPlaceholder"
        ) {
          passPlaceholder = true;
          continue;
        }

        const { width, left } =
          droppableRef.current.children[i].getBoundingClientRect();
        children.push({
          width,
          left: passPlaceholder
            ? left - draggedItemDimension.current.width
            : left,
        });
      }
    }

    let indexForPlaceHolder = 0;
    for (let i = 0; i < children.length; i++) {
      const { width, left } = children[i];
      const elementMiddle = left + width / 2;
      if (draggedInitialClientX < elementMiddle) {
        indexForPlaceHolder = i;
        break;
      }
      indexForPlaceHolder = children.length;
    }

    if (placeholderIndex !== indexForPlaceHolder) {
      console.log("indexForPlaceHolder", indexForPlaceHolder);
      setPlaceholderIndex(indexForPlaceHolder);
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
