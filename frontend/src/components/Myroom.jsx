import React, { useContext, useEffect, useState } from "react";
import LoginContext from "../context/logincontext";
export default function Myroom() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const login_info=useContext(LoginContext);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (login_info && token){
      // fetch the data
      fetch("http://localhost:8000/me",{
          method: "GET",
          headers: { 
            "Content-Type": "application/json" ,
            'Authorization': `Bearer ${token}`
          },
        })
        .then(response=>response.json())
        .then(data=>{console.log(data);setUserData(data)})
        .catch(error=>console.error("Error",error));
      }
      setLoading(false);
  }, []);
  if (login_info.login==false){
      return(
        <div className="text-white px-4 py-2 my-2 bg-red-600 rounded-2xl text-2xl">please login to view info</div>
      )
    }
if (loading || userData===null ) {
    return (
      <div className="w-full h-48 bg-gray-200 animate-pulse rounded-2xl"></div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-2xl rounded-2xl p-6">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
          {userData.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{userData.name}</h2>
          <p className="text-gray-600 text-sm">
            Admission No: {userData.admissionNumber}
          </p>
          <p className="text-gray-600 text-sm">
            Phone: {userData.phoneNumber}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Current Room</h4>
          <p className="text-lg">{userData.roomId}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Requested Room</h4>
          <p className="text-lg">{userData.requestedRoom || "None"}</p>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold text-sm text-gray-500 mb-2">Incoming Requests</h4>
        {userData.incomingRequests.length === 0 ? (
          <p className="text-sm">No requests yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {userData.incomingRequests.map((id, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-sm border border-gray-300 rounded-full"
              >
                {id}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}