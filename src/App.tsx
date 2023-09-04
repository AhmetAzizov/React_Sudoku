import { MouseEvent, useState, useEffect, useRef } from "react";
import { locationToIndex } from "./utils/locationToIndex";
// @ts-ignore
import workerUrl from "./worker?worker&url";
import "./style.css";

function App() {
  const [location, _setLocation] = useState([-1, -1]);
  const [matrix, _setMatrix] = useState([] as number[]);
  const [locationRow, locationCol] = location;

  const _location = useRef(location);
  const _matrix = useRef(matrix);
  const defaultValues = useRef([] as number[]);
  let hoverIndex: number[] = [];

  const setMatrix = (value: typeof matrix) => {
    _matrix.current = value;
    _setMatrix(value);
  };

  const setLocation = (value: typeof location) => {
    _location.current = value;
    _setLocation(value);
  };

  useEffect(() => {
    document.addEventListener("keydown", detectKeyPressed);

    const myWorker = new Worker(workerUrl, { type: "module" });

    myWorker.postMessage(9);

    myWorker.onmessage = (e) => {
      const [matrix, _defaultValues] = e.data;
      defaultValues.current = _defaultValues;
      setMatrix(matrix);
    };

    return () => {
      document.removeEventListener("keydown", detectKeyPressed);
    };
  }, []);

  if (!location.includes(-1)) {
    checkSameBox(locationRow, locationCol);
  }

  function detectKeyPressed(e: KeyboardEvent) {
    const key = e.key;
    const cloneMatrix: number[] = _matrix.current.slice();

    if (_location.current.includes(-1)) return;

    let [locRow, locCol] = _location.current.slice();

    if (key == "ArrowRight") locCol++;
    else if (key == "ArrowLeft") locCol--;
    else if (key == "ArrowUp") locRow--;
    else if (key == "ArrowDown") locRow++;

    if (locRow >= 0 && locRow <= 8 && locCol >= 0 && locCol <= 8) {
      setLocation([locRow, locCol]);
    }

    if (key == "Escape") setLocation([-1, -1]);
    else if (
      document
        .getElementById(`${_location.current[0]}:${_location.current[1]}`)
        ?.classList.contains("cellInitial")
    )
      return;
    if (key == "Backspace")
      cloneMatrix[locationToIndex(_location.current[0], _location.current[1])] =
        null!;
    else if (!isNaN(+key) && +key) {
      cloneMatrix[locationToIndex(_location.current[0], _location.current[1])] =
        +key;
    }

    setMatrix(cloneMatrix);
  }

  function returnCellClass(
    currentRow: number,
    currentCol: number,
    cellValue: number
  ): string {
    var inputOdd: number =
      Math.ceil((currentRow + 1) / 3) % 2 ^ Math.ceil((currentCol + 1) / 3) % 2;

    let classList = `input input${inputOdd}`;

    if (
      defaultValues.current.includes(locationToIndex(currentRow, currentCol))
    ) {
      classList += " cellInitial";
    }

    if (!checkMatrix(matrix, currentRow, currentCol, cellValue)) {
      classList += " cellError";
    }

    if (location.includes(-1)) {
      return classList;
    }

    if (
      locationRow == currentRow ||
      locationCol == currentCol ||
      hoverIndex.includes(locationToIndex(currentRow, currentCol))
    ) {
      classList += " cellHover";
    }

    if (locationRow == currentRow && locationCol == currentCol) {
      classList += " cellActive";
    }

    return classList;
  }

  function getDivs() {
    var elementArray = [];

    for (var row = 0; row < 9; row++) {
      for (var col = 0; col < 9; col++) {
        const cellValue: number = matrix[locationToIndex(row, col)];

        var div = (
          <div
            key={`${row}:${col}`} id={`${row}:${col}`} className={returnCellClass(row, col, cellValue)}> {cellValue} </div>
        );
        elementArray.push(div);
      }
    }

    return elementArray;
  }

  let onclickFunction = (e: MouseEvent) => {
    const child = e.target as Element;

    if (!child.classList.contains("input") || child.classList.contains("cellInitial")) return;

    const [row, col] = child.id.split(":");

    setLocation([+row, +col]);
  };

  function locationToIndex(row: number, col: number): number {
    return row * 9 + col;
  }

  function checkMatrix(
    sudokuMatrix: number[],
    row: number,
    col: number,
    value: number
  ) {
    for (var i = 0; i < 9; i++) {
      if (
        (i != row && sudokuMatrix[locationToIndex(i, col)] == value) ||
        (i != col && sudokuMatrix[locationToIndex(row, i)] == value)
      )
        return false;
    }

    var startX = Math.floor(row / 3);
    var startY = Math.floor(col / 3);

    for (var x = 0; x < 3; x++) {
      var currentX = startX * 3 + x;
      for (var y = 0; y < 3; y++) {
        var currentY = startY * 3 + y;
        if (currentX == row && currentY == col) {
          continue;
        }
        if (sudokuMatrix[locationToIndex(currentX, currentY)] == value) {
          return false;
        }
      }
    }
    return true;
  }

  function checkSameBox(row: number, col: number) {
    var startX = Math.floor(row / 3);
    var startY = Math.floor(col / 3);

    for (var x = 0; x < 3; x++) {
      var currentX = startX * 3 + x;
      for (var y = 0; y < 3; y++) {
        var currentY = startY * 3 + y;

        hoverIndex.push(locationToIndex(currentX, currentY));
      }
    }
  }

  return (
    <>
      <div id="sudokuContainer" onClick={onclickFunction}>
        {getDivs()}
      </div>
    </>
  );
}

export default App;
