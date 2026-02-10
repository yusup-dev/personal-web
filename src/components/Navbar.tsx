import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul
        style={{
          display: "flex",
          gap: "32px",
          listStyle: "none",
          fontSize: "15px",
        }}
      >
        <li>
          <NavLink to="/" end>
            home
          </NavLink>
        </li>
        <li>
          <NavLink to="/blogs">blogs</NavLink>
        </li>
        <li>
          <NavLink to="/portfolios">portfolios</NavLink>
        </li>
        <li>
          <NavLink to="/about">about</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
