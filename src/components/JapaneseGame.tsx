import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { japaneseSymbols, type SymbolData } from "../data/japanese";
import HintButton from "./HintButton";
import Button from "./button";

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

  // Activar foco solo en móviles tras interacción del usuario
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
      <div style={{ textAlign: "center", padding: "1rem" }}>
        <h2>No symbols found for this group and script.</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  if (!currentSymbol) return <p>Loading...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "1rem" }}>
      <h2>
        Script: {script} | Group: {group}
      </h2>

      <div style={{ fontSize: "4rem", margin: "0.5rem 0" }}>
        {currentSymbol.symbol}
      </div>

      {/* Input oculto pero enfocable */}
      <input
        type="text"
        ref={inputRef}
        onKeyDown={handleKeyDown}
        style={{
          position: "absolute",
          top: "-9999px",
          opacity: 0,
        }}
      />

      {/* ✅ Botón visible SOLO en móviles */}
      {isMobile && !isFocused && (
        <button
          onClick={handleActivateKeyboard}
          style={{
            backgroundColor: "#007aff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "0.8rem 1.5rem",
            fontSize: "1rem",
            cursor: "pointer",
            marginBottom: "1rem",
          }}
        >
          📱 Activar teclado
        </button>
      )}

      <div style={{ fontSize: "2rem", marginTop: "1rem" }}>
        {currentSymbol.romaji.split("").map((letter, index) => {
          const userLetter = inputLetters[index];
          let color = "black";

          if (userLetter !== undefined) {
            color = userLetter === letter.toLowerCase() ? "green" : "red";
          }

          return (
            <span key={index} style={{ color, marginRight: "8px" }}>
              {userLetter ?? "_"}
            </span>
          );
        })}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <Button onClick={() => navigate(-1)}>Exit</Button>
        <HintButton hint={currentSymbol.romaji} inputRef={inputRef} />
      </div>
    </div>
  );
};

export default JapaneseGame;