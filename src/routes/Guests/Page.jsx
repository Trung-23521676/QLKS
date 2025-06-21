import React, { useState, useEffect } from "react";
import "./Guests.css";
import { fetchAllGuests } from "../../API/GuestAPI"; // 1. Import hàm API

export default function Guests() {
  // 2. Thêm state cho loading và error
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  // 3. Sử dụng useEffect để fetch dữ liệu thật
  useEffect(() => {
    const loadGuests = async () => {
      try {
        setIsLoading(true);
        const guestsFromDB = await fetchAllGuests();

        // 4. Ánh xạ (map) dữ liệu từ backend sang cấu trúc mà frontend cần
        const transformedGuests = guestsFromDB.map((guest, index) => ({
          index: index + 1,
          name: guest.guest_fullname,
          id: guest.guest_id_card, // Giả sử bạn muốn dùng guest_id_card làm ID
          address: guest.guest_address,
          type: guest.guest_type_name === 'National' ? 'domestic' : 'international',
          status: guest.status, // Giả sử backend trả về status là 'Staying', 'Left', 'Upcoming'
          avatar: `https://i.pravatar.cc/150?img=${index + 1}`, // Giữ nguyên avatar giả
        }));
        
        setGuests(transformedGuests);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch guests:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadGuests();
  }, []); // Mảng rỗng đảm bảo chỉ chạy 1 lần khi component được mount

  const StatusBadge = ({ status }) => {
    const className = `status-badge status-${status?.toLowerCase()}`;
    return <span className={className}>{status}</span>;
  };

  const filteredGuests = guests.filter((guest) => {
      const query = search.toLowerCase();
      const matchSearch = guest.name.toLowerCase().includes(query) || String(guest.id).toLowerCase().includes(query);
      const matchType = selectedType === "all" || guest.type === selectedType;
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
        
        <div className="rheader">
          <input
            type="text"
            placeholder="Search by name or ID"
            className="rsearch-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rtable-container">
        {/* 5. Thêm hiển thị cho trạng thái loading và lỗi */}
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
                filteredGuests.map((guest) => (
                  <tr key={guest.index}>
                    <td className="guest">
                      <img
                        src={guest.avatar}
                        alt={guest.name}
                        className="w-8 h-8 rounded-full"
                      />
                      {guest.name}
                    </td>
                    <td>{guest.id}</td>
                    <td>{guest.address}</td>
                    <td>
                      <StatusBadge status={guest.status} />
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