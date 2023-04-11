import { v4 as uuidv4 } from "uuid";

export const INITIAL_DRAGGABLE__ELEMENTS = [
  {
    id: "droppable0",
    children: [],
  },
  {
    id: "droppable1",
    children: [
      { id: uuidv4(), text: "Apple" },
      { id: uuidv4(), text: "Banana" },
      { id: uuidv4(), text: "Cat" },
    ],
  },
  {
    id: "droppable2",
    children: [],
  },
  {
    id: "droppable3",
    children: [
      { id: uuidv4(), text: "Dog" },
      { id: uuidv4(), text: "Elephant" },
      { id: uuidv4(), text: "Fish" },
    ],
  },
  {
    id: "droppable4",
    children: [],
  },
  {
    id: "droppable5",
    children: [{ id: uuidv4(), text: "Grapes" }],
  },
  {
    id: "droppable6",
    children: [],
  },
];

export const INITIAL_DRAGGABLE_CHILDREN_ELEMENTS = [
  { id: uuidv4(), text: "Banana", col: 1, row: 0 },
  { id: uuidv4(), text: "Ice", col: 4, row: 0 },
  { id: uuidv4(), text: "Hand", col: 3, row: 0 },
  { id: uuidv4(), text: "Cat", col: 2, row: 0 },
  { id: uuidv4(), text: "Apple", col: 0, row: 0 },
  { id: uuidv4(), text: "Dog", col: 0, row: 1 },
  { id: uuidv4(), text: "Fish", col: 2, row: 1 },
  { id: uuidv4(), text: "Elephant", col: 1, row: 1 },
  { id: uuidv4(), text: "Grapes", col: 0, row: 2 },
];

export const handleCreateChildParentRelation = () => {
  const groupByRows = INITIAL_DRAGGABLE_CHILDREN_ELEMENTS.reduce(
    (group, child) => {
      const { row } = child;
      group[row] = group[row] ?? [];
      group[row].push(child);
      return group;
    },
    {}
  );

  const sortedCard = Object.values(groupByRows).reduce((prev, curr, index) => {
    prev[index] = curr.sort((a, b) => a.col - b.col);
    return prev;
  }, {});

  return Object.values(sortedCard).reduce(
    (prev, curr, index) => {
      prev.push({
        id: `droppable${2 * index + 1}`,
        children: curr,
      });
      prev.push({
        id: `droppable${2 * index + 2}`,
        children: [],
      });
      return prev;
    },
    [
      {
        id: "droppable0",
        children: [],
      },
    ]
  );
};
