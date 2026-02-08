import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { japaneseSymbols, type SymbolData } from "../data/japanese";
import HintButton from "./HintButton";
import Button from "./button";
import "../style/JapaneseGame.css"

const JapaneseGame: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  const { group = "", script = "hiragana" } =
    (location.state as Partial<Pick<SymbolData, "group" | "script">>) ?? {};

  /* ---------------- Keyboard visibility ---------------- */
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const initialHeight = window.innerHeight;
    const onResize = () => {
      setKeyboardVisible(window.innerHeight < initialHeight * 0.75);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ---------------- Data ---------------- */
  const filteredData = useMemo(
    () =>
      japaneseSymbols.filter(
        (item) => item.group === group && item.script === script
      ),
    [group, script]
  );

  const getRandomSymbol = useCallback(() => {
    if (!filteredData.length) return null;
    return filteredData[Math.floor(Math.random() * filteredData.length)];
  }, [filteredData]);

  /* ---------------- Game state ---------------- */
  const [currentSymbol, setCurrentSymbol] = useState<SymbolData | null>(null);
  const [inputLetters, setInputLetters] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const resetGame = useCallback(() => {
    setCurrentSymbol(getRandomSymbol());
    setInputLetters([]);
    setCurrentIndex(0);
  }, [getRandomSymbol]);

  useEffect(() => {
    if (filteredData.length) resetGame();
    else setCurrentSymbol(null);
  }, [filteredData, resetGame]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentSymbol]);

  /* ---------------- Input handling ---------------- */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!currentSymbol) return;

    const key = e.key.toLowerCase();
    if (!/^[a-z]$/.test(key)) return;

    const expected = currentSymbol.romaji.toLowerCase();

    setInputLetters((prev) => {
      const updated = [...prev];
      updated[currentIndex] = key;
      return updated;
    });

    if (key === expected[currentIndex]) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      if (nextIndex === expected.length) {
        setTimeout(resetGame, 800);
      }
    }

    e.preventDefault();
  };

  /* ---------------- Render ---------------- */
  if (!filteredData.length) {
    return (
      <div className="japanese-game__empty">
        <h2>No symbols found for this group and script.</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  if (!currentSymbol) {
    return <p style={{ color: "#fff", textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div className="japanese-game">
      <h2
        className="japanese-game__title"
        style={{ display: keyboardVisible ? "none" : "block" }}
      >
        Script: {script} | Group: {group}
      </h2>

      <div className="japanese-game__symbol">{currentSymbol.symbol}</div>

      <input
        ref={inputRef}
        type="text"
        onKeyDown={handleKeyDown}
        className="japanese-game__input"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
      />

      <div className="japanese-game__romanization">
        {currentSymbol.romaji.split("").map((letter, index) => {
          const userLetter = inputLetters[index];
          let letterClass = "japanese-game__letter";
          if (userLetter !== undefined) {
            letterClass += userLetter === letter
              ? " japanese-game__letter--correct"
              : " japanese-game__letter--wrong";
          }
          return (
            <span key={index} className={letterClass}>
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