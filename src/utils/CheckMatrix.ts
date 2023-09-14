import { locationToIndex } from "./locationToIndex";

export function checkMatrix(sudokuMatrix: number[], row: number, col: number, value: number, format: number) {
    for (var i = 0; i < format; i++) {
        if (
            (i != row && sudokuMatrix[locationToIndex(i, col, format)] == value) ||
            (i != col && sudokuMatrix[locationToIndex(row, i, format)] == value)
        )
            return false;
    }        

    var startX = Math.floor(row / (format/3));
    var startY = Math.floor(col / 3);

    for (var x = 0; x < (format/3); x++) {
        var currentX = startX * (format/3) + x;
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