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
