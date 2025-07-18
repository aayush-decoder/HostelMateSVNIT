// Same imports...
import React, { useContext, useEffect, useState, useRef } from "react";
import LoginContext from "../context/logincontext";
import LoadingSpinner from "./LoadingSpinner";
import { gsap } from "gsap";
import RoomChip from "./ui/RoomChip";
import RoomSetupModal from "../featurePopups/UpdateDetailsPopup";
import { ArrowDown } from "lucide-react";


export default function Myroom() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const login_info = useContext(LoginContext);
  const token = localStorage.getItem("token");
  const boxRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (login_info.login === true && token) {
      fetch("https://hostelmate-nqe3.onrender.com/me", {
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

  if (!login_info.login || !userData) {
    return (
      <div className="text-white py-2 my-4 bg-red-600 rounded-2xl text-xl text-center">
        🚫 Please login to view your room info!
      </div>
    );
  }

  return (

    <>

    <RoomSetupModal isOpen={showModal} onClose={() => setShowModal(false)} />

    <div
      ref={boxRef}
      className="max-w-3xl mx-auto mt-6 bg-gray-900 text-white shadow-2xl rounded-2xl p-6 border border-gray-800"
    >
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
          {userData.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-xl font-semibold">{userData.name}</h2>
          <p className="text-sm text-gray-400">
            🎓 Admission No: <span className="text-white">{userData.admissionNumber}</span>
          </p>
          <p className="text-sm text-gray-400">
            📞 Contact:{" "}
            {userData.contactNumber ? (
              <span className="text-white">{userData.contactNumber}</span>
            ) : (
              <span className="text-yellow-400 underline cursor-pointer" onClick={() => setShowModal(true)}>
                Add contact so people can reach out
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Room Info */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-xl">
          <h4 className="font-semibold text-sm text-gray-400 mb-1">🏠 Current Room</h4>
          <p className="text-lg capitalize">{userData.hostel} {userData.roomId}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl">
          <h4 className="font-semibold text-sm text-gray-400 mb-2">✉️ Requested Rooms</h4>
          <div className="flex flex-wrap gap-2">
            {userData.requestedRooms.length > 0 ? (
              userData.requestedRooms.map((e, idx) => (
                <RoomChip key={idx} roomId={e.roomId} hostel={userData.hostel} />
              ))
            ) : (
              <p className="text-sm text-gray-300">None</p>
            )}
          </div>
        </div>
      </div>

      {/* Requests and Roommate */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-xl">
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
                      className="px-2 py-1 text-sm bg-gray-700 text-white rounded-full border border-blue-500"
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
                } else return null;
              })}
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded-xl">
          <h4 className="font-semibold text-sm text-gray-400 mb-2">🧑‍🤝‍🧑 Roommate</h4>
          <p className="text-base text-white">
            {userData.room_mate || "Living solo for now 🧘‍♂️"}
          </p>
        </div>
      </div>

      <div className="flex lg:flex-row md:flex-row flex-col justify-center mt-4 gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-xl shadow-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          >
            🚀 Setup Your Data
          </button>

          <button
            className="relative inline-block px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl border border-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text hover:text-white hover:bg-clip-border hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600"
          >
            <a href="#instructions">See all features of HostelMate ⬇️</a>
          </button>
        </div>
    </div>

    </>
  );
}
