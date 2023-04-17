import React, { useRef, useState } from "react";

const DragAndDropWrapper = (props) => {
  const { children } = props;
  const [dragXDifference, setDragXDifference] = useState(0);
  const [draggedOverParent, setDraggedOverParent] = useState("");
  const [draggedItem, setDraggedItem] = useState({});
  const [activeDragOverParent, setActiveDragOverParent] = useState();
  const [placeholderIndex, setPlaceholderIndex] = useState();
  const previousDraggedOverParent = useRef("");
  const draggedItemDimension = useRef();

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          dragXDifference,
          setDragXDifference,
          draggedOverParent,
          setDraggedOverParent,
          draggedItem,
          setDraggedItem,
          placeholderIndex,
          setPlaceholderIndex,
          previousDraggedOverParent,
          draggedItemDimension,
          activeDragOverParent,
          setActiveDragOverParent
        });
      })}
    </div>
  );
};

export default DragAndDropWrapper;
