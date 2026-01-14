import React, { useState } from "react";
import Button from "./button";

type HintButtonProps = {
  hint: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

const HintButton: React.FC<HintButtonProps> = ({ hint, inputRef }) => {
  const [showHint, setShowHint] = useState(false);
  const [isSmall, setIsSmall] = useState(window.innerWidth < 600);

  React.useEffect(() => {
    const handleResize = () => setIsSmall(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = () => {
    setShowHint(true);
    inputRef.current?.focus();
  };

  const handleMouseUp = () => {
    setShowHint(false);
    inputRef.current?.focus();
  };

  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      <Button
        className="baseStyle"
        variant="primary"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        {isSmall ? "Keyboard" : showHint ? hint : "Hint"}
      </Button>
    </div>
  );
};

export default HintButton;
