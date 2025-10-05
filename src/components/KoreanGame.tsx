import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { koreanSymbols, type HangulSymbol } from "../data/korean";
import HintButton from "./HintButton";
import "../style/KoreanGame.css"
import Button from "./button";

const KoreanGame: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { group } =
    (location.state as { group: HangulSymbol["group"] }) || { group: "vowel" };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredData = koreanSymbols.filter((item) => item.group === group);

  const [currentSymbol, setCurrentSymbol] = useState<HangulSymbol | null>(null);
  const [inputLetters, setInputLetters] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setStatus] = useState<"idle" | "wrong" | "correct">("idle");

  useEffect(() => {
    if (filteredData.length > 0) {
      const random = getRandomSymbol();
      setCurrentSymbol(random);
      setInputLetters([]);
      setCurrentIndex(0);
      setStatus("idle");
    }
  }, [group]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentSymbol]);

  const getRandomSymbol = () => {
    return filteredData[Math.floor(Math.random() * filteredData.length)];
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!currentSymbol) return;

    const expected = currentSymbol.romanization.toLowerCase();
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
      <div className="korean-game__empty">
        <h2>No symbols found for this group.</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  if (!currentSymbol) return <p>Loading...</p>;

  return (
    <div className="korean-game">
      <h2 className="korean-game__title">Hangul | Group: {group}</h2>

      <div className="korean-game__symbol">{currentSymbol.symbol}</div>

      <input
        type="text"
        ref={inputRef}
        onKeyDown={handleKeyDown}
        className="korean-game__input"
        autoFocus
      />

      <div className="korean-game__romanization">
        {currentSymbol.romanization.split("").map((letter, index) => {
          const userLetter = inputLetters[index];
          let colorClass = "";

          if (userLetter !== undefined) {
            colorClass =
              userLetter === letter.toLowerCase()
                ? "korean-game__letter--correct"
                : "korean-game__letter--wrong";
          }

          return (
            <span
              key={index}
              className={`korean-game__letter ${colorClass}`}
            >
              {userLetter ?? "_"}
            </span>
          );
        })}
      </div>

      <div className="korean-game__actions">
        <Button onClick={() => navigate(-1)}>Exit</Button>
        <HintButton hint={currentSymbol.romanization} inputRef={inputRef} />
      </div>
    </div>
  );
};

export default KoreanGame;
