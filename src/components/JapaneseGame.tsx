import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { japaneseSymbols, type SymbolData } from "../data/japanese";
import HintButton from "./HintButton";
import Button from "./button";

const JapaneseGame: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { group, script } =
    (location.state as { group: SymbolData["group"]; script: SymbolData["script"] }) || {
      group: "",
      script: "hiragana",
    };

    // Crear el ref correctamente
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Filtramos los símbolos según el grupo y el script
  const filteredData = japaneseSymbols.filter(
    (item) => item.group === group && item.script === script
  );

  const [currentSymbol, setCurrentSymbol] = useState<SymbolData | null>(null);
  const [inputLetters, setInputLetters] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [,setStatus] = useState<"idle" | "wrong" | "correct">("idle");

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

  // Función para obtener símbolo aleatorio
  const getRandomSymbol = () => {
    return filteredData[Math.floor(Math.random() * filteredData.length)];
  };

  // Detectar teclas presionadas
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!currentSymbol) return;

    const expected = currentSymbol.romaji.toLowerCase();
    const letter = e.key.toLowerCase();

    // Ignorar teclas que no sean letras
    if (letter.length !== 1 || !letter.match(/^[a-z]$/)) return;

    if (letter === expected[currentIndex]) {
      const updated = [...inputLetters];
      updated[currentIndex] = letter;
      setInputLetters(updated);
      setCurrentIndex(currentIndex + 1);
      setStatus("idle");

      // Si completó la palabra correctamente
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
      <div style={{ textAlign: "center", padding:"10px" }}>
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

      <div style={{ fontSize: "4rem", margin: "0" }}>{currentSymbol.symbol}</div>

      <input
        type="text"
        onKeyDown={handleKeyDown}
        style={{ opacity: 0, height: 0, width: 0 }}
        autoFocus
      />

      <div style={{ fontSize: "2rem", marginTop: "1rem" }}>
        {currentSymbol.romaji.split("").map((letter, index) => {
          const userLetter = inputLetters[index];
          let color = "black";

          if (userLetter !== undefined) {
            color = userLetter === letter.toLowerCase() ? "green" : "red";
          }

          return (
            <span key={index} style={{ color, marginRight: "10px" }}>
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