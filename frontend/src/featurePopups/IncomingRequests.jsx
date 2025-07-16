import React, {useContext, useEffect, useState } from 'react';
import LoginContext from "../context/logincontext";
export default function IncomingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const login_info=useContext(LoginContext);
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('http://localhost:8000/incoming-requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch incoming requests');
        }
        const data = await res.json();
        console.log(data)
        setRequests(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if(login_info.login){
      fetchRequests();
    }
  }, [token,login_info]);
  if (login_info.login==false){
    return(
      <div className="p-4 bg-theme text-theme-ink rounded-md shadow-md">
          please login to fetch incoming requests
        </div>
      )
  }
  if (loading) {
    return (
      <div className="p-4 bg-theme text-theme-ink rounded-md shadow-md">
        Loading incoming requests...
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="p-4 bg-theme text-theme-ink rounded-md shadow-md">
        No incoming room exchange requests.
      </div>
    );
  }

  return (
    <div className="p-4 bg-theme h-full text-theme-ink rounded-lg shadow-md space-y-3">
      <h2 className="text-xl font-semibold mb-2 border-b border-theme-tertiary pb-1">Incoming Requests</h2>
      {requests.map((req) => (
        <div
          key={req.uid}
          className="border border-theme-tertiary p-3 rounded-md bg-theme-secondary hover:bg-theme-tertiary transition"
        >
          <p className="text-lg font-medium">{req.name}</p>
          <p className="text-sm text-theme-ink-secondary">Admission No: {req.admission_number.toUpperCase()}</p>
          <p className="text-sm text-theme-ink-tertiary">Room: {req.room_id}</p>
        </div>
      ))}
    </div>
  );
}
