import { locationToIndex } from "./utils/locationToIndex";

let sudokuMatrix: number[] = [];
// let matrixClone: number[] = [];
let defaultValues: number[] = [];

onmessage = (e) => {

    let format = e.data;

    const __random: number[] = Array(format).fill(0).map((_, i) => i + 1);

    creatMatrix();

    createDifficulty();

    postMessage([sudokuMatrix, defaultValues]);









    function getRandomArray(): number[] {
        return __random.sort(() => Math.random() - 0.5).slice();
    }

    function checkMatrix(sudokuMatrix: number[], row: number, col: number, value: number) {
        for (var i = 0; i < format; i++) {
            if (
                (i != row && sudokuMatrix[locationToIndex(i, col, format)] == value) ||
                (i != col && sudokuMatrix[locationToIndex(row, i, format)] == value)
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
                } else if (sudokuMatrix[locationToIndex(currentX, currentY, format)] == value) {
                    return false;
                }
            }
        }
        return true;
    }


    function createDifficulty() {

        const difficulty = 6;

        let randomIndex: number;
        let randomArray: number[];

        for (var i = 0; i < format; i++) {

            randomArray = [0, 1, 2, 3, 4, 5, 6, 7, 8]

            for (var j = 1; j < difficulty; j++) {
                randomIndex = Math.floor(Math.random() * randomArray.length);

                sudokuMatrix[locationToIndex(i, randomArray[randomIndex], format)] = null!;

                randomArray.splice(randomIndex, 1);
            }

            randomArray.forEach(value => {
                defaultValues.push(locationToIndex(i, value, format));
            })
        }
    }



    function creatMatrix() {

        var test2 = 0;
        let elapsedTime: number;

        let start: number = Date.now();

        for (var row = 0; row < format; row++) {
            var randomArray = getRandomArray();
            var test = 0;

            for (var col = 0; col < 9; col++) {
                var randomIndex: number = Math.floor(Math.random() * (randomArray.length));

                var randomValue: number = randomArray[randomIndex];

                if (checkMatrix(sudokuMatrix, row, col, randomValue)) {

                    sudokuMatrix[locationToIndex(row, col, format)] = randomValue;

                    randomArray.splice(randomIndex, 1);
                } else {
                    test++;
                    col--;
                }

                const now = Date.now();
                elapsedTime = now - start;

                if (elapsedTime > 300) {
                    start = Date.now();
                    row = -1;
                    test = 0;
                    test2 = 0;
                    sudokuMatrix = [];
                    break;
                }

                if (test > 40) {
                    // for (let index = 0; index < 9; index++) {
                    //   delete sudokuMatrix[locationToIndex(row, index + 1)];
                    //   // delete matrixClone[getIndex(row, index + 1)];
                    // }

                    sudokuMatrix.splice(locationToIndex(row, 0, format));

                    col = -1;
                    test = 0;
                    randomArray = getRandomArray();
                    test2++;

                    // console.log("log5");
                }

                if (test2 > 50) {
                    // for (let index = 0; index < 9; index++) {
                    //   // delete sudokuMatrix[locationToIndex(row - 1, index + 1)];
                    //   // delete sudokuMatrix[locationToIndex(row, index + 1)];

                    // console.log("log6");

                    sudokuMatrix.splice(locationToIndex(row - 1, 0, format));


                    //   // delete matrixClone[getIndex(row - 1, index + 1)];
                    //   // delete matrixClone[getIndex(row, index + 1)];
                    // }
                    row--;
                    if (row > -1) row--;
                    break;
                }
            }
        }

        // matrixClone = sudokuMatrix.slice();
    }

}
