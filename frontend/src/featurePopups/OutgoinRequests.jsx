import React from "react";
import { useState, useContext, useEffect } from "react";
import LoginContext from "../context/logincontext";
import LoadingSpinner from "../components/LoadingSpinner";
function OutgoinRequests() {
  const login_info = useContext(LoginContext);
  const [loading, setLoading] = useState(true);
  const token = localStorage.token;
  const [userdata, setUserdata] = useState({});
  const [requestedUser, setRequestedUser] = useState([]);
  useEffect(() => {
    if (!login_info.login) return;
    if(requestedUser.length>0) return ;
    const fetchRequests = async () => {
      try {
        const res = await fetch("http://hostelmate-nqe3.onrender.com/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await res.json();
        console.log(data);
        setUserdata(data);
        fetchusers(data.requestedRooms);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchusers = async (rooms) => {
       rooms.forEach(async (e) => {
        try {
          const res =await fetch(`http://hostelmate-nqe3.onrender.com/users/${e.uid}`,
          { method:"GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) {
            throw new Error("Failed to fetch requested room owner info");
            
          }
          const data = await res.json();
          console.log(data);
          setRequestedUser(prev => [...prev, data]);
        } catch (error) {
          console.error(error);
        }
      });
    };

    fetchRequests();
  }, [login_info, token]);

  if (!login_info.login) return;
  if (loading) return <LoadingSpinner />;

  return (
  <div className="mt-2 text-center">
    <h1 className="text-2xl font-bold mb-4 text-white">Outgoing Requests</h1>
    <div className="flex flex-row flex-wrap justify-center w-full items-center gap-4">

        {requestedUser.map((e, idx) => (
        <div
            key={idx}
            className="p-4 border-2 grow border-gray-700 rounded-xl shadow-md bg-theme-secondary"
        >
            <h3 className="text-lg font-semibold bg-cyan-800 text-theme-ink px-3 py-1 rounded">
            Room ID: {e.roomId}
            </h3>
            <p className="mt-2 text-theme-ink-secondary">
            <span className="font-semibold">Name:</span> {e.name}
            </p>
            <p className="text-theme-ink-secondary">
            <span className="font-semibold">Roll No:</span> {e.admissionNumber}
            </p>
            <p className="text-theme-ink-secondary">
            <span className="font-semibold">Contact Number:</span>{" "}
            {e.contactNumber ? e.contactNumber : "Not updated"}
            </p>
        </div>
        ))}
    </div>
  </div>
  )
 
}

export default OutgoinRequests;
