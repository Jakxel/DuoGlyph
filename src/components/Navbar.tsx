import { Link } from 'react-router-dom';
import "../style/Navbar.css"

function Navbar () {
    return (
        <nav>
            <div className="home">
                <li>
                    <Link to="/">Duoglyph</Link>

                </li>
            </div>
            <div className="navbar-links">
                <li>
                    <a href="https://jakxel-blog.vercel.app/" target="_blank" rel="noopener noreferrer">Blog</a>
                </li>
                <li>
                    <a href="https://www.linkedin.com/in/victor-jakxel-islas-carreon-b6a156351/" target="_blank" rel="noopener noreferrer">Linkedin</a>
                </li>
                <li>
                    <a href="https://github.com/Jakxel" target="_blank" rel="noopener noreferrer">Github</a>
                </li>
            </div>
        </nav>
    );
};

export default Navbar;