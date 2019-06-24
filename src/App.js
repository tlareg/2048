import React, { useState, useEffect } from "react";

const BOARD_SIZE = 4;
const EMPTY_TILE_VALUE = "EMPTY";
const DIRECTIONS = {
  UP: "up",
  DOWN: "down",
  RIGHT: "right",
  LEFT: "left"
};

const directionByKey = {
  ArrowUp: DIRECTIONS.UP,
  ArrowDown: DIRECTIONS.DOWN,
  ArrowRight: DIRECTIONS.RIGHT,
  ArrowLeft: DIRECTIONS.LEFT
};

const tileKey = (x, y) => `x${x}y${y}`;

const setVal = ({ tiles, x, y, val }) => ({ ...tiles, [tileKey(x, y)]: val });

const initTiles = size => {
  const tiles = {};
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      tiles[tileKey(x, y)] = EMPTY_TILE_VALUE;
    }
  }
  return tiles;
};

const moveTiles = ({ direction, tiles, size }) => {
  const newTiles = { ...tiles };

  if (direction === DIRECTIONS.UP) {
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (y - 1 >= 0) {
          if (
            newTiles[tileKey(x, y - 1)] === EMPTY_TILE_VALUE &&
            tiles[tileKey(x, y)] !== EMPTY_TILE_VALUE
          ) {
            newTiles[tileKey(x, y - 1)] = tiles[tileKey(x, y)];
            newTiles[tileKey(x, y)] = EMPTY_TILE_VALUE;
          }
        }
      }
    }
    return newTiles;
  }

  if (direction === DIRECTIONS.DOWN) {
    for (let x = 0; x < size; x++) {
      for (let y = size - 1; y >= 0; y--) {
        if (y + 1 <= size - 1) {
          if (
            newTiles[tileKey(x, y + 1)] === EMPTY_TILE_VALUE &&
            tiles[tileKey(x, y)] !== EMPTY_TILE_VALUE
          ) {
            newTiles[tileKey(x, y + 1)] = tiles[tileKey(x, y)];
            newTiles[tileKey(x, y)] = EMPTY_TILE_VALUE;
          }
        }
      }
    }
    return newTiles;
  }

  if (direction === DIRECTIONS.RIGHT) {
    for (let x = size - 1; x >= 0; x--) {
      for (let y = 0; y < size; y++) {
        if (x + 1 <= size - 1) {
          if (
            newTiles[tileKey(x + 1, y)] === EMPTY_TILE_VALUE &&
            tiles[tileKey(x, y)] !== EMPTY_TILE_VALUE
          ) {
            newTiles[tileKey(x + 1, y)] = tiles[tileKey(x, y)];
            newTiles[tileKey(x, y)] = EMPTY_TILE_VALUE;
          }
        }
      }
    }
    return newTiles;
  }

  if (direction === DIRECTIONS.LEFT) {
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (x - 1 >= 0) {
          if (
            newTiles[tileKey(x - 1, y)] === EMPTY_TILE_VALUE &&
            tiles[tileKey(x, y)] !== EMPTY_TILE_VALUE
          ) {
            newTiles[tileKey(x - 1, y)] = tiles[tileKey(x, y)];
            newTiles[tileKey(x, y)] = EMPTY_TILE_VALUE;
          }
        }
      }
    }
    return newTiles;
  }

  return tiles;
};

const tileValToStr = val => (val === EMPTY_TILE_VALUE ? "" : `${val}`);
const Tile = ({ val }) => <div className="tile">{tileValToStr(val)}</div>;

const renderTiles = tiles =>
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
    let newTiles = setVal({ tiles, x: 0, y: 1, val: 2 });
    newTiles = setVal({ tiles: newTiles, x: 1, y: 1, val: 4 });
    newTiles = setVal({ tiles: newTiles, x: 2, y: 0, val: 2 });
    newTiles = setVal({ tiles: newTiles, x: 2, y: 1, val: 8 });
    setTiles(newTiles);
  }, []);

  useEffect(() => {
    const handleKeyDown = e => {
      setTiles(
        moveTiles({ tiles, size: BOARD_SIZE, direction: directionByKey[e.key] })
      );
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [tiles, moveTiles, directionByKey]);

  return <div className="board">{renderTiles(tiles)}</div>;
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
