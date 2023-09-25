import { MouseEvent, useState, useEffect, useRef, useMemo } from "react";
import { locationToIndex } from "./utils/locationToIndex";
import { checkMatrix } from "./utils/CheckMatrix";
// @ts-ignore
import calculationWorkerUrl from "./CalculationWorker?worker&url";
import "./style.css";
import { useGameValueContext } from "./hooks/gameValueContext";
import { useNavigate } from "react-router-dom";

const MatrixComponent = () => {
    const { format, difficulty: _difficulty } = useGameValueContext();
    const difficulty = format === 6 ? _difficulty : _difficulty * 1.5;

    const navigate = useNavigate();
    const [location, _setLocation] = useState([-1, -1]);
    const [matrix, _setMatrix] = useState([] as number[]);
    const [locationRow, locationCol] = location;

    const _location = useRef(location);
    const _matrix = useRef(matrix);
    const defaultValues = useRef([] as number[]);
    const hoverIndex = useRef([] as number[]);
    const errorArray = useRef([] as number[]);

    function setMatrix(value: typeof matrix) {
        _matrix.current = value;
        _setMatrix(value);
    };

    function setLocation(value: typeof location) {
        _location.current = value;
        _setLocation(value);
    };

    useEffect(() => {
        if (format == 0) navigate("/");

        window.addEventListener("beforeunload", handleReload);
        document.addEventListener("keydown", detectKeyPressed);
        document.addEventListener("click", onScreenPressedUnfocus);

        const calculationWorker = new Worker(calculationWorkerUrl, { type: "module" });

        calculationWorker.postMessage([format, difficulty]);

        calculationWorker.onmessage = (e: MessageEvent<[number[], number[]]>) => {
            const [matrix, _defaultValues] = e.data;
            querySelector('.loadingScreen').classList.add('gone');
            defaultValues.current = _defaultValues;
            setMatrix(matrix);
        };


        // fetch('http://localhost:3500/')
        //     .then(res => res.json())
        //     .then(json => {
        //         const { matrix, defaultvalues }: { matrix: number[], defaultvalues: number[] } = json;

        //         querySelector('.loadingScreen').classList.add('gone');
        //         defaultValues.current = defaultvalues;
        //         setMatrix(matrix);
        //     })

        return () => {
            calculationWorker.terminate();
            document.removeEventListener("keydown", detectKeyPressed);
            document.removeEventListener("click", onScreenPressedUnfocus);
            window.removeEventListener("beforeunload", handleReload);
        };
    }, []);


    useMemo(() => {
        if (location.includes(-1)) return;

        hoverIndex.current = [];

        const startX = Math.floor(locationRow / (format / 3));
        const startY = Math.floor(locationCol / 3);

        for (let x = 0; x < (format / 3); x++) {
            const currentX = startX * (format / 3) + x;
            for (let y = 0; y < 3; y++) {
                const currentY = startY * 3 + y;

                hoverIndex.current.push(locationToIndex(currentX, currentY, format));
            }
        }
    }, [location])

    useMemo(() => {
        errorArray.current = [];

        for (let row = 0; row < format; row++) {
            for (let col = 0; col < format; col++) {
                if (!checkMatrix(matrix, row, col, matrix[locationToIndex(row, col, format)], format)) {
                    errorArray.current.push(locationToIndex(row, col, format));
                }
            }
        }
    }, [matrix])

    return (
        <>
            <div className="loadingScreen"></div>
            <div className="sudokuWrapper">
                <div
                    className="sudokuContainer"
                    onClick={onClickFunction}
                    style={{
                        gridTemplateColumns: `repeat(${format}, 1fr)`,
                        gridTemplateRows: `repeat(${format}, 1fr)`
                    }}
                >
                    {returnCells()}
                </div>
            </div>
        </>
    );








    function returnCellClass(currentRow: number, currentCol: number): string {
        const inputOdd: number = Math.ceil((currentRow + 1) / (format / 3)) % 2 ^ Math.ceil((currentCol + 1) / 3) % 2;

        let classList = `input input${inputOdd}`;

        if (defaultValues.current.includes(locationToIndex(currentRow, currentCol, format))) {
            classList += " cellInitial";
        }

        if (errorArray.current.includes(locationToIndex(currentRow, currentCol, format))) {
            classList += " cellError";
        }

        if (location.includes(-1)) {
            return classList;
        }

        if (locationRow == currentRow || locationCol == currentCol || hoverIndex.current.includes(locationToIndex(currentRow, currentCol, format))) {
            classList += " cellHover";
        }

        if (locationRow == currentRow && locationCol == currentCol) {
            classList += " cellActive";
        }

        return classList;
    }

    function querySelector(selector: string) {
        const element = document.querySelector(selector);

        if (element === null) {
            throw new Error("The element you are trying to access is null");
        }

        return element;
    }

    function onClickFunction(e: MouseEvent) {
        const child = e.target as Element;

        if (!child.classList.contains("input")) return;

        const row = child.getAttribute("data-row")!;
        const col = child.getAttribute("data-col")!;

        setLocation([+row, +col]);
    };

    function returnCells() {
        const elementArray: Array<JSX.Element> = [];

        for (let row = 0; row < format; row++) {
            for (let col = 0; col < format; col++) {
                const cellValue: number = matrix[locationToIndex(row, col, format)];

                elementArray.push(
                    <div
                        key={`cell${row}:${col}`}
                        id={`cell${row}:${col}`}
                        data-row={row}
                        data-col={col}
                        className={returnCellClass(row, col)}
                    >
                        <div
                            className="placeholder"
                            id={`p${row}:${col}`}
                            key={`p${row}:${col}`}
                        >
                            {/* {cellValue} */}
                        </div>
                        {cellValue}
                    </div>
                );
            }
        }

        return elementArray;
    }

    function detectKeyPressed(e: KeyboardEvent) {
        const key = e.key;
        const cloneMatrix: number[] = _matrix.current.slice();

        if (_location.current.includes(-1)) return;

        let [locRow, locCol] = _location.current.slice();

        if (key.includes("Arrow")) {
            switch (key) {
                case "ArrowRight": locCol++; break;
                case "ArrowLeft": locCol--; break;
                case "ArrowUp": locRow--; break;
                case "ArrowDown": locRow++;
            }

            if (locRow >= 0 && locRow < format && locCol >= 0 && locCol < format) {
                setLocation([locRow, locCol]);
                return;
            }
        }

        if (key == "Escape")
            setLocation([-1, -1]);
        else if (defaultValues.current.includes(locationToIndex(locRow, locCol, format)))
            return;
        if (key == "Backspace")
            cloneMatrix[locationToIndex(_location.current[0], _location.current[1], format)] = null!;
        else if (!isNaN(+key) && 0 < +key && +key <= format)
            cloneMatrix[locationToIndex(_location.current[0], _location.current[1], format)] = +key;

        setMatrix(cloneMatrix);
    }

    function onScreenPressedUnfocus(e: globalThis.MouseEvent) {
        if (!querySelector(".sudokuContainer").contains(e.target as Element))
            setLocation([-1, -1])
    }

    function handleReload(e: BeforeUnloadEvent) {
        e.preventDefault();
        return e.returnValue = "message"
    }
}

export default MatrixComponent;

