import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import.meta.env;
import { useClerk, useUser } from "@clerk/clerk-react";
import { userAuthorContextObj } from "../contexts/UserAuthorContext.jsx";
import { adminContextObj } from "../contexts/AdminContext.jsx";

function Header() {
  const { signOut } = useClerk();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { admin, setAdmin } = useContext(adminContextObj);
  const navigate = useNavigate();
  async function handleSignout() {
    await signOut();
    setCurrentUser(null);
    localStorage.removeItem('currentUser')
    localStorage.removeItem('admin')
    setAdmin(null);
    navigate("/");
  }
  const { isSignedIn, isLoaded, user } = useUser();
  return (
    <div className=" d-flex align-items-center ">
      <nav className="header d-flex justify-content-between align-items-center w-100">
        <div className="d-flex mx-4">
          <Link to="/">LOGO</Link>
        </div>
        <div className="d-flex  rounded flex-row">
          <ul className="d-flexlist-unstyled header-links justify-content-around align-items-center h-100 m-0">
            {!isSignedIn ? (
              <>
                <li>
                  <Link to="">Home</Link>
                </li>
                <li>
                  <Link to="signin">Signin</Link>
                </li>
                <li>
                  <Link to="signup">signup</Link>
                </li>
              </>
            ) : (
              <div className="user-button ">
                <div style={{ position: "relative" }}>
                  <img
                    src={user.imageUrl}
                    width="40px"
                    className="rounded-circle"
                  ></img>
                  <p style={{ position: "absolute", top: "0px" }}>
                    {user.firstName}
                  </p>
                </div>
                <button
                  className="btn btn-danger "
                  id="sign-out"
                  onClick={handleSignout}
                >
                  Signout
                </button>
              </div>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Header;
