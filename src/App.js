import React from "react";

const BOARD_SIZE = 4;
const EMPTY_TILE = "EMPTY";

const tileKey = (x, y) => `x${x}y${y}`;

const initTiles = size => {
  const tiles = {};
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      tiles[tileKey(x, y)] = EMPTY_TILE;
    }
  }
  return tiles;
};

const setVal = ({ tiles, x, y, val }) => {
  return { ...tiles, [tileKey(x, y)]: val };
};

const tileValToStr = val => (val === EMPTY_TILE ? "" : `${val}`);

const Tile = ({ val }) => {
  return <div className="tile">{tileValToStr(val)}</div>;
};

const Board = () => {
  let tiles = initTiles(BOARD_SIZE);

  tiles = setVal({ tiles, x: 1, y: 1, val: 1024 });

  return (
    <div className="board">
      {Object.values(tiles).map(val => (
        <Tile val={val} />
      ))}
    </div>
  );
};

const App = () => {
  return (
    <div className="app">
      <div>2048</div>
      <Board />
    </div>
  );
};

export default App;
