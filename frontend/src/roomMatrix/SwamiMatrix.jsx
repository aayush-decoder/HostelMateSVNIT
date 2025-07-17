// HostelMatrix.jsx
import { useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import gsap from "gsap";
import { orange } from "@mui/material/colors";
import LoadingSpinner from "../components/LoadingSpinner";

const MODE = {
  REQUESTS: 1,
  STATUS: 2,
  BRANCH: 3,
};

const COLOR_MAP = {
  requestOnly: "bg-blue-400",
  incomingOnly: "bg-green-400",
  both: "bg-yellow-400",
  status2: "bg-red-600",
  status1: "bg-orange-400",
  statusNeg1: "bg-purple-500",
  status0: "bg-gray-400",
  same_branch_1: "bg-blue-400",
  same_branch_2: "bg-blue-700",
};

export default function HostelMatrix() {
  const branch_array = ['AI', 'ME', 'CS', 'CH', 'EC', 'EV', 'EE', 'CE', 'MA', 'PH', 'IC', 'EP', 'MC']; // ayush bhai please add more

  const [requests, setRequests] = useState([]);
  const [hostel, setHostel] = useState("swami_fan_wing");
  const [incoming, setIncoming] = useState([]);
  const [Swami, setSwami] = useState({});
  const [Swamisquare, setSwamisquare] = useState({});
  const [branchRooms, setBranchRooms] = useState({});
  const [mode, setMode] = useState(MODE.STATUS);
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState("AI");
  const token = localStorage.getItem("token");
  useEffect(() => {
    /* fetch("http://localhost:8000/me", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => res.json())
    .then(data => {
      const myRequests = data.requestedRooms.map(r => r.roomId);
      setRequests(myRequests);
      return data
    })
    .then(data => {
        setIncoming(data.incommingRequests.map(r => r.room_id));
    }); */

    // Fetch room status for mode 2 (can be batched or paginated)
    fetch("/data/roommates.json")
      .then((res) => res.json())
      .then((data) => {
        setSwami(data);
      });

    fetch("/data/roommates_new.json")
      .then((res) => res.json())
      .then((data) => {
        setSwamisquare(data);
      });
    setLoading(false);
  }, []);

  if (loading || !Swami.A201 || !Swamisquare["55"]) return <LoadingSpinner />;
  const fanWing = {
    "Ground Floor": [
      "55",
      "56",
      "57",
      "58",
      "59",
      "60",
      "61",
      "62",
      "63",
      "64",
      "65",
      "66",
      "67",
      "68",
    ],
    "1st Floor": [
      "102",
      "103",
      "104",
      "106",
      "157",
      "158",
      "159",
      "160",
      "161",
      "162",
      "163",
      "164",
      "165",
      "166",
      "167",
      "168",
      "169",
      "170",
    ],
    "2nd Floor": [
      "201",
      "202",
      "203",
      "204",
      "258",
      "260",
      "261",
      "262",
      "263",
      "264",
      "266",
      "267",
      "268",
      "269",
      "270",
    ],
    "3rd Floor": [
      "301",
      "302",
      "303",
      "304",
      "357",
      "358",
      "359",
      "360",
      "361",
      "362",
      "363",
      "364",
      "365",
      "367",
    ],
    "4th Floor": [
      "401",
      "402",
      "403",
      "404",
      "458",
      "460",
      "462",
      "464",
      "465",
      "466",
      "467",
      "468",
      "469",
      "470",
    ],
    "5th Floor": [
      "501",
      "502",
      "503",
      "504",
      "557",
      "558",
      "559",
      "560",
      "561",
      "562",
      "563",
      "564",
      "565",
      "568",
      "569",
      "570",
    ],
    "6th Floor": [
      "601",
      "602",
      "603",
      "604",
      "658",
      "659",
      "660",
      "661",
      "662",
      "664",
      "666",
    ],
    "7th Floor": ["758", "759", "760", "761", "762", "764", "766"],
    "8th Floor": [
      "801",
      "802",
      "803",
      "804",
      "858",
      "860",
      "861",
      "862",
      "863",
      "864",
      "866",
      "867",
      "868",
      "869",
    ],
  };

  const squareWing = {
    A: {
      2: Array.from({ length: 18 }, (_, i) => `A${201 + i}`),
      3: Array.from({ length: 18 }, (_, i) => `A${301 + i}`),
      4: Array.from({ length: 18 }, (_, i) => `A${401 + i}`),
      5: Array.from({ length: 18 }, (_, i) => `A${501 + i}`),
      6: Array.from({ length: 18 }, (_, i) => `A${601 + i}`),
      7: Array.from({ length: 14 }, (_, i) => `A${701 + i}`),
      8: Array.from({ length: 9 }, (_, i) => `A${801 + i}`),
    },
    B: {
      2: Array.from({ length: 15 }, (_, i) => `B${201 + i}`),
      3: Array.from({ length: 15 }, (_, i) => `B${301 + i}`),
      4: Array.from({ length: 15 }, (_, i) => `B${401 + i}`),
      5: Array.from({ length: 15 }, (_, i) => `B${501 + i}`),
      6: Array.from({ length: 15 }, (_, i) => `B${601 + i}`),
      7: Array.from({ length: 11 }, (_, i) => `B${701 + i}`),
      8: Array.from({ length: 9 }, (_, i) => `B-${801 + i}`),
    },
    C: {
      2: Array.from({ length: 18 }, (_, i) => `C${201 + i}`),
      3: Array.from({ length: 18 }, (_, i) => `C${301 + i}`),
      4: Array.from({ length: 18 }, (_, i) => `C${401 + i}`),
      5: Array.from({ length: 18 }, (_, i) => `C${501 + i}`),
      6: Array.from({ length: 18 }, (_, i) => `C${601 + i}`),
      7: Array.from({ length: 14 }, (_, i) => `C${701 + i}`),
      8: Array.from({ length: 9 }, (_, i) => `C${801 + i}`),
    },
  };

  const renderRoom = (roomId) => {
    let database = Swami;
    if (hostel == "swami_fan_wing") {
      database = Swami;
    } else if (hostel == "swami_square_wing") {
      database = Swamisquare;
    }
    const status = database[roomId] ? database[roomId].roommates.length : 0;
    const users = database[roomId] ? database[roomId].roommates : null; //now both room occupants
    const requested = requests.includes(roomId);
    const incomingReq = incoming.includes(roomId);

    let bgClass = "bg-gray-600";
    let tooltip = "";

    if (mode === MODE.REQUESTS) {
      if (requested && incomingReq) {
        bgClass = COLOR_MAP.both;
        tooltip = `🎉 Swapping Match! ${user?.name || "Someone"} @ ${roomId}`;
      } else if (requested) {
        bgClass = COLOR_MAP.requestOnly;
        tooltip = `Requested ${roomId}`;
      } else if (incomingReq) {
        bgClass = COLOR_MAP.incomingOnly;
        tooltip = `Incoming request from ${user?.name || "someone"}`;
      }
    } else if (mode === MODE.STATUS) {
      if (status === 2) bgClass = COLOR_MAP.status2;
      else if (status === 1) bgClass = COLOR_MAP.status1;
      else if (status === -1) bgClass = COLOR_MAP.statusNeg1;
      else bgClass = COLOR_MAP.status0;

      if (users && users.length>0) {
        tooltip=``;
        users.forEach((e)=>{
          tooltip += `${e?.name}-(${e?.admission_no}) `;
        })
        
      } else if (status == -1) {
        tooltip = "Maintainance Room";
      } else {
        tooltip = "No Data Available. Please contribute if you know.";
      }
    }
    //mode = branch
    else {
      if (database[roomId]) {
        const branch_array = [];
        database[roomId].roommates.forEach((e) => {
          const match = e.admission_no
            .match(/(U|I)\d{2}([A-Z]{2})\d{3}/);

          if (match) {
            const matched_branch = match[2]; // "ai"
            if (branch === matched_branch) branch_array.push(e);
          }
        });

        if (branch_array.length == 2) {
          bgClass = COLOR_MAP.same_branch_2;
          tooltip = `${database[roomId].roommates[0].name}-(${database[roomId].roommates[0].admission_no}) and ${database[roomId].roommates[1].name}-(${database[roomId].roommates[1].admission_no})`;
        } else if (branch_array.length == 1) {
          bgClass = COLOR_MAP.same_branch_1;
          tooltip = `${branch_array[0]["name"]}-${branch_array[0]["admission_no"]}`;
        }
      }
    }

    return (
      <>
        <Tooltip key={roomId} title={tooltip} arrow>
         
            <div
              className={`w-12 h-12 m-1 rounded-md text-xs flex  items-center justify-center select-none text-white ${bgClass}`}
            >
              {roomId}
            </div>
        </Tooltip>
        {requests.some((room) => incoming.includes(room)) && (
          <div className="bg-green-600 text-white p-4 rounded-lg mt-6">
            🎉 You and{" "}
            {roomUsers[requests.find((r) => incoming.includes(r))]?.name ||
              "someone"}{" "}
            are ready to swap rooms!
          </div>
        )}
      </>
    );
  };

  const renderSquareWing = () => {
    return (
      <div className="w-full">
        <h2 className="text-white text-xl mb-4">🧿Square Wing</h2>
        {Object.entries(fanWing).map(([floor, rooms]) => (
          <div key={floor}>
            <h3 className="text-gray-300 font-medium mt-4">{floor}</h3>
            <div className="flex flex-wrap">{rooms.map(renderRoom)}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderFanWing = () => {
    return (
      <div className="w-full">
        <h2 className="text-white text-xl mt-8 mb-4">🧿 Fan Wing</h2>
        {Array.from({ length: 7 }, (_, i) => i + 2).map((floor) => (
          <div key={floor} className="mt-6">
            <h3 className="text-gray-300 font-medium">Floor {floor}</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(squareWing).map(([wing, data]) => (
                <div key={wing}>
                  <h4 className="text-gray-400">{wing} Wing</h4>
                  <div className="flex flex-wrap">
                    {data[floor]?.map(renderRoom)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-900 p-4 rounded-xl text-white shadow-xl">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMode(MODE.REQUESTS)}
          className={`px-4 py-2 rounded ${
            mode === MODE.REQUESTS ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Requests Mode
        </button>
        <button
          onClick={() => setMode(MODE.STATUS)}
          className={`px-4 py-2 rounded ${
            mode === MODE.STATUS ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          Room Status Mode
        </button>

        <div>
          <select
            name=""
            id=""
            onChange={(e) => {
              setBranch(e.target.value);
            }}
          >
            {branch_array.map((e, idx) => {
              return (
                <option className="text-black" key={idx} value={e}>
                  {e}
                </option>
              );
            })}
          </select>
          <button
            onClick={() => {
              setMode(MODE.BRANCH);
            }}
            className={`px-4 py-2 rounded ${
              mode === MODE.BRANCH ? " bg-orange-400" : "bg-gray-700"
            }`}
          >
            Branch wise mode
          </button>
        </div>
      </div>
      <select
        name=""
        id=""
        defaultValue={"swami_fan_wing"}
        onChange={(e) => {
          setHostel(e.target.value);
        }}
      >
        {["swami_fan_wing", "swami_square_wing"].map((e, idx) => {
          return (
            <option className="text-black" key={e} value={e}>
              {e}
            </option>
          );
        })}
      </select>
      {hostel === "swami_fan_wing" ? renderFanWing() : null}
      {hostel === "swami_square_wing" ? renderSquareWing() : null}
    </div>
  );
}
