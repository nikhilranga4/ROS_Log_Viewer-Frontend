import React, { useEffect, useState } from "react";

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [severityFilter, setSeverityFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch the logs from the backend API
    fetch("http://localhost:8000/api/logs")
      .then((response) => response.json())
      .then((data) => {
        setLogs(data);
        setFilteredLogs(data);
      })
      .catch((error) => console.error("Error fetching logs:", error));
  }, []);

  // Filter logs based on severity
  const handleSeverityFilterChange = (event) => {
    const selectedSeverity = event.target.value;
    setSeverityFilter(selectedSeverity);
    filterLogs(selectedSeverity, searchTerm);
  };

  // Filter logs based on search term
  const handleSearchChange = (event) => {
    const keyword = event.target.value;
    setSearchTerm(keyword);
    filterLogs(severityFilter, keyword);
  };

  // Function to filter logs by severity and search term
  const filterLogs = (severity, search) => {
    let filtered = logs;

    if (severity !== "All") {
      filtered = filtered.filter((log) => log.severity === severity);
    }

    if (search) {
      filtered = filtered.filter((log) =>
        log.message.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  };

  return (
    <div>
      <div>
        <label>Filter by Severity:</label>
        <select
          value={severityFilter}
          onChange={handleSeverityFilterChange}
        >
          <option value="All">All</option>
          <option value="DEBUG">DEBUG</option>
          <option value="INFO">INFO</option>
          <option value="WARN">WARN</option>
          <option value="ERROR">ERROR</option>
          <option value="FATAL">FATAL</option>
        </select>
      </div>

      <div>
        <label>Search Logs:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by keyword"
        />
      </div>

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
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, index) => (
              <tr key={index}>
                <td>{log.timestamp}</td>
                <td>{log.severity}</td>
                <td>{log.node}</td>
                <td>{log.message}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No logs to display.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LogViewer;
