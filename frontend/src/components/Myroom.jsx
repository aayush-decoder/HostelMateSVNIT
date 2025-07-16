import React, { useContext, useEffect, useState } from "react";
import LoginContext from "../context/logincontext";
import LoadingSpinner from "./LoadingSpinner";
export default function Myroom() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const login_info=useContext(LoginContext);
  const token = localStorage.getItem("token");
  useEffect(() => {
    console.log(login_info.login)
    if (login_info.login==true && token){
      // fetch the data
      fetch("http://localhost:8000/me",{
          method: "GET",
          headers: { 
            "Content-Type": "application/json" ,
            'Authorization': `Bearer ${token}`
          },
        })
        .then(response=>response.json())
        .then(data=>{console.log(data);if(data.name){setUserData(data)}})
        .catch(error=>console.error("Error",error));
      }
      setLoading(false);
  }, [login_info]);

  if (loading) {
      return (
       <LoadingSpinner/>
      );
    }

  if (login_info.login==false || userData === null){
      return(
        <div className="text-white  py-2 my-2 bg-red-600 rounded-2xl text-2xl text-center">please login to view info</div>
      )
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
          <p className="text-lg">{userData.hostel} {userData.roomId}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Requested Room</h4>
            {userData.requestedRooms.length > 0 ? (
              userData.requestedRooms.map((e, idx) => (
                <p key={idx} className="text-lg text-black">
                  {e.roomId}
                </p>
              ))
            ) : (
              <p>None</p>
            )}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
            <h4 className="font-semibold text-sm text-gray-500 mb-2">Incoming Requests</h4>
            {userData.incommingRequests.length === 0 ? (
              <p className="text-sm">No requests yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {userData.incommingRequests.map((id, idx) => (
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
        <div>
          <h1 className="font-semibold text-sm text-gray-500">
            room mate
          </h1>
          <p>
            {userData.room_mate}
          </p>
        </div>
      </div>
      
    </div>
  );
}