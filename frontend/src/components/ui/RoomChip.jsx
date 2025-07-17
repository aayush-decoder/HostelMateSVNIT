import React from "react";

const colorMap = {
  wing: {
    A: {
      primary: "#FF8A80",        // Soft Red
      secondary: "rgba(255, 138, 128, 0.1)",
    },
    B: {
      primary: "#82B1FF",        // Soft Blue
      secondary: "rgba(130, 177, 255, 0.1)",
    },
    C: {
      primary: "#B9F6CA",        // Soft Green
      secondary: "rgba(185, 246, 202, 0.1)",
    },
    default: {
      primary: "#FFD180",        // Soft Orange
      secondary: "rgba(255, 209, 128, 0.1)",
    }
  },
  mtbFloors: [
    { primary: "#F48FB1", secondary: "rgba(244, 143, 177, 0.1)" }, // Floor 0
    { primary: "#CE93D8", secondary: "rgba(206, 147, 216, 0.1)" },
    { primary: "#90CAF9", secondary: "rgba(144, 202, 249, 0.1)" },
    { primary: "#A5D6A7", secondary: "rgba(165, 214, 167, 0.1)" },
    { primary: "#FFF59D", secondary: "rgba(255, 245, 157, 0.1)" },
    { primary: "#FFCC80", secondary: "rgba(255, 204, 128, 0.1)" },
    { primary: "#FFAB91", secondary: "rgba(255, 171, 145, 0.1)" },
    { primary: "#BCAAA4", secondary: "rgba(188, 170, 164, 0.1)" },
    { primary: "#B0BEC5", secondary: "rgba(176, 190, 197, 0.1)" },
    { primary: "#B39DDB", secondary: "rgba(179, 157, 219, 0.1)" }, // Floor 9
  ]
};

const RoomChip = ({ roomId, hostel }) => {
  let color_primary = "", color_secondary = "";

  if (hostel === "MTB") {
    const floor = parseInt(roomId.slice(0, 1));
    const floorColor = colorMap.mtbFloors[floor] || colorMap.mtbFloors[0];
    color_primary = floorColor.primary;
    color_secondary = floorColor.secondary;
  } else {
    let wing = "";
    const match = roomId.match(/^([A-C])\d+/);
    if (match) {
      wing = match[1];
    }
    const wingColor = colorMap.wing[wing] || colorMap.wing.default;
    color_primary = wingColor.primary;
    color_secondary = wingColor.secondary;
  }

  return (
    <span
      className="rounded-full px-3 py-1 text-sm font-medium"
      style={{
        border: `1px solid ${color_primary}`,
        color: color_primary,
        backgroundColor: color_secondary,
      }}
    >
      {roomId}
    </span>
  );
};

export default RoomChip;
