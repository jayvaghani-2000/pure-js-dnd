import { useRef, useState } from "react";
import {
  groupCardRowWise,
  INITIAL_DRAGGABLE_CHILDREN_ELEMENTS,
  reArrangeAfterDrop,
} from "./constant";
import DraggableItem from "./DraggableItem";
import Droppable from "./Droppable";

function Draggable(props) {
  const { clientXRef } = props;
  const previousDraggedOverParent = useRef("");
  const draggedItemDimension = useRef();
  const [cards, setCards] = useState(INITIAL_DRAGGABLE_CHILDREN_ELEMENTS);
  const [draggedOverParent, setDraggedOverParent] = useState("");
  const [draggedItem, setDraggedItem] = useState({});
  const [placeholderIndex, setPlaceholderIndex] = useState();
  const [activeDragOverParent, setActiveDragOverParent] = useState();
  const [dragXDifference, setDragXDifference] = useState(0);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.target.style = null;
    if (Object.keys(draggedItem).length === 0) {
      return;
    }
    const targetIndex = placeholderIndex === -1 ? 0 : placeholderIndex;
    console.log("targetIndex", targetIndex);
    const updatedParents = [...cards];
    const selectedBlock = updatedParents.findIndex(
      (i) => i.id === draggedItem.item.id
    );
    const dropOnRow = +(draggedOverParent - 1) / 2;
    const isDropOnSameRow = draggedItem.item.row === dropOnRow;
    const draggedRowBlock = updatedParents.filter(
      (i) => Number.isInteger(dropOnRow) && i.row === dropOnRow
    );

    updatedParents[selectedBlock].row = Math.round(dropOnRow);
    updatedParents[selectedBlock].col =
      targetIndex > draggedRowBlock.length
        ? draggedRowBlock.length
        : +targetIndex;

    const reArrangedBlock = reArrangeAfterDrop(
      updatedParents,
      selectedBlock,
      dropOnRow,
      draggedItem,
      draggedItem.index < placeholderIndex && isDropOnSameRow
    );
    setCards(reArrangedBlock);
    setDraggedOverParent("");
    setDraggedItem({});
  };

  const getDragOverClass = (row) => {
    return row.length > 0 ? "activeDragOverWithChild" : "activeDragOver";
  };

  const addPlaceholderHelper = (blocks) => {
    const updatedChildren = [...blocks];
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
    draggedItemDimension,
  };

  const droppableProps = {
    previousDraggedOverParent,
    setDraggedOverParent,
    activeDragOverParent,
    setActiveDragOverParent,
    setDragXDifference,
    handleDragEnter,
    draggedItemDimension,
    dragXDifference,
    setPlaceholderIndex,
    placeholderIndex,
  };

  const groupedCards = groupCardRowWise(cards);
  const cardRowKeys = Object.keys(groupedCards);

  const getColumnBlock = (rowDragOverActive, block) =>
    rowDragOverActive ? addPlaceholderHelper(block) : block;

  return (
    <div className="container">
      {cardRowKeys.map((row) => (
        <Droppable
          key={row}
          {...droppableProps}
          rowId={row}
          dragOverClassName={`droppable ${
            draggedOverParent === row ? getDragOverClass(groupedCards[row]) : ""
          } ${
            draggedItem.parentId === row && groupedCards[row].length === 1
              ? "activeDragWithChildOneChild"
              : ""
          }`}
        >
          {getColumnBlock(row === activeDragOverParent, groupedCards[row]).map(
            (col, index) => (
              <DraggableItem
                key={col.id}
                item={col}
                index={index}
                parent={row}
                {...draggableProps}
              />
            )
          )}
        </Droppable>
      ))}
    </div>
  );
}

export default Draggable;
