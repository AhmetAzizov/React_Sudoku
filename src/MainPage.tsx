import { Link } from "react-router-dom"
import "./style.css";
import { useGameValueContext } from "./hooks/gameValueContext";

const MainPage = () => {

    const { format, setFormat } = useGameValueContext();


    return (
        <div className="startPageWrapper">
            <div className="formatWrapper optionWrapper">
                <div className={"6x6 option " + (format == 6 && "selected")} onClick={() => setGameFormat(6)}>6 x 6</div>
                <div className={"9x9 option " + (format == 9 && "selected")} onClick={() => setGameFormat(9)}>9 x 9</div>
            </div>
            <div className="difficultyWrapper optionWrapper">
                <div className="easy option">easy</div>
                <div className="medium option">medium</div>
                <div className="hard option">hard</div>
            </div>

            {(format != 0) && <Link to="/game" className="startButton" replace>Start</Link>}
        </div>
    )



    function setGameFormat(format: number) {
        setFormat(format);
    }
}

export default MainPage;