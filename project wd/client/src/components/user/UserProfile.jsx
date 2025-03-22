import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { userAuthorContextObj } from "../contexts/UserAuthorContext.jsx";

function UserProfile() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  console.log("current, userProfile " + currentUser);
  return (
    <div>
      {currentUser.isActive ? (
        <div className="auth">
          <ul className="flex justify-around list-none font-light">
            <li className="nav-item bg-cyan-700 p-72">
              <NavLink to="articles" className="nav-link">
                Articles
              </NavLink>
            </li>
          </ul>
          <div className="mt-5">
            <Outlet />
          </div>
        </div>
      ) : (
        <div>You are blocked,Please Contact Admin</div>
      )}
    </div>
  );
}

export default UserProfile;
