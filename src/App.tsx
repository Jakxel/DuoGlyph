import { Routes, Route, useLocation } from "react-router-dom";
import Menu from "./components/Menu";
import "./style/App.css";
import JapaneseMenu from "./components/JapaneseMenu";
import KoreanGame from "./components/KoreanGame";
import KoreanMenu from "./components/KoreanMenu";
import JapaneseGame from "./components/JapaneseGame";
import { useState, useEffect } from "react";


function App() {
  const [language, setLanguage] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/JapaneseMenu") {
      setLanguage("Japanese");
    } else if (location.pathname === "/KoreanMenu") {
      setLanguage("Korean");
    } else {
      setLanguage("");
    }
  }, [location.pathname]);

  return (
    <div className="display">
      <h1>DuoGlyph {language}</h1>
      <Routes>
        <Route path="/Menu" element={<Menu />} />
        <Route path="/JapaneseMenu" element={<JapaneseMenu />} />
        <Route path="/JapaneseGame" element={<JapaneseGame />} />
        <Route path="/KoreanGame" element={<KoreanGame />} />
        <Route path="/KoreanMenu" element={<KoreanMenu />} />
      </Routes>
    </div>
  );
}
export default App;
