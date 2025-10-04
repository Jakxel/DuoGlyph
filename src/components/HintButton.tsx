import React, { useState } from "react";
import Button from "./button";


type HintButtonProps = {
  hint: string;
  inputRef: React.RefObject<HTMLInputElement | null>; // Recibe la referencia del input del juego
};
const HintButton: React.FC<HintButtonProps> = ({ hint, inputRef }) => {
  const [showHint, setShowHint] = useState(false);

  const handleMouseDown = () => {
    setShowHint(true);
    inputRef.current?.focus(); // Vuelve a enfocar el input
  };

  const handleMouseUp = () => {
    setShowHint(false);
    inputRef.current?.focus(); // Mantener el focus
  };

  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      <Button className="baseStyle" variant="primary"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        {showHint ? hint : "Hint"}
      </Button>
    </div>
  );
};
export default HintButton;
