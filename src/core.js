export const BOARD_SIZE = 4;

export const EMPTY = "EMPTY";

const DIRECTIONS = {
  UP: "up",
  DOWN: "down",
  RIGHT: "right",
  LEFT: "left",
};

export const directionByKey = {
  ArrowUp: DIRECTIONS.UP,
  ArrowDown: DIRECTIONS.DOWN,
  ArrowRight: DIRECTIONS.RIGHT,
  ArrowLeft: DIRECTIONS.LEFT,
};

export const tileKey = (x, y) => `x${x}y${y}`;

const setVal = ({ tiles, x, y, key, val }) => ({
  ...tiles,
  [key || tileKey(x, y)]: val,
});

export const areTilesEqual = (tilesA, tilesB, size) => {
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      let key = tileKey(x, y);
      if (tilesA[key] !== tilesB[key]) {
        return false;
      }
    }
  }
  return true;
};

const getEmptyTilesKeys = (tiles, size) => {
  const keys = [];

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      let key = tileKey(x, y);
      if (tiles[key] === EMPTY) {
        keys.push(key);
      }
    }
  }

  return keys;
};

export const addNewTile = (tiles, size) => {
  const emptyTilesKeys = getEmptyTilesKeys(tiles, size);
  const key = emptyTilesKeys[Math.floor(Math.random() * emptyTilesKeys.length)];
  const val = Math.random() < 0.9 ? 2 : 4;
  return setVal({ tiles, key, val });
};

export const initTiles = (size) => {
  let tiles = {};
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      tiles = setVal({ tiles, x, y, val: EMPTY });
    }
  }

  // add 2 tiles to initial board
  tiles = addNewTile(tiles, size);
  tiles = addNewTile(tiles, size);

  return tiles;
};

const moveTileIfNeeded = ({ newTiles, x, y, getAheadXY }) => {
  let currentTileKey = tileKey(x, y);
  let { x: aheadX, y: aheadY } = getAheadXY(x, y);
  let aheadTileKey = tileKey(aheadX, aheadY);

  // if tile is empty, we dont need to move it anywhere
  if (newTiles[currentTileKey] === EMPTY) return newTiles;

  // if tile is not empty,
  // move it while ahead tile is not board edge and empty
  while (newTiles[aheadTileKey] && newTiles[aheadTileKey] === EMPTY) {
    // move tile ahead and clear current position
    newTiles = {
      ...newTiles,
      [aheadTileKey]: newTiles[currentTileKey],
      [currentTileKey]: EMPTY,
    };

    // update current tile pointer
    currentTileKey = aheadTileKey;

    // update ahead tile pointer
    const newAheadCoords = getAheadXY(aheadX, aheadY);
    aheadX = newAheadCoords.x;
    aheadY = newAheadCoords.y;
    aheadTileKey = tileKey(aheadX, aheadY);
  }

  // if next tile is not empty and tiles has same value, sum tiles
  if (newTiles[currentTileKey] === newTiles[aheadTileKey]) {
    // save sum ahead and clear current position
    return {
      ...newTiles,
      [aheadTileKey]: newTiles[currentTileKey] + newTiles[aheadTileKey],
      [currentTileKey]: EMPTY,
    };
  }

  return newTiles;
};

export const moveTiles = ({ direction, tiles, size }) => {
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
