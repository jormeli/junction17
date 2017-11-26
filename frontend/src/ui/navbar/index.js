import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => (
    <div className="nav">
        <NavLink
            to="/leaderboard"
            className="nav-link nav-link--light"
            activeClassName="disable"
        >
            <img className="nav-link-icon" src={require('../../resources/images/icons/arrow_left.png')} />
            Leaderboard
        </NavLink>
        <NavLink
            exact
            to="/"
            className="nav-link nav-link--dark"
            activeClassName="disable"
        >
            <img className="nav-link-icon" src={require('../../resources/images/icons/arrow_left_white.png')} />
            Map view
        </NavLink>
    </div>
);

export default Navbar;
