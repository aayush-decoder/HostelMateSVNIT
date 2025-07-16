import React, { useContext, useEffect, useState, useRef } from "react";
import LoginContext from "../context/logincontext";
import LoadingSpinner from "./LoadingSpinner";
import { gsap } from "gsap";

export default function Myroom() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const login_info = useContext(LoginContext);
  const token = localStorage.getItem("token");
  const boxRef = useRef(null);

  useEffect(() => {
    if (login_info.login === true && token) {
      fetch("http://localhost:8000/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.name) {
            setUserData(data);
            setTimeout(() => {
              gsap.fromTo(
                boxRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
              );
            }, 100);
          }
        })
        .catch((error) => console.error("Error", error));
    }
    setLoading(false);
  }, [login_info]);

  if (loading) return <LoadingSpinner />;

  if (login_info.login === false || userData === null) {
    return (
      <div className="text-white py-2 my-4 bg-red-600 rounded-2xl text-2xl text-center">
        🚫 Please login to view your room info!
      </div>
    );
  }

  return (
    <div
      ref={boxRef}
      className="max-w-3xl mx-auto mt-8 bg-gray-900 text-white shadow-2xl rounded-2xl p-6 border border-gray-800"
    >
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
          {userData.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{userData.name}</h2>
          <p className="text-sm text-gray-400">
            🎓 Admission No: <span className="text-white">{userData.admissionNumber}</span>
          </p>
          <p className="text-sm text-gray-400">
            📞 Contact:{" "}
            {userData.phoneNumber ? (
              <span className="text-white">{userData.phoneNumber}</span>
            ) : (
              <a className="text-yellow-400 underline cursor-pointer">
                Add contact so people can reach out
              </a>
            )}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-xl shadow-inner">
          <h4 className="font-semibold text-sm text-gray-400 mb-1">🏠 Current Room</h4>
          <p className="text-xl">{userData.hostel} {userData.roomId}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow-inner">
          <h4 className="font-semibold text-sm text-gray-400 mb-1">💭 Requested Room</h4>
          <p className="text-xl">{userData.requestedRoom || "None yet"}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-xl shadow-inner">
          <h4 className="font-semibold text-sm text-gray-400 mb-2">📥 Incoming Requests</h4>
          {userData.incommingRequests.length === 0 ? (
            <p className="text-sm text-gray-300">No one knocking yet 🚪</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {userData.incommingRequests.map((id, idx) => {
                if (idx < 3) {
                  return (
                    <span
                      key={idx}
                      className="px-3 py-1 text-sm bg-gray-700 text-white rounded-full border border-blue-500"
                    >
                      {id.toUpperCase()}
                    </span>
                  );
                } else if (idx === 3) {
                  return (
                    <span
                      key="more"
                      className="px-3 py-1 text-sm bg-gray-700 text-white rounded-full border border-blue-500"
                    >
                      ...
                    </span>
                  );
                } else {
                  return null; 
                }
              })}
            </div>

          )}
        </div>

        <div className="bg-gray-800 p-4 rounded-xl shadow-inner">
          <h4 className="font-semibold text-sm text-gray-400 mb-2">🧑‍🤝‍🧑 Roommate</h4>
          <p className="text-base text-white">
            {userData.room_mate || "Living solo for now 🧘‍♂️"}
          </p>
        </div>
      </div>
    </div>
  );
}
