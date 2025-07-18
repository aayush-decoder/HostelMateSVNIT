import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

const Visualizer = () => {
  const [roommateData, setRoommateData] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [branches, setBranches] = useState([]);
  const [branchCount, setBranchCount] = useState({});
  const branchChartRef = useRef(null);
  const AWingChartRef = useRef(null);
  const BWingChartRef = useRef(null);
  const CWingChartRef = useRef(null);
  const squareWingChartRef = useRef(null);

  const chartInstances = useRef({
    branchChart: null,
    A: null,
    B: null,
    C: null,
    square: null
  });

  const getBranch = admNo => {
    const match = admNo.match(/^[UI]24([A-Z]{2})\d{2,3}$/);
    return match ? match[1] : "UNKNOWN";
  };

  const getFloor = room => {
    const match = room.match(/^[ABC](\d)/);
    return match ? parseInt(match[1]) : null;
  };

  const getWing = room => {
    const match = room.match(/^([ABC])/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const mysite = "aayush-droid-8cb432.netlify.app";
    const api = "roommates_final.json";

    fetch(`https://${mysite}/${api}`)
      .then(res => res.json())
      .then(data => {
        setRoommateData(data);

        const branchesSet = new Set();
        const count = {};

        data.forEach(entry => {
          entry.roommates.forEach(rm => {
            const branch = getBranch(rm.admission_no);
            branchesSet.add(branch);
            count[branch] = (count[branch] || 0) + 1;
          });
        });

        setBranches(Array.from(branchesSet).sort());
        setBranchCount(count);
      });
  }, []);

  useEffect(() => {
    if (!roommateData.length) return;

    renderBranchChart();
    renderFloorCharts();
    renderSquareWingChart();
  }, [roommateData, selectedBranch]);

  const renderBranchChart = () => {
    if (chartInstances.current.branchChart)
      chartInstances.current.branchChart.destroy();

    chartInstances.current.branchChart = new Chart(branchChartRef.current.getContext('2d'), {
      type: 'bar',
      data: {
        labels: Object.keys(branchCount),
        datasets: [{
          label: "Number of Students",
          data: Object.values(branchCount),
          backgroundColor: "rgba(72, 187, 120, 0.7)"
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  };

  const renderFloorCharts = () => {
    const wingFloorMap = { A: Array(8).fill(0), B: Array(8).fill(0), C: Array(8).fill(0) };

    roommateData.forEach(entry => {
      const wing = getWing(entry.room);
      const floor = getFloor(entry.room);
      if (!wing || floor === null) return;

      entry.roommates.forEach(rm => {
        if (!selectedBranch || getBranch(rm.admission_no) === selectedBranch) {
          if (floor >= 1 && floor <= 8) {
            wingFloorMap[wing][floor - 1]++;
          }
        }
      });
    });

    ['A', 'B', 'C'].forEach(wing => {
      const ref = wing === 'A' ? AWingChartRef : wing === 'B' ? BWingChartRef : CWingChartRef;
      if (chartInstances.current[wing]) chartInstances.current[wing].destroy();

      chartInstances.current[wing] = new Chart(ref.current.getContext('2d'), {
        type: 'bar',
        data: {
          labels: Array.from({ length: 8 }, (_, i) => `Floor ${i + 1}`),
          datasets: [{
            label: `${wing} Wing`,
            data: wingFloorMap[wing],
            backgroundColor: 'rgba(59,130,246,0.7)'
          }]
        },
        options: { scales: { y: { beginAtZero: true } } }
      });
    });
  };

  const renderSquareWingChart = () => {
    const squareFloorMap = Array(9).fill(0);

    roommateData.forEach(entry => {
      const room = entry.room;
      if (!/^[0-9]{2,3}$/.test(room)) return;

      let floor = room.length === 2 ? 0 : parseInt(room[0]);
      if (floor >= 0 && floor <= 8) {
        entry.roommates.forEach(rm => {
          if (!selectedBranch || getBranch(rm.admission_no) === selectedBranch) {
            squareFloorMap[floor]++;
          }
        });
      }
    });

    if (chartInstances.current.square) chartInstances.current.square.destroy();

    chartInstances.current.square = new Chart(squareWingChartRef.current.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ["G", "1", "2", "3", "4", "5", "6", "7", "8"].map(f => `Floor ${f}`),
        datasets: [{
          label: "Square Wing",
          data: squareFloorMap,
          backgroundColor: "rgba(250,204,21,0.7)"
        }]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });
  };

  return (
    <div className="bg-gray-900 text-white font-sans p-6">
      <h1 className="text-3xl font-bold">🛏️ Swami Bhawan Room Branch Visualizer</h1>
      <h4 className="text-gray-200 mb-4">
        For any missing data, please contact at <a href="mailto:aayushp336@gmail.com" className="text-sky-300">aayushp336@gmail.com</a>
      </h4>

      <div className="mb-6">
        <label className="block mb-2 text-lg">🔍 Select a branch</label>
        <select
          className="block w-full max-w-xs appearance-none rounded-md border border-theme-ink-secondary bg-theme px-3 py-2 pr-8 text-sm text-theme-ink shadow-sm outline-none transition focus:border-theme-ink focus:ring-1 focus:ring-theme-ink-secondary"
          value={selectedBranch}
          onChange={e => setSelectedBranch(e.target.value)}
        >
          <option value="">-- All Branches --</option>
          {branches.map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
      </div>

      <div className="bg-gray-800 p-4 rounded mb-8">
        <h2 className="text-xl font-semibold mb-2">📊 Students per Branch</h2>
        <canvas ref={branchChartRef} height="100" />
      </div>

      <div className="bg-gray-800 p-4 rounded mb-8">
        <h2 className="text-xl font-semibold mb-4">🏢 Floor Distribution per Wing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><h3 className="text-lg font-semibold mb-2">A Wing</h3><canvas ref={AWingChartRef} /></div>
          <div><h3 className="text-lg font-semibold mb-2">B Wing</h3><canvas ref={BWingChartRef} /></div>
          <div><h3 className="text-lg font-semibold mb-2">C Wing</h3><canvas ref={CWingChartRef} /></div>
          <div><h3 className="text-lg font-semibold mb-2 text-center">🏢 Square Wing Floor Distribution</h3><canvas ref={squareWingChartRef} /></div>
        </div>
      </div>

      {/* <div className="credits text-sm text-gray-200 mb-3">
        Data credit: <a href="https://github.com/adityak1911/FindMyRoomie-SVNIT/blob/main/index.html" target="_blank" rel="noopener noreferrer">GitHub Source</a>
      </div> */}
      <div className="credits text-base text-gray-200 text-center">
        Made by <span className="text-white font-bold">Aayush Prasad (DoAI, 2028)</span> for the sake of helping people
      </div>
    </div>
  );
};

export default Visualizer;
