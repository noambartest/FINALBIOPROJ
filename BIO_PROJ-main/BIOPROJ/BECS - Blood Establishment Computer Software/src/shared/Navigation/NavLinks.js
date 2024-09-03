import React from "react";
import { NavLink } from "react-router-dom";

import "./NavLinks.css";

const NavLinks = (props) => {
  console.log("NAV LINKS");
  return (
    <ul className="nav-links">
      {!props.isAuthenticated ? (
        <>
          <li>
            <NavLink to="/login" exact>
              Login
            </NavLink>
          </li>
          <li>
            <NavLink to="/register" exact>
              Register
            </NavLink>
          </li>
        </>
      ) : (
        <>
          <li>
            <NavLink to="/" exact>
              Blood Types
            </NavLink>
          </li>
          <li>
            <NavLink to="/donates/newDelivery">Blood Delivry</NavLink>
          </li>
          <li>
            <NavLink to="/donates/newDonation">New Donation</NavLink>
          </li>
          <li>
            <NavLink to="/emgc">Emergency</NavLink>
          </li>
          <li>
            <NavLink to="/logout">Log-out</NavLink>
          </li>
          {props.role === "admin" && (
            <li>
              <NavLink to="/admin/pannel" exact>
                Admin Pannel
              </NavLink>
            </li>
          )}
        </>
      )}
    </ul>
  );
};

export default NavLinks;
