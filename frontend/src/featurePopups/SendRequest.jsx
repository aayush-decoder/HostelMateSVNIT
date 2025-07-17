import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function RequestExchange() {
  const [roomId, setRoomId] = useState('');
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [warning, setWarning] = useState('');
  const [userInfoMap, setUserInfoMap] = useState({});
  const [loading, setLoading] = useState(false);
  

  const token = localStorage.getItem('token');

  const handleRoomChange = async (e) => {
    const value = e.target.value.toUpperCase();
    setRoomId(value);
    setMembers([]);
    setSelected([]);
    setUserInfoMap({});
    setWarning('');

    if (!value || !/^[ABC]\d{3}$/i.test(value)) {
      setWarning("Please enter a valid room ID like 'A302'.");
      return;
    }

    setLoading(true);
    try {
      const statusRes = await fetch(`https://hostelmate-nqe3.onrender.com/check_status/${value}`);
      if (!statusRes.ok) throw new Error("Failed to check room status");
      const { status } = await statusRes.json();

      if (status === -1) {
        setWarning('This room is under maintenance. Please choose another.');
        return;
      }

      const membersRes = await fetch(`https://hostelmate-nqe3.onrender.com/room_members/${value}`);
      if (!membersRes.ok) throw new Error("Room not found or invalid");
      const { members: uids } = await membersRes.json();

      if (!uids || !uids.length) {
        setWarning("No members found in this room.");
        return;
      }

      setMembers(uids);

      const userFetches = uids.map((uid) =>
        fetch(`https://hostelmate-nqe3.onrender.com/users/${uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.ok ? res.json() : null)
      );

      const users = await Promise.all(userFetches);
      const userMap = {};
      users.forEach((u, i) => {
        if (u) userMap[uids[i]] = u;
      });

      setUserInfoMap(userMap);
    } catch (error) {
      console.error(error);
      setWarning('Error fetching room info. Please check the room ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (uid) => {
    setSelected((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  const sendRequest = async () => {
    if (selected.length === 0) 
      return Swal.fire({
        icon: 'warning',
        title: 'Oops! No Roomie Selected 🫢',
        text: 'Pick at least one person to exchange room with before sending request 🚀',
        confirmButtonText: 'Gotcha! ✌️',
        background: '#f8fafc', // Light slate-50 (Tailwind light mode)
        color: '#334155', // Slate-700 for dark text
        customClass: {
          popup: 'rounded-2xl shadow-xl',
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold',
        },
        backdrop: `
          rgba(255, 255, 255, 0.6)
          left top
          no-repeat
        `
      });;

    try {
      for (const uid of selected) {
        const res = await fetch(`https://hostelmate-nqe3.onrender.com/request_exchange/${uid}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          console.error(`Failed to send request to ${uid}:`, data);
        }
      }

      alert("Request(s) sent successfully!");
      setRoomId('');
      setMembers([]);
      setSelected([]);
    } catch (err) {
      console.error(err);
      alert("Failed to send request(s).");
    }
  };

  return (
    // darkm mode: bg-gray-900 text-white
    <div className="p-6 rounded-lg shadow-md max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 stroked-font">Request Room Exchange</h2>

      <input
        type="text"
        placeholder="Enter room ID (e.g., B302)"
        value={roomId}
        onChange={handleRoomChange}
        className="w-full p-2 mb-4 bg-theme border border-gray-700 rounded-md text-theme-ink focus:outline-none"
      />

      {warning && <div className="text-yellow-400 text-sm mb-3">{warning}</div>}
      {loading && <div className="text-theme-ink-tertiary mb-2">Loading room data...</div>}

      {members.length > 0 && !loading && (
        <div className="space-y-3">
          <p className="text-sm text-theme-ink-tertiary mb-2">Click to select roommate(s) to send exchange request:</p>
          {members.map((uid) => {
            const user = userInfoMap[uid];
            const isSelected = selected.includes(uid);

            return (
              <div
                key={uid}
                onClick={() => toggleSelect(uid)}
                className={`cursor-pointer p-3 rounded-md border transition-all duration-150 ${
                  isSelected
                    ? 'border-blue-500 bg-gray-700 shadow-inner'
                    : 'border-gray-700 bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <p className="font-medium text-theme-ink">{user?.name || uid}</p>
                <p className="text-sm text-theme-ink-secondary">{uid.toUpperCase()}</p>
              </div>
            );
          })}
          <button
            onClick={sendRequest}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
          >
            Send Request
          </button>
        </div>
      )}
    </div>
  );
}
