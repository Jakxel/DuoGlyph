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

  // ref del input (se pasa al HintButton)
  const inputRef = useRef<HTMLInputElement | null>(null);

  // detectar teclado en móvil (cuando la altura del viewport baja)
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const initialHeight = window.innerHeight;
    const onResize = () => {
      // si la altura cae a < 75% asumimos teclado visible
      setKeyboardVisible(window.innerHeight < initialHeight * 0.75);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Filtrar símbolos por grupo y script
  const filteredData = japaneseSymbols.filter(
    (item) => item.group === group && item.script === script
  );

  // Helper para elegir símbolo aleatorio (debe estar definido antes del useEffect que lo usa)
  const getRandomSymbol = () => {
    if (filteredData.length === 0) return null;
    return filteredData[Math.floor(Math.random() * filteredData.length)];
  };

  const [currentSymbol, setCurrentSymbol] = useState<SymbolData | null>(null);
  const [inputLetters, setInputLetters] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setStatus] = useState<"idle" | "wrong" | "correct">("idle");

  // Inicializar primer símbolo cuando cambian grupo/script
  useEffect(() => {
    if (filteredData.length > 0) {
      const random = getRandomSymbol();
      setCurrentSymbol(random);
      setInputLetters([]);
      setCurrentIndex(0);
      setStatus("idle");
    } else {
      setCurrentSymbol(null);
    }
  }, [group, script]); // eslint-disable-line

  // Mantener el foco en el input cuando cambia el símbolo
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentSymbol]);

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
      const updated = [...inputLetters];
      updated[currentIndex] = letter;
      setInputLetters(updated);
      setStatus("wrong");
    }

    e.preventDefault();
  };

  // ===== Inline styles =====
  const styles = {
    container: {
      textAlign: "center" as const,
      marginTop: "1rem",
      padding: "1rem",
      color: "#fff",
      fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    },
    noSymbols: {
      textAlign: "center" as const,
      padding: "10px",
      color: "#fff",
    },
    header: {
      fontSize: "1.25rem",
      margin: "0 0 0.75rem 0",
      color: "#eaeaea",
      display: keyboardVisible ? "none" : "block",
      transition: "opacity 0.2s ease, transform 0.2s ease",
    },
    symbol: {
      fontSize: "5.5rem",
      lineHeight: 1,
      margin: "0.25rem 0 1rem 0",
      color: "#fff",
      textShadow: "0 6px 18px rgba(0,0,0,0.6)",
    },
    input: {
      // lo hacemos pequeño/invisible pero enfocable
      opacity: 0,
      height: 0,
      width: 0,
      position: "absolute" as const,
      left: "-9999px",
    },
    romaji: {
      fontSize: "1.6rem",
      marginTop: "0.75rem",
      display: "flex",
      justifyContent: "center",
      gap: "0.6rem",
      flexWrap: "wrap" as const,
      color: "#fff",
    },
    letter: {
      minWidth: "1.2rem",
      fontSize: "1.6rem",
      padding: "2px 6px",
      borderRadius: "6px",
      background: "rgba(255,255,255,0.03)",
      display: "inline-block",
    },
    letterCorrect: {
      color: "#0f0",
      background: "rgba(0,255,0,0.06)",
      border: "1px solid rgba(0,255,0,0.12)",
    },
    letterWrong: {
      color: "#ff6b6b",
      background: "rgba(255,0,0,0.04)",
      border: "1px solid rgba(255,0,0,0.08)",
    },
    actions: {
      marginTop: "1.25rem",
      display: "flex",
      gap: "0.6rem",
      justifyContent: "center",
      alignItems: "center",
    },
  };

  // ===== Render =====
  if (filteredData.length === 0) {
    return (
      <div style={styles.noSymbols}>
        <h2>No symbols found for this group and script.</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  if (!currentSymbol) return <p style={{ color: "#fff", textAlign: "center" }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>
        Script: {script} | Group: {group}
      </h2>

      <div style={styles.symbol}>{currentSymbol.symbol}</div>

      <input
        ref={inputRef}
        type="text"
        onKeyDown={handleKeyDown}
        style={styles.input}
        autoFocus
        autoComplete="off"
        inputMode="text"
      />

      <div style={styles.romaji}>
        {currentSymbol.romaji.split("").map((letter, index) => {
          const userLetter = inputLetters[index];
          const base = { ...styles.letter };
          const finalStyle =
            userLetter === undefined
              ? base
              : userLetter === letter.toLowerCase()
              ? { ...base, ...styles.letterCorrect }
              : { ...base, ...styles.letterWrong };

          return (
            <span key={index} style={finalStyle}>
              {userLetter ?? "_"}
            </span>
          );
        })}
      </div>

      <div style={styles.actions}>
        <Button onClick={() => navigate(-1)}>Exit</Button>
        <HintButton hint={currentSymbol.romaji} inputRef={inputRef} />
      </div>
    </div>
  );
};

export default JapaneseGame;