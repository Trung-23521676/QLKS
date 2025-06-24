import React, { useState, useEffect, useRef } from "react";
import "./Guests.css";
import { fetchAllGuests } from "../../API/GuestAPI";
import { fetchGuestTypes } from "../../API/PricesAPI";
import { SlidersHorizontal } from "lucide-react";

export default function Guests() {
  const [guests, setGuests] = useState([]);
  const [guestTypes, setGuestTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedGuestTypeIds, setSelectedGuestTypeIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGuestFilter, setShowGuestFilter] = useState(false);
  const guestFilterRef = useRef(null);
  const guestButtonRef = useRef(null);

  // Fetch guests + guestTypes
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [guestData, guestTypeData] = await Promise.all([
          fetchAllGuests(),
          fetchGuestTypes(),
        ]);

        const transformedGuests = guestData.map((g, index) => ({
          index,
          name: g.fullname,
          id: g.id_card,
          guest_type_id: g.guest_type_id,
          status: g.status,
          address: g.address,
          type: g.guest_type_id === 1 ? "domestic" : "international",
        }));

        setGuests(transformedGuests);
        setGuestTypes(guestTypeData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch guest data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleGuestTypeChange = (id) => {
    setSelectedGuestTypeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

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

  const filteredGuests = guests.filter((g) => {
    const matchSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.id.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === "all" || g.type === selectedType;
    const matchGuestType =
      selectedGuestTypeIds.length === 0 ||
      selectedGuestTypeIds.includes(g.guest_type_id);

    return matchSearch && matchType && matchGuestType;
  });

  return (
    <div className="rooms-container">
      <p className="name">Guests</p>
      <p className="labeldash">__________</p>

      <div className="labelsearch">
        <button
            className="filter"
            ref={guestButtonRef}
            onClick={() => setShowGuestFilter(!showGuestFilter)}
          >
            <SlidersHorizontal size={24} />
          </button>

        <div className="room-header">
          <input
            type="text"
            placeholder="Search by name or ID"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          

          {showGuestFilter && (
            <div className="filter-panel" ref={guestFilterRef}>
              <div>
                <p className="filter-title">Guest type</p>
                <div className="filter-options">
                  {guestTypes.map((type) => (
                    <label key={type.guest_type_id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedGuestTypeIds.includes(type.guest_type_id)}
                        onChange={() => handleGuestTypeChange(type.guest_type_id)}
                      />
                      {type.guest_type_name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
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
                <th>Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length > 0 ? (
                filteredGuests.map((g) => (
                  <tr key={g.index}>
                    <td className="guest">{g.name}</td>
                    <td>{g.id}</td>
                    <td>{g.address}</td>
                    <td>
                      <StatusBadge status={g.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="no-data">
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
