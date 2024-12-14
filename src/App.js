import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [logs, setLogs] = useState([]); // All logs
  const [filteredLogs, setFilteredLogs] = useState([]); // Logs after filtering
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");

  // Fetch logs from the backend when the component mounts
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("https://ros-log-viewer-backend1.onrender.com/api/logs"); // Updated URL
        const data = await response.json();
        console.log("Fetched logs:", data); // Check if logs are fetched
        setLogs(data.logs); // Set the fetched logs
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, []);

  // Filter logs based on severity and search keyword
  useEffect(() => {
    setFilteredLogs(
      logs.filter((log) => {
        const matchesSeverity =
          severityFilter === "ALL" || log.severity === severityFilter;
        const matchesSearch =
          searchKeyword === "" ||
          log.message.toLowerCase().includes(searchKeyword.toLowerCase());

        return matchesSeverity && matchesSearch;
      })
    );
  }, [logs, severityFilter, searchKeyword]);

  const handleSeverityFilterChange = (e) => {
    setSeverityFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // Function to download filtered logs as a new file
  const downloadFilteredLogs = () => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filtered_logs.json";
    a.click();
    URL.revokeObjectURL(url); // Clean up URL object
  };

  return (
    <div className="App">
      <h1>ROS Log Viewer</h1>

      {/* Filters */}
      <div>
        <label htmlFor="severity">Filter by Severity:</label>
        <select
          id="severity"
          value={severityFilter}
          onChange={handleSeverityFilterChange}
        >
          <option value="ALL">All</option>
          <option value="DEBUG">DEBUG</option>
          <option value="INFO">INFO</option>
          <option value="WARN">WARN</option>
          <option value="ERROR">ERROR</option>
          <option value="FATAL">FATAL</option>
        </select>
      </div>

      <div>
        <label htmlFor="search">Search Logs:</label>
        <input
          type="text"
          id="search"
          value={searchKeyword}
          onChange={handleSearchChange}
          placeholder="Search by keyword"
        />
      </div>

      {/* Download button */}
      <div className="download-button-container">
        <button 
          onClick={downloadFilteredLogs} 
          className="download-button">
          Download Filtered Logs
        </button>
      </div>

      {/* Displaying the parsed logs */}
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Severity</th>
            <th>Node</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.length === 0 ? (
            <tr>
              <td colSpan="4">No logs to display.</td>
            </tr>
          ) : (
            filteredLogs.map((log, index) => (
              <tr key={index}>
                <td>{log.timestamp}</td>
                <td
                  style={{
                    color:
                      log.severity === "ERROR" || log.severity === "FATAL"
                        ? "red"
                        : log.severity === "WARN"
                        ? "orange"
                        : "black",
                  }}
                >
                  {log.severity}
                </td>
                <td>{log.node}</td>
                <td>{log.message}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
