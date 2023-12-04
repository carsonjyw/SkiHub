import { NavLink } from "react-router-dom";
import React from "react";

/*
ITP 404, Final
Author: Carson Wang
Email: carsonw@usc.edu
Navigation Bar to display on top of every page
*/

export default function Navigation() {
  return (
    <div className="navmain">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <span className="navbar-brand">SkiHub</span>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink exact to="/" activeClassName="active" className="nav-link">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/my-trips" activeClassName="active" className="nav-link">
                My Trips
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/savedResorts" activeClassName="active" className="nav-link">
                Saved Resorts
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin" activeClassName="active" className="nav-link">
                Admin
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}