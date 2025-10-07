import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { japaneseSymbols, type SymbolData } from "../data/japanese";
import HintButton from "./HintButton";
import Button from "./button";
import '/src/style/JG.css'

const JapaneseGame: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { group, script } =
    (location.state as { group: SymbolData["group"]; script: SymbolData["script"] }) || {
      group: "",
      script: "hiragana",
    };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredData = japaneseSymbols.filter(
    (item) => item.group === group && item.script === script
  );

  const [currentSymbol, setCurrentSymbol] = useState<SymbolData | null>(null);
  const [inputLetters, setInputLetters] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [,setStatus] = useState<"idle" | "wrong" | "correct">("idle");

  useEffect(() => {
    if (filteredData.length > 0) {
      const random = getRandomSymbol();
      setCurrentSymbol(random);
      setInputLetters([]);
      setCurrentIndex(0);
      setStatus("idle");
    }
  }, [group, script]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentSymbol]);

  const getRandomSymbol = () => {
    return filteredData[Math.floor(Math.random() * filteredData.length)];
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!currentSymbol) return;

    const expected = currentSymbol.romaji.toLowerCase();
    const letter = e.key.toLowerCase();

    if (letter.length !== 1 || !letter.match(/^[a-z]$/)) return;

    if (letter === expected[currentIndex]) {
      const updated = [...inputLetters];
      updated[currentIndex] = letter;
      setInputLetters(updated);
      setCurrentIndex(currentIndex + 1);
      setStatus("idle");

      if (currentIndex + 1 === expected.length) {
        setStatus("correct");
        setTimeout(() => {
          const next = getRandomSymbol();
          setCurrentSymbol(next);
          setInputLetters([]);
          setCurrentIndex(0);
          setStatus("idle");
        }, 1000);
      }
    } else {
      const updated = [...inputLetters];
      updated[currentIndex] = letter;
      setInputLetters(updated);
      setStatus("wrong");
    }

    e.preventDefault();
  };

  if (filteredData.length === 0) {
    return (
      <div className="japanese-game__no-symbols">
        <h2>No symbols found for this group and script.</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  if (!currentSymbol) return <p>Loading...</p>;

  return (
    <div className="japanese-game">
      <h2 className="japanese-game__header">
        Script: {script} | Group: {group}
      </h2>

      <div className="japanese-game__symbol">{currentSymbol.symbol}</div>

      <input
        ref={inputRef}
        type="text"
        className="japanese-game__input"
        autoFocus
        autoComplete="off"
        inputMode="text"
        onKeyDown={handleKeyDown}

      />

      <div className="japanese-game__romaji">
        {currentSymbol.romaji.split("").map((letter, index) => {
          const userLetter = inputLetters[index];
          let colorClass = "";

          if (userLetter !== undefined) {
            colorClass =
              userLetter === letter.toLowerCase()
                ? "japanese-game__letter--correct"
                : "japanese-game__letter--wrong";
          }

          return (
            <span
              key={index}
              className={`japanese-game__letter ${colorClass}`}
            >
              {userLetter ?? "_"}
            </span>
          );
        })}
      </div>
      <div className="japanese-game__actions">
        <Button onClick={() => navigate(-1)}>Exit</Button>
        <HintButton hint={currentSymbol.romaji} inputRef={inputRef} />
      </div>
    </div>
  );
};
export default JapaneseGame;