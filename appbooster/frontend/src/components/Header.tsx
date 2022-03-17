import React from "react";
import { NavLink as Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="pt-3 pb-3">
      <nav className="nav nav-pills justify-content-center">
        <li className="nav-item">
          <Link
            to={"/"}
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            Конвертер
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={"/currencies"}
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            Курсы валют
          </Link>
        </li>
      </nav>
    </header>
  );
}
