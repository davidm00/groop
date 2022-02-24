import "../styles.css";

const Navbar = () => {
  return (
    <div>
      <ul className="navigation">
        <li>
          <a href="/">Groop</a>
        </li>
        <li className="navSpacer"></li>
        <li>
          <a href="/">Profile</a>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
