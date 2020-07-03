import React, { useState, useEffect } from "react";

const BOARD_SIZE = 4;
const EMPTY = "EMPTY";
const DIRECTIONS = {
  UP: "up",
  DOWN: "down",
  RIGHT: "right",
  LEFT: "left",
};

const directionByKey = {
  ArrowUp: DIRECTIONS.UP,
  ArrowDown: DIRECTIONS.DOWN,
  ArrowRight: DIRECTIONS.RIGHT,
  ArrowLeft: DIRECTIONS.LEFT,
};

const tileKey = (x, y) => `x${x}y${y}`;

const setVal = ({ tiles, x, y, val }) => ({ ...tiles, [tileKey(x, y)]: val });

const initTiles = (size) => {
  let tiles = {};
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      tiles = setVal({ tiles, x, y, val: EMPTY });
    }
  }

  // return tiles;

  // TODO: testing code, remove later
  let newTiles = setVal({ tiles, x: 0, y: 1, val: 2 });
  newTiles = setVal({ tiles: newTiles, x: 1, y: 1, val: 4 });
  newTiles = setVal({ tiles: newTiles, x: 2, y: 0, val: 2 });
  newTiles = setVal({ tiles: newTiles, x: 2, y: 1, val: 8 });
  return newTiles;
};

const moveTileIfNeeded = ({ newTiles, x, y, getAheadXY }) => {
  let currentTileKey = tileKey(x, y);
  let { x: aheadX, y: aheadY } = getAheadXY(x, y);
  let aheadTileKey = tileKey(aheadX, aheadY);

  if (newTiles[currentTileKey] === EMPTY) return newTiles;

  // move until it has wall or other not empty tile ahead
  while (newTiles[aheadTileKey] && newTiles[aheadTileKey] === EMPTY) {
    newTiles = {
      ...newTiles,
      [aheadTileKey]: newTiles[currentTileKey],
      [currentTileKey]: EMPTY,
    };

    currentTileKey = aheadTileKey;
    const newAheadCoords = getAheadXY(aheadX, aheadY);
    aheadX = newAheadCoords.x;
    aheadY = newAheadCoords.y;
    aheadTileKey = tileKey(aheadX, aheadY);
  }

  // sum tiles
  if (newTiles[currentTileKey] === newTiles[aheadTileKey]) {
    return {
      ...newTiles,
      [aheadTileKey]: newTiles[currentTileKey] + newTiles[aheadTileKey],
      [currentTileKey]: EMPTY,
    };
  }

  return newTiles;
};

const moveTiles = ({ direction, tiles, size }) => {
  let newTiles = { ...tiles };

  if (direction === DIRECTIONS.UP) {
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (y - 1 < 0) continue;

        newTiles = moveTileIfNeeded({
          newTiles,
          x,
          y,
          getAheadXY: (x, y) => ({ x, y: y - 1 }),
        });
      }
    }
    return newTiles;
  }

  if (direction === DIRECTIONS.DOWN) {
    for (let x = 0; x < size; x++) {
      for (let y = size - 1; y >= 0; y--) {
        if (y + 1 > size - 1) continue;

        newTiles = moveTileIfNeeded({
          newTiles,
          x,
          y,
          getAheadXY: (x, y) => ({ x, y: y + 1 }),
        });
      }
    }
    return newTiles;
  }

  if (direction === DIRECTIONS.RIGHT) {
    for (let x = size - 1; x >= 0; x--) {
      for (let y = 0; y < size; y++) {
        if (x + 1 > size - 1) continue;

        newTiles = moveTileIfNeeded({
          newTiles,
          x,
          y,
          getAheadXY: (x, y) => ({ x: x + 1, y }),
        });
      }
    }
    return newTiles;
  }

  if (direction === DIRECTIONS.LEFT) {
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (x - 1 < 0) continue;

        newTiles = moveTileIfNeeded({
          newTiles,
          x,
          y,
          getAheadXY: (x, y) => ({ x: x - 1, y }),
        });
      }
    }
    return newTiles;
  }

  return tiles;
};

const Tile = ({ val }) => (
  <div className="tile">{val === EMPTY ? "" : `${val}`}</div>
);

const Tiles = ({ tiles }) =>
  Array(BOARD_SIZE)
    .fill()
    .map((_v, y) => (
      <div key={y} className="row">
        {Array(BOARD_SIZE)
          .fill()
          .map((_v, x) => (
            <Tile key={tileKey(x, y)} val={tiles[tileKey(x, y)]} />
          ))}
      </div>
    ));

const Board = () => {
  const [tiles, setTiles] = useState(initTiles(BOARD_SIZE));

  useEffect(() => {
    const handleKeyDown = (e) => {
      setTiles(
        moveTiles({ tiles, size: BOARD_SIZE, direction: directionByKey[e.key] })
      );
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [tiles]);

  return (
    <div className="board">
      <Tiles tiles={tiles} />
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
