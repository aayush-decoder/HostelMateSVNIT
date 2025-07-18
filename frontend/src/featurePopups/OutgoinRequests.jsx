import React, { useState, useContext, useEffect, useReducer, useRef } from "react";
import LoginContext from "../context/logincontext";
import LoadingSpinner from "../components/LoadingSpinner";
import { Trash2 } from "lucide-react";
import gsap from "gsap";

function OutgoinRequests() {
  const login_info = useContext(LoginContext);
  const [loading, setLoading] = useState(true);
  const token = localStorage.token;
  const [requestedUser, setRequestedUser] = useState([]);
  const [, forceRender] = useReducer(x => x + 1, 0);
  const cardRefs = useRef({});

  useEffect(() => {
    if (!login_info.login) return;
    if (requestedUser.length > 0) return;

    const fetchRequests = async () => {
      try {
        const res = await fetch("http://localhost:8000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        fetchUsers(data.requestedRooms);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async (rooms) => {
      rooms.forEach(async (e) => {
        try {
          const res = await fetch(`http://localhost:8000/users/${e.uid}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          setRequestedUser((prev) => [...prev, data]);
        } catch (error) {
          console.error(error);
        }
      });
    };

    fetchRequests();
  }, [login_info, token]);

  // Animate on mount
  useEffect(() => {
    requestedUser.forEach((_, idx) => {
      const el = cardRefs.current[idx];
      if (el) {
        gsap.fromTo(
          el,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, delay: idx * 0.1, ease: "power3.out" }
        );
      }
    });
  }, [requestedUser]);

  const delete_request = (uid, idx) => {
    const card = cardRefs.current[idx];
    if (card) {
      gsap.to(card, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
        onComplete: async () => {
          try {
            const res = await fetch(`http://localhost:8000/delete_outgoing_requests/${uid}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await res.json();
            if (data.success) {
              alert("Deletion successful. Please reload.");
              setRequestedUser((prev) => prev.filter((_, i) => i !== idx));
              forceRender();
            }
          } catch (error) {
            console.error("Delete failed:", error);
          }
        },
      });
    }
  };

  if (!login_info.login) return;
  if (loading) return <LoadingSpinner />;

  return (
    <div className="mt-2 text-center">
      <h1 className="text-2xl font-bold mb-4 text-white">Outgoing Requests</h1>
      <div className="flex flex-row flex-wrap justify-center w-full items-center gap-4">
        {requestedUser.map((e, idx) => (
          <div
            key={idx}
            ref={(el) => (cardRefs.current[idx] = el)}
            className="p-4 border-2 grow border-gray-700 rounded-xl shadow-md bg-theme-secondary"
          >
            <h3 className="text-lg font-semibold bg-cyan-800 text-theme-ink px-3 py-1 rounded">
              Room ID: {e.roomId}
            </h3>
            <p className="mt-2 text-theme-ink text-base">
              <span className="font-semibold">👤</span> {e.name} {" "} 
              <span className="text-theme-ink-tertiary text-xs">{e.admissionNumber}</span>
            </p>

            <p className="text-theme-ink-secondary text-sm">
              📞{" "}
              {e.contactNumber ? e.contactNumber : "Not updated"}
            </p>

            <div className="flex items-center justify-center">
              <button
              onClick={() => delete_request(e.admissionNumber, idx)}
              className="mt-3 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-all duration-200"
              title="Delete Request"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OutgoinRequests;
