import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

export default function RoomSetupModal({ isOpen, onClose }) {
  const [user, setUser] = useState({ name: "", uid: "" });
  const [roomId, setRoomId] = useState("");
  const [hostel, setHostel] = useState("Swami");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef(null);

  const token = localStorage.getItem("token");
  const uid = localStorage.getItem("email")?.split("@")[0].toLowerCase();
  const name = localStorage.getItem("name");

  useEffect(() => {
    if (!isOpen) return;

    // GSAP animation when modal opens
    gsap.fromTo(modalRef.current, {
      y: -50,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power3.out"
    });

    setUser({ uid, name });

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8000/users/${uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Couldn't fetch user");
        const data = await res.json();
        setRoomId(data?.roomId || "");
        setHostel(data?.hostel || "Swami");
        setContact(data?.contactNumber || "");
      } catch (err) {
        console.warn("Letting user fill room manually.");
      }
    };

    fetchUser();
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!roomId || !hostel || !uid || !name) {
      setError("Yo! Please fill in the must-have fields 🌟");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:8000/update_room_details/${roomId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room_id: roomId,
          hostel,
          contact_number: contact || "",
        }),
      });

      const data = await res.json();
      if (data.message?.includes("room is full") || data.message?.includes("under_maintinance")) {
        setError(data.message);
        return;
      }

      alert("✅ Room info locked in!");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Oops! Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-black/50">
      <div
        ref={modalRef}
        className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700"
      >
        <h2 className="text-2xl font-bold mb-4">🏠 Let’s get your space dialed in!</h2>

        {error && <div className="text-red-400 text-sm mb-3">{error}</div>}

        <div className="space-y-4 text-left">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Name</label>
            <input
              type="text"
              readOnly
              value={user.name}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Admission Number</label>
            <input
              type="text"
              readOnly
              value={user.uid}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Room Number</label>
            <input
              type="text"
              value={roomId}
              placeholder="E.g., B302, 317, BF06 (Format Matters 😅)"
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Hostel</label>
            <select
              value={hostel}
              onChange={(e) => setHostel(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
              required
            >
              <option value="Swami">Swami Bhavan 🧘‍♂️</option>
              <option value="Nehru">Nehru Bhavan 🤠</option>
              <option value="MTB">MTB 😎</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Contact Number (optional)</label>
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Just in case, drop your digits 📞"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-all"
            >
              {loading ? "Saving..." : "Save Details"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
