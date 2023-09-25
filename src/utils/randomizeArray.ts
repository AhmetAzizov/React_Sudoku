export function randomizeArray<T>(inputArray: T[]): T[] {
    return inputArray.sort(() => Math.random() - 0.5);
}