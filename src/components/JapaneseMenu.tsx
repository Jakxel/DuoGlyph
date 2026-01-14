import Button from './button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function JapaneseMenu() {
    const navigate = useNavigate();
    const [script, setScript] = useState("none");
    const [group, setGroup] = useState("none");

    const handleStart = () => {
        if (script !== "none" && group !== "none") {
            navigate("/JapaneseGame", { state: { script, group } });
        } else {
            alert("Please select both script and group.");
        }
    };
     const handleStudy = () => {
        if (group) {
            navigate("/JapaneseStudy", { state: {script, group } });
        } else {
            alert("Please select a group!");
        }
    };

    return (
        <div>
            <div className="options">
                <div className="script">
                    <Button selected={script === "hiragana"} onClick={() => setScript("hiragana")}>Hiragana</Button>
                    <Button selected={script === "katakana"} onClick={() => setScript("katakana")}>Katakana</Button>
                </div>
                <div className="group">
                    <Button selected={group === "basic"} variant="secondary" onClick={() => setGroup("basic")}>Basic</Button>
                    <Button selected={group === "dakuon"} variant="secondary" onClick={() => setGroup("dakuon")}>Dakuon</Button>
                    <Button selected={group === "handakuon"} variant="secondary" onClick={() => setGroup("handakuon")}>Handakuon</Button>
                    <Button selected={group === "combo"} variant="secondary" onClick={() => setGroup("combo")}>Combo</Button>
                </div>
            </div>
            <div className="start">
                <Button variant="primary" onClick={handleStart}>Start</Button>
            </div>
            <div>
                <Button variant="primary" onClick={() => navigate('/menu')}> Languages</Button>
                <Button className="baseStyle" variant="secondary2" onClick={handleStudy}>
                    Study
                </Button>
            </div>
        </div>
    );
}
