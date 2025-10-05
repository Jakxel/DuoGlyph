import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { koreanSymbols } from "../data/korean";
import Button from "./button";
import "../style/KoreanStudy.css";

const KoreanStudy: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { group } =
        (location.state as { group: string }) || {
            group: "basic",
        };

    const filteredData = koreanSymbols.filter(
        (item) => item.group === group
    );

    if (filteredData.length === 0) {
        return (
            <div className="study-container">
                <h2>No symbols found for this group.</h2>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="study-container">
            <h2>
                Study Mode — ({group})
            </h2>

            <div className="study-grid">
                {filteredData.map((symbol, index) => (
                    <div key={index} className="study-item" tabIndex={0}>
                        <div className="study-symbol">{symbol.symbol}</div>
                        <div className="study-romaji">{symbol.romanization}</div>
                    </div>
                ))}
            </div>

            <Button onClick={() => navigate(-1)} className="baseStyle" variant="primary" style={{marginBottom:"2rem"}}>
                Go Back
            </Button>
        </div>
    );
};

export default KoreanStudy;