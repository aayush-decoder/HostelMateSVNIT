import React from "react";
import { useState, useContext, useEffect } from "react";
import LoginContext from "../context/logincontext";
import LoadingSpinner from "./LoadingSpinner";
function Updatedetails() {
  const [isOpen ,setIsopen]=useState(false);
  const token=localStorage.token;
  const login_info = useContext(LoginContext);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    admissionNumber: "",
  });
  const [saved, setSaved] = useState(false);
  const [formdata, setFormData] = useState({
    roomId: "",
    hostel: "",
    phoneNumber:"",
    name: "",
    admissionNumber: "",
  });
  const fetch_data=()=>{
  fetch("http://localhost:8000/me", {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      },
      })
      .then((response) => response.json())
      .then((data) => {
      console.log(data);
      if (data.name) {
          setUserData(data);
          setFormData((prev)=>{
            prev.admissionNumber=userData.admissionNumber;
            prev.name=userData.name;
            return prev;
        })
      }
      })
      .catch((error) => console.error("Error", error));
    }

  if (!isOpen) return (<button onClick={()=>{if(login_info.login){setIsopen(true);fetch_data()}}} className="bg-green-400 p-3 text-white block m-auto">update details{(login_info.login)?<div></div>:<div>please login to</div>}</button>);
  
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  
  const onSubmit = () => {
    setLoading(true);
    fetch("http://localhost:8000/update_room_details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "success") {
          setSaved(true);
        }
      })
      .catch((error) => console.error("Error", error));
    setLoading(false);
  };

  const onClose=(e)=>{
    e.preventDefault();
    setIsopen(false);
  }

  if (loading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Update Details</h2>
        <form
            onSubmit={(e)=>{
                e.preventDefault();
                onSubmit();
            }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">name</label>
              <input
                type="text"
                name="name"
                value={formdata.name}
                readOnly
                className="w-full border px-3 py-2 rounded-md text-sm"
                placeholder="e.g. A101"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                admission number
              </label>
              <input
                type="text"
                name="admi_num"
                value={formdata.admissionNumber}
                readOnly
                className="w-full border px-3 py-2 rounded-md text-sm"
                placeholder="e.g. A101"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Room ID
              </label>
              <input
                type="text"
                name="roomId"
                required
                value={formdata.roomId}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md text-sm"
                placeholder="e.g. A101"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Requested Room
              </label>
              <input
                type="text"
                name="hostel"
                required
                value={formdata.hostel}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md text-sm"
                placeholder="e.g. B202"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formdata.phoneNumber}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md text-sm"
                placeholder="e.g. +91 99999 99999"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button type="submit"
              className="px-4 py-2 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
            {saved ? (
              <div className="text-green-400">saved !!</div>
            ) : (
              <div className="text-red-600">error in saving data</div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
export default Updatedetails;
