import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          UberPhatLewtz
        </Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/category/rpg">RPG</Link></li>
          <li><Link to="/category/rts">RTS</Link></li>
          <li><Link to="/category/arcade">Arcade</Link></li>
          <li><Link to="/category/multiplayer">Multiplayer</Link></li>
          <li><Link to="/category/board">Board Games</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;