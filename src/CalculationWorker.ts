import { locationToIndex } from "./utils/locationToIndex";
import { checkMatrix } from "./utils/CheckMatrix";
import { randomizeArray } from "./utils/randomizeArray";

let sudokuMatrix: number[] = [];
const defaultValues: number[] = [];

self.onmessage = (e: MessageEvent<[number, number]>) => {
  const [format, difficulty] = e.data;

  creatMatrix({ format, difficulty });

  createDifficulty({ format, difficulty });

  self.postMessage([sudokuMatrix, defaultValues]);
};

type gameData = {
  format: number;
  difficulty: number;
}

function createDifficulty({ format, difficulty }: gameData) {
  let randomIndex: number;
  let randomArray: number[];

  for (let i = 0; i < format; i++) {
    randomArray = Array(format).fill(0).map((_, i) => i);

    for (let j = 1; j < difficulty; j++) {
      randomIndex = Math.floor(Math.random() * randomArray.length);

      sudokuMatrix[locationToIndex(i, randomArray[randomIndex], format)] = null!;

      randomArray.splice(randomIndex, 1);
    }

    randomArray.forEach((value) => {
      defaultValues.push(locationToIndex(i, value, format));
    });
  }
}

function creatMatrix({ format }: gameData) {
  let testRow = 0;
  const start = Date.now();
  let previousArray = Array(format).fill(0).map((_, i) => i + 1);

  for (let row = 0; row < format; row++) {
    const start = Date.now();
    let testCol = 0;

    const randomArray = randomizeArray(previousArray);
    previousArray = randomArray.slice();

    for (let col = 0; col < format; col++) {
      const randomIndex: number = Math.floor(Math.random() * randomArray.length);
      const randomValue: number = randomArray[randomIndex];

      if (checkMatrix(sudokuMatrix, row, col, randomValue, format)) {
        sudokuMatrix[locationToIndex(row, col, format)] = randomValue;
        randomArray.splice(randomIndex, 1);
      } else {
        testCol++;
        col--;
      }

      const now = Date.now();
      if ((now - start) > 70) {
        row = -1;
        testRow = 0;
        sudokuMatrix = [];
        break;
      }


      if (testCol > 30) {
        sudokuMatrix.splice(locationToIndex(row, 0, format));
        row--;
        testCol = 0;
        console.log("test1 row: " + row);

        if (++testRow > 40) {
          sudokuMatrix.splice(locationToIndex(row - 1, 0, format));
          testRow = 0;
          if (row > -1) row--;
          console.log("test2 row: " + row);
        }
        break;
      }
    }
  }

  const end = Date.now();

  console.log(end - start);
}