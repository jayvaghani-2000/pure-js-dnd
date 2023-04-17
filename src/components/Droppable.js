import React, { useRef } from "react";

const Droppable = (props) => {
  const {
    activeDragOverParent,
    setActiveDragOverParent,
    children,
    rowId,
    draggedItemDimension,
    previousDraggedOverParent,
    dragXDifference,
    setDragXDifference,
    setPlaceholderIndex,
    placeholderIndex,
    draggedOverParent,
    rowBlock,
    handleDrop,
    setDraggedOverParent,
    draggedItem,
    setDraggedItem,
  } = props;
  const droppableRef = useRef();

  const handleDragOverParent = (e, parentId) => {
    e.preventDefault();
    const draggedInitialClientX = e.clientX - dragXDifference;
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

  const getDragOverClass = (row) => {
    return row.length > 0 ? "activeDragOverWithChild" : "activeDragOver";
  };

  return (
    <div
      onDragOver={(e) => handleDragOverParent(e, rowId)}
      onDrop={(e) => {
        handleDrop(
          e,
          { draggedItem, draggedOverParent, placeholderIndex },
          rowId
        );
        setDraggedOverParent("");
        setDraggedItem({});
      }}
      onDropCapture={handleDropEndCapture}
      ref={droppableRef}
      className={`droppable ${
        draggedOverParent === rowId ? getDragOverClass(rowBlock) : ""
      } ${
        draggedItem.parentId === rowId && rowBlock.length === 1
          ? "activeDragWithChildOneChild"
          : ""
      }`}
    >
      {React.Children.map(
        children({ draggedItem, placeholderIndex, activeDragOverParent }),
        (child) => {
          return React.cloneElement(child, {
            ...props,
            setDraggedItem: setDraggedItem,
            draggedItem: draggedItem,
          });
        }
      )}
    </div>
  );
};

export default Droppable;
