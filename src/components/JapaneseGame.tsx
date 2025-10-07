import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { japaneseSymbols, type SymbolData } from "../data/japanese";
import "../style/JapaneseGames.css"
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
    <div
      style={{
      maxWidth: "400px",
      borderRadius: "18px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Segoe UI', 'Noto Sans JP', Arial, sans-serif",
      padding: "32px 24px",
      }}
    >
      <h2
      style={{
        fontSize: "1.5rem",
        marginBottom: "24px",
        color: "#fffdfd",
        textAlign: "center",
        fontWeight: 600,
      }}
      >
      Script: {script} | Group: {group}
      </h2>

      <div
      style={{
        fontSize: "4rem",
        marginBottom: "24px",
        color: "#ffffff",
        fontWeight: "bold",
        letterSpacing: "2px",
        userSelect: "none",
      }}
      >
      {currentSymbol.symbol}
      </div>

      <input
      ref={inputRef}
      type="text"
      style={{
        opacity: 0,
        position: "absolute",
        pointerEvents: "none",
        height: 0,
        width: 0,
      }}
        onKeyDown={handleKeyDown}
        className="korean-game__input"
        autoFocus
      />

      <div
      style={{
        display: "flex",
        gap: "10px",
        margin: "24px 0",
        fontSize: "2rem",
        letterSpacing: "2px",
        justifyContent: "center",
      }}
      >
      {currentSymbol.romaji.split("").map((letter, index) => {
        const userLetter = inputLetters[index];
        let colorStyle = {};

        if (userLetter !== undefined) {
        colorStyle =
          userLetter === letter.toLowerCase()
          ? {
            color: "#219150",
            borderBottom: "5px solid #274734",
            }
          : {
            color: "#d90429",
            borderBottom: "5px solid #d90429",
            };
        } else {
        colorStyle = {
          color: "#22223b",
          borderBottom: "5px solid #000000",
        };
        }

        return (
        <span
          key={index}
          style={{
          display: "inline-block",
          width: "32px",
          height: "48px",
          lineHeight: "48px",
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: 500,
          borderRadius: "6px 6px 0 0",
          transition: "background 0.2s, color 0.2s",
          ...colorStyle,
          }}
        >
          {userLetter ?? "_"}
        </span>
        );
      })}
      </div>
      <div
      style={{
        display: "flex",
        gap: "16px",
        marginTop: "24px",
        justifyContent: "center",
      }}
      >
      <Button onClick={() => navigate(-1)}>Exit</Button>
      <HintButton hint={currentSymbol.romaji} inputRef={inputRef} />
      </div>
    </div>
  );
};
export default JapaneseGame;