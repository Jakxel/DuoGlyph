import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "./button";

function KoreanMenu() {
    const navigate = useNavigate();
    const [group, setGroup] = useState("");

    const handleStart = () => {
        if (group) {
            navigate("/KoreanGame", { state: { group } });
        } else {
            alert("Please select a group!");
        }
    };
     const handleStudy = () => {
        if (group) {
            navigate("/KoreanStudy", { state: { group } });
        } else {
            alert("Please select a group!");
        }
    };

    return (
        <div>
            <div className="options">
                <Button
                    selected={group === "vowel"}
                    className="baseStyle"
                    variant="secondary"
                    onClick={() => setGroup("vowel")}
                >
                    Vowel
                </Button>
                <Button
                    selected={group === "double"}
                    className="baseStyle"
                    variant="secondary"
                    onClick={() => setGroup("double")}
                >
                    Double
                </Button>
                <Button
                    selected={group === "plain"}
                    className="baseStyle"
                    variant="secondary"
                    onClick={() => setGroup("plain")}
                >
                    Plain
                </Button>
                <Button
                    selected={group === "aspirated"}
                    className="baseStyle"
                    variant="secondary"
                    onClick={() => setGroup("aspirated")}
                >
                    Aspirated
                </Button>
            </div>
            <div className="start">
                <Button onClick={handleStart}>Start</Button>
            </div>
            <div>
                <Button
                    className="baseStyle"
                    variant="primary"
                    onClick={() => navigate("/menu")}
                >
                    Go to Menu
                </Button>
                <Button className="baseStyle" variant="secondary2" onClick={handleStudy}>
                    Study
                </Button>
            </div>
        </div>
    );
}

export default KoreanMenu;