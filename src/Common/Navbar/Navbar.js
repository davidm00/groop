import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div>
      <ul className="navigation">
        <li>
          <Link to="/">Groop</Link> 
        </li>
        <li className="navSpacer"></li>
        <li>
          <Link to="/group">Groups</Link>
        </li>
      </ul>
      <button onClick={() => navigate(-1)} style={{margin: "2.5px 10px"}}>Back</button>
    </div>
  );
};

export default Navbar;
