import { v4 as uuidv4 } from "uuid";

export const INITIAL_DRAGGABLE__ELEMENTS = [
  {
    id: "parent0",
    children: [],
  },
  {
    id: "parent1",
    children: [
      { id: uuidv4(), text: "Apple" },
      { id: uuidv4(), text: "Banana" },
      { id: uuidv4(), text: "Cat" },
    ],
  },
  {
    id: "parent2",
    children: [],
  },
  {
    id: "parent3",
    children: [
      { id: uuidv4(), text: "Dog" },
      { id: uuidv4(), text: "Elephant" },
      { id: uuidv4(), text: "Fish" },
    ],
  },
  {
    id: "parent4",
    children: [],
  },
  {
    id: "parent5",
    children: [{ id: uuidv4(), text: "Grapes" }],
  },
  {
    id: "parent6",
    children: [],
  },
];
