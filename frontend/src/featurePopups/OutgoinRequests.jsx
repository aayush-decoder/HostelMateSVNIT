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
        const res = await fetch("http://localhost:8000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await res.json();
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
          const res =await fetch(`http://localhost:8000/users/${e.uid}`,
          { method:"GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) {
            throw new Error("Failed to fetch requested room owner info");
            
          }
          const data = await res.json();
          setRequestedUser(prev => [...prev, data]);
        } catch (error) {
          console.error(error);
        }
      });
    };

    fetchRequests();
  }, [login_info, token]);

  const delete_request=(uid)=>{
    try {
        fetch(`http://localhost:8000/delete_outgoing_requests/${uid}`,{
        method:"delete",
        headers: {
                Authorization: `Bearer ${token}`,
              },
      }).then(data=>(data.json()))
      .then(data=>{if(data.success)window.alert("deletion sucessfull please reload");login_info.setRefresh((prev)=>(!prev))})

    } catch (error) {
      console.log(error);
    }
    
  }

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
            <button className="bg-red-500 text-white p-2 rounded-lg" onClick={()=>{delete_request(e.admissionNumber)}}>
                delete 
            </button>
        </div>
        ))}
    </div>
  </div>
  )
 
}

export default OutgoinRequests;
