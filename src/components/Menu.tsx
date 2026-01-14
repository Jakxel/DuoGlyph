import { useNavigate } from "react-router-dom";
import Button from "./button";

function Menu() {
    const navigate = useNavigate();

    return (
        <div>
            <div className="lenguaje">
                <Button
                    className="baseStyle" variant="primary" onClick={() => navigate("/JapaneseMenu")}>
                    Japanese
                </Button>
                <Button className="baseStyle" variant="primary" onClick={()=> navigate("/KoreanMenu")}>
                    Korean
                </Button>
            </div>
        </div>
    );
}
export default Menu;
