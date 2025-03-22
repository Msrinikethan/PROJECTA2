import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

function ViewUser() {
  const [allUsers, setAllUsers] = useState([]);
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);

  async function getAllUsers() {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/admin-api/get-all");
      console.log(res);
      if (res.data.message === "success") setAllUsers(res.data.payload);
    } catch (err) {
      console.log("err", err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getAllUsers();
  }, []);

  function toggleState(state, key) {
    const users = state.map((s) => {
      if (s.email === key) return { ...s, isActive: !s.isActive };
      return s;
    });
    console.log(users);
    return users;
  }

  async function handleBlockUnblock(obj) {
    // console.log("handle triggered", obj.email);
    let res = await axios.post(
      "http://localhost:3000/admin-api/block-unblock",
      {
        email: obj.email,
      }
    );
    if (res?.data.payload.modifiedCount == 1) {
      setAllUsers((users) => toggleState(users, obj.email));
      //   obj.isActive = !obj.isActive;
    }
    // console.log("res === ", res);
  }
  return (
    <div>
      <h1 className="text-center">Welcome Admin</h1>
      {loading ? (
        <div className="text-center">Loading Please Wait...</div>
      ) : (
        <></>
      )}
      <div className="w-full max-w-6xl p-5 mx-auto">
        {/* author */}
        <h1>Author</h1>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-gray-700 font-medium border">
                Name
              </th>
              <th className="px-4 py-2 text-left text-gray-700 font-medium border">
                Active/Blocked(tap to toggle)
              </th>
            </tr>
          </thead>
          <tbody>
            {allUsers
              .filter((obj) => obj.role === "author")
              .map((obj, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 border">{obj.firstName}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleBlockUnblock(obj)}
                      className={`px-3 py-1 rounded text-white font-medium
                      ${
                        obj.isActive
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {obj.isActive ? "Active" : "Blocked"}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {/* users */}
        <h1>Users</h1>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-gray-700 font-medium border">
                Name
              </th>
              <th className="px-4 py-2 text-left text-gray-700 font-medium border">
                Active/Blocked(tap to toggle)
              </th>
            </tr>
          </thead>
          <tbody>
            {allUsers
              .filter((obj) => obj.role === "user")
              .map((obj, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 border">{obj.firstName}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleBlockUnblock(obj)}
                      className={`px-3 py-1 rounded text-white font-medium
                      ${
                        obj.isActive
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {obj.isActive ? "Active" : "Blocked"}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewUser;
