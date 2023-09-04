
export function locationToIndex(row: number, col: number, format: number): number {
    return row * format + col;
}