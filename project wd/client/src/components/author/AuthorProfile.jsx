import React, { useEffect } from "react";
import Articles from "../common/Articles";
import ArticleByID from "../common/ArticleByID";
import PostArticle from "./PostArticle";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

function AuthorProfile() {
  return (
    <div className="auth">
      <ul className="flex justify-around list-none font-light">
        <li className="nav-item bg-cyan-700 p-72">
          <NavLink to="articles" className="nav-link">
            Articles
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="postArticle" className="nav-link">
            Add new Articles
          </NavLink>
        </li>
      </ul>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthorProfile;
