import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { japaneseSymbols, type SymbolData } from "../data/japanese";
import Button from "./button";
import "../style/JapaneseStudy.css"

const JapaneseStudy: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { group, script } =
    (location.state as { group: SymbolData["group"]; script: SymbolData["script"] }) || {
      group: "basic",
      script: "hiragana",
    };

  const filteredData = japaneseSymbols.filter(
    (item) => item.group === group && item.script === script
  );

  if (filteredData.length === 0) {
    return (
      <div className="study-container">
        <h2>No symbols found for this group and script.</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="study-container">
      <h2>
        Study Mode — {script.toUpperCase()} ({group})
      </h2>

      <div className="study-grid">
        {filteredData.map((symbol, index) => (
          <div key={index} className="study-item" tabIndex={0}>
            <div className="study-symbol">{symbol.symbol}</div>
            <div className="study-romaji">{symbol.romaji}</div>
          </div>
        ))}
      </div>

      <Button onClick={() => navigate(-1)} className="baseStyle" variant="primary" style={{marginBottom:"2rem"}}>
        Go Back
      </Button>
    </div>
  );
};

export default JapaneseStudy;