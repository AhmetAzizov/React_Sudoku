import { Link } from "react-router-dom"
import "./style.css";
import { useGameValueContext } from "./hooks/gameValueContext";

const MainPage = () => {

    const { format, setFormat, difficulty, setDifficulty } = useGameValueContext();

    return (
        <div className="startPageWrapper">
            <div className="formatWrapper optionWrapper">
                <div className={"6x6 option " + (format === 6 && "selected")} onClick={() => setFormat(6)}>6 x 6</div>
                <div className={"9x9 option " + (format === 9 && "selected")} onClick={() => setFormat(9)}>9 x 9</div>
            </div>
            <div className="difficultyWrapper optionWrapper">
                <div className={"easy option " + (difficulty === 3 && "selected")} onClick={() => setDifficulty(3)}>easy</div>
                <div className={"medium option " + (difficulty === 4 && "selected")} onClick={() => setDifficulty(4)}>medium</div>
                <div className={"hard option " + (difficulty === 5 && "selected")} onClick={() => setDifficulty(5)}>hard</div>
            </div>

            {(format != 0) && (difficulty != 0) && <Link to="/game" className="startButton" replace>Start</Link>}
        </div>
    )
}

export default MainPage;