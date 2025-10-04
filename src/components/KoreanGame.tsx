import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { koreanSymbols, type HangulSymbol } from "../data/korean";
import HintButton from "./HintButton";
import Button from "./button";

const KoreanGame: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Recuperar el grupo enviado desde el menú
  const { group } =
    (location.state as { group: HangulSymbol["group"] }) || { group: "vowel" };

  // Crear el ref correctamente
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Filtrar los símbolos según el grupo
  const filteredData = koreanSymbols.filter((item) => item.group === group);

  const [currentSymbol, setCurrentSymbol] = useState<HangulSymbol | null>(null);
  const [inputLetters, setInputLetters] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setStatus] = useState<"idle" | "wrong" | "correct">("idle");

  // Inicializar el primer símbolo
  useEffect(() => {
    if (filteredData.length > 0) {
      const random = getRandomSymbol();
      setCurrentSymbol(random);
      setInputLetters([]);
      setCurrentIndex(0);
      setStatus("idle");
    }
  }, [group]);

  // Mantener el foco en el input
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
      <div style={{ textAlign: "center", padding: "0" }}>
        <h2>No symbols found for this group.</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  if (!currentSymbol) return <p>Loading...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "0" }}>
      <h2>Hangul | Group: {group}</h2>

      <div style={{ fontSize: "6rem" }}>{currentSymbol.symbol}</div>

      <input
        type="text"
        ref={inputRef}
        onKeyDown={handleKeyDown}
        style={{ opacity: 0, height: 0, width: 0 }}
        autoFocus
      />

      <div style={{ fontSize: "2rem", marginTop: "0" }}>
        {currentSymbol.romanization.split("").map((letter, index) => {
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

      

      <div style={{ marginTop: "2rem" }}>
        <HintButton hint={currentSymbol.romanization} inputRef={inputRef} />
        <Button onClick={() => navigate(-1)}>Exit</Button>
      </div>
    </div>
  );
};

export default KoreanGame;