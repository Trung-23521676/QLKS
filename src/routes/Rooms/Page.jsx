import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

const rooms = [
  { number: "A045", type: "Double bed", floor: "Floor - 1", bookingId: "", status: "Available" },
  { number: "A020", type: "Single bed", floor: "Floor - 2", bookingId: "1111", status: "Booked" },
  { number: "B003", type: "VIP", floor: "Floor - 1", bookingId: "1111", status: "Reserved" },
  { number: "B040", type: "VIP", floor: "Floor - 1", bookingId: "1111", status: "Reserved" },
  { number: "C015", type: "Single bed", floor: "Floor - 1", bookingId: "1111", status: "Reserved" },
];

const statusColors = {
  Available: "bg-blue-100 text-blue-600",
  Booked: "bg-red-100 text-red-600",
  Reserved: "bg-green-100 text-green-600",
};

function StatusBadge({ status }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
      {status}
    </span>
  );
}

export default function Rooms() {
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedFloors, setSelectedFloors] = useState([]);

  const handleTypeChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleFloorChange = (floor) => {
    setSelectedFloors((prev) =>
      prev.includes(floor) ? prev.filter((f) => f !== floor) : [...prev, floor]
    );
  };

  const filteredRooms = rooms.filter((room) => {
    const matchSearch =
      room.number.toLowerCase().includes(search.toLowerCase()) ||
      room.type.toLowerCase().includes(search.toLowerCase()) ||
      room.floor.toLowerCase().includes(search.toLowerCase()) ||
      room.bookingId.toLowerCase().includes(search.toLowerCase()) ||
      room.status.toLowerCase().includes(search.toLowerCase());

    const matchType = selectedTypes.length === 0 || selectedTypes.includes(room.type);
    const matchFloor = selectedFloors.length === 0 || selectedFloors.includes(room.floor);

    return matchSearch && matchType && matchFloor;
  });

  return (
    <>
      <div>
          <p className="name">Prices</p>
          <p className="labeldash">__________</p>
      </div>
      <div className="flex items-center justify-between mb-4 relative">
        <button onClick={() => setShowFilter(!showFilter)}>
          <SlidersHorizontal className="text-gray-900" size={24} />
        </button>
        
        <div className="flex-1 flex justify-end text-black">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search by Request ID, Room, Service, or Note"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-80 pl-4 pr-4 py-2 rounded-full text-sm bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>

        {showFilter && (
          <div className="absolute top-10 left-0 z-10 w-64 p-4 bg-white border rounded-lg shadow-lg text-sm space-y-4 text-black">
            <div>
              <p className="font-semibold mb-1">Bed type</p>
              <div className="flex gap-2 flex-wrap">
                {["Single bed", "Double bed", "VIP"].map((type) => (
                  <label key={type} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeChange(type)}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold mb-1">Room floor</p>
              <div className="flex gap-2 flex-wrap">
                {["Floor - 1", "Floor - 2", "Floor - 3", "Floor - 4", "Floor - 5", "Floor - 6"].map((floor) => (
                  <label key={floor} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={selectedFloors.includes(floor)}
                      onChange={() => handleFloorChange(floor)}
                    />
                    {floor.replace("Floor - ", "")}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold mb-1">Room facility</p>
              <div className="flex gap-2 flex-wrap">
                {["AC", "Shower", "TV", "Bathtub"].map((facility) => (
                  <label key={facility} className="flex items-center gap-1">
                    <input type="checkbox" />
                    {facility}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-blue-200 rounded-lg text-black">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Room number</th>
              <th className="px-4 py-2 text-left">Room type</th>
              <th className="px-4 py-2 text-left">Room floor</th>
              <th className="px-4 py-2 text-left">Booking ID</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <tr key={room.number} className="bg-white border-b last:border-b-0">
                  <td className="px-4 py-2">{room.number}</td>
                  <td className="px-4 py-2">{room.type}</td>
                  <td className="px-4 py-2">{room.floor}</td>
                  <td className="px-4 py-2">{room.bookingId || "-"}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={room.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-center bg-white text-gray-500">
                  No matching rooms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
