import React, { useState, useEffect } from "react";
import {
  EMPTY,
  BOARD_SIZE,
  tileKey,
  directionByKey,
  initTiles,
  moveTiles,
  addNewTile,
  areTilesEqual,
} from "./core";

const Tile = ({ val }) => (
  <div className={`tile tile-${val}`}>{val === EMPTY ? "" : `${val}`}</div>
);

const Tiles = ({ tiles, size }) =>
  Array(size)
    .fill()
    .map((_v, y) => (
      <div key={y} className="row">
        {Array(size)
          .fill()
          .map((_v, x) => (
            <Tile key={tileKey(x, y)} val={tiles[tileKey(x, y)]} />
          ))}
      </div>
    ));

const Board = () => {
  const size = BOARD_SIZE;
  const [tiles, setTiles] = useState(initTiles(size));

  useEffect(() => {
    const handleKeyDown = (e) => {
      const direction = directionByKey[e.key];

      // update only when direction keys pressed
      if (!direction) return;

      let newTiles = moveTiles({
        tiles,
        size,
        direction,
      });

      // should add new random tile only if tiles moved after user action
      if (!areTilesEqual(tiles, newTiles, size)) {
        newTiles = addNewTile(newTiles, size);
      }

      setTiles(newTiles);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [tiles, size]);

  return (
    <div className="board">
      <Tiles tiles={tiles} size={size} />
    </div>
  );
};

const App = () => {
  return (
    <div className="app">
      <h1>2048</h1>
      <Board />
    </div>
  );
};

export default App;
