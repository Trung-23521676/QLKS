import React, { useState, useEffect } from "react";
import "./Guests.css";
import { fetchAllGuests } from "../../API/GuestAPI";

export default function Guests() {
  const [guest, setGuest] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all"); // all | domestic | international
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGuests = async () => {
      try {
        setIsLoading(true);
        const dataFromAPI = await fetchAllGuests();
        const transformed = dataFromAPI.map((g, index) => ({
          index,
          name: g.fullname,
          id: g.id_card,
          type: g.guest_type_id === 1 ? "domestic" : "international",
          status: g.status, 
        }));
        setGuest(transformed);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch guests:", err);
        setError("Failed to fetch guests");
      } finally {
        setIsLoading(false);
      }
    };
    loadGuests();
  }, []);

  const StatusBadge = ({ status }) => {
    const label =
      status && typeof status === "string"
        ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
        : "Unknown";
    const className = `status-badge ${
      label.toLowerCase() === "staying"
        ? "status-staying"
        : label.toLowerCase() === "upcoming"
        ? "status-upcoming"
        : "status-left"
    }`;
    return <span className={className}>{label}</span>;
  };

  const filteredGuests = guest.filter((g) => {
    const query = search.toLowerCase();
    const matchSearch =
      g.name.toLowerCase().includes(query) || g.id.toLowerCase().includes(query);
    const matchType = selectedType === "all" || g.type === selectedType;
    return matchSearch && matchType;
  });

  return (
    <div className="rooms-container">
      <p className="name">Guests</p>
      <p className="labeldash">__________</p>

      <div className="labelsearch">
        <div>
          <button
            className={`fbutton ${selectedType === "all" ? "selected" : "outline"}`}
            onClick={() => setSelectedType("all")}
          >
            All
          </button>
          <button
            className={`fbutton ${selectedType === "domestic" ? "selected" : "outline"}`}
            onClick={() => setSelectedType("domestic")}
          >
            Domestic
          </button>
          <button
            className={`fbutton ${selectedType === "international" ? "selected" : "outline"}`}
            onClick={() => setSelectedType("international")}
          >
            International
          </button>
        </div>

        <div className="room-header">
          <input
            type="text"
            placeholder="Search by name or ID"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rtable-container">
        {isLoading && <p className="text-center p-4">Loading guests...</p>}
        {error && <p className="text-center p-4 text-red-500">Error: {error}</p>}

        {!isLoading && !error && (
          <table className="table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length > 0 ? (
                filteredGuests.map((g) => (
                  <tr key={g.index}>
                    <td className="guest">{g.name}</td>
                    <td>{g.id}</td>
                    <td>
                      <StatusBadge status={g.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="no-data">
                    No matching guests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
