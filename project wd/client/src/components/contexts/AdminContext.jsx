import React, { useEffect, useState } from "react";
import { createContext } from "react";

export const adminContextObj = createContext();

function AdminContext({ children }) {
  useEffect(() => {
    const adminInStorage = localStorage.getItem("currentAdmin");
    if (adminInStorage) {
      setAdmin(JSON.parse(adminInStorage));
    }
  }, []);

  let [admin, setAdmin] = useState({
    nameOfAdmin: "",
    email: "",
  });

  return (
    <div>
      <adminContextObj.Provider value={{ admin, setAdmin }}>
        {children}
      </adminContextObj.Provider>
    </div>
  );
}

export default AdminContext;
