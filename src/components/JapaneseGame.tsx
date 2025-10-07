import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { japaneseSymbols, type SymbolData } from "../data/japanese";
import HintButton from "./HintButton";
import Button from "./button";
import "../style/JapaneseGame.css";

const JapaneseGame: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { group, script } =
    (location.state as { group: SymbolData["group"]; script: SymbolData["script"] }) || {
      group: "basic",
      script: "hiragana",
    };

  const filteredData = japaneseSymbols.filter(
    (item) => item.group === group && item.script === script
  );

  const [currentSymbol, setCurrentSymbol] = useState<SymbolData | null>(null);
  const [inputLetters, setInputLetters] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setStatus] = useState<"idle" | "wrong" | "correct">("idle");
  const [isMobile, setIsMobile] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Detectar si la pantalla es móvil
  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth <= 600);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // Inicializa el primer símbolo
  useEffect(() => {
    if (filteredData.length > 0) {
      const random = getRandomSymbol();
      setCurrentSymbol(random);
      setInputLetters([]);
      setCurrentIndex(0);
      setStatus("idle");
    }
  }, [group, script]);

  const getRandomSymbol = () => {
    return filteredData[Math.floor(Math.random() * filteredData.length)];
  };

  const handleActivateKeyboard = () => {
    inputRef.current?.focus();
    setIsFocused(true);
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
        }, 800);
      }
    } else {
      setStatus("wrong");
    }
  };

  if (filteredData.length === 0) {
    return (
      <div className="game-container">
        <h2>No symbols found for this group and script.</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  if (!currentSymbol) return <p>Loading...</p>;

  return (
    <div className="game-container">
      <h2>
        Script: {script} | Group: {group}
      </h2>

      <div className="symbol-display">{currentSymbol.symbol}</div>

      <input
        type="text"
        ref={inputRef}
        onKeyDown={handleKeyDown}
        className="hidden-input"
      />

      {/* Botón visible solo en móviles */}
      {isMobile && !isFocused && (
        <button onClick={handleActivateKeyboard} className="mobile-keyboard-btn">
          📱 Activar teclado
        </button>
      )}

      <div className="romaji-display">
        {currentSymbol.romaji.split("").map((letter, index) => {
          const userLetter = inputLetters[index];
          let colorClass = "";
          if (userLetter !== undefined) {
            colorClass = userLetter === letter.toLowerCase() ? "correct" : "wrong";
          }
          return (
            <span key={index} className={`romaji-letter ${colorClass}`}>
              {userLetter ?? "_"}
            </span>
          );
        })}
      </div>

      <div className="game-buttons">
        <Button onClick={() => navigate(-1)}>Exit</Button>
        <HintButton hint={currentSymbol.romaji} inputRef={inputRef} />
      </div>
    </div>
  );
};

export default JapaneseGame;