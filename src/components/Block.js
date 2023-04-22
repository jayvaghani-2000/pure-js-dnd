import { useState } from "react";
import {
  groupCardRowWise,
  INITIAL_DRAGGABLE_CHILDREN_ELEMENTS,
  reArrangeAfterDrop,
} from "./constant";
import DragAndDropWrapper from "./DragAndDropWrapper";
import DraggableItem from "./DraggableItem";
import Droppable from "./Droppable";

function Block(props) {
  const { clientXRef } = props;
  const [cards, setCards] = useState(INITIAL_DRAGGABLE_CHILDREN_ELEMENTS);

  const handleDropBlock = (e, draggedInfo) => {
    e.preventDefault();
    e.target.style = null;
    const { draggedItem, draggedOverParent, placeholderIndex } = draggedInfo;
    if (Object.keys(draggedItem).length === 0) {
      return;
    }
    const targetIndex = placeholderIndex === -1 ? 0 : placeholderIndex;
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
  };

  const addPlaceholderHelper = (blocks, draggedInfo) => {
    const { draggedItem, placeholderIndex, activeDragOverParent } = draggedInfo;
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

  const groupedCards = groupCardRowWise(cards);
  const cardRowKeys = Object.keys(groupedCards);

  const getColumnBlock = (rowDragOverActive, block, draggedInfo) =>
    rowDragOverActive ? addPlaceholderHelper(block, draggedInfo) : block;

  const draggableBlocks = (draggedInfo, row) => {
    return getColumnBlock(
      row === draggedInfo.activeDragOverParent,
      groupedCards[row],
      draggedInfo
    ).map((col, index) => (
      <DraggableItem
        key={col.id}
        item={col}
        index={index}
        parent={row}
        clientXRef={clientXRef}
      />
    ));
  };

  return (
    <div className="container">
      <DragAndDropWrapper>
        {cardRowKeys.map((row) => (
          <Droppable
            key={row}
            rowId={row}
            rowBlock={groupedCards[row]}
            handleDrop={handleDropBlock}
          >
            {(draggedInfo) => draggableBlocks(draggedInfo, row)}
          </Droppable>
        ))}
      </DragAndDropWrapper>
    </div>
  );
}

export default Block;
