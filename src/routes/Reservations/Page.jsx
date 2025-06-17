import { useState } from "react";
import { Search } from "lucide-react";

const guests = [
  {
    name: "Ms Zzzzzzzz",
    bookingId: "1111",
    checkIn: "11/11/2025",
    checkOut: "11/11/2025",
    roomType: "A",
    status: "Confirmed",
  },
  {
    name: "Mr John Smith",
    bookingId: "2222",
    checkIn: "12/12/2025",
    checkOut: "13/12/2025",
    roomType: "B",
    status: "Declined",
  },
  {
    name: "Mrs Anna Lee",
    bookingId: "3333",
    checkIn: "14/12/2025",
    checkOut: "15/12/2025",
    roomType: "C",
    status: "Awaiting",
  },
];

function StatusBadge({ status }) {
  let color = "";
  if (status === "Confirmed") color = "bg-blue-100 text-blue-600";
  else if (status === "Declined") color = "bg-red-100 text-red-500";
  else color = "bg-green-100 text-green-600";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
}

const Reservations = () => {
  const [search, setSearch] = useState("");

  const filteredGuests = guests.filter((guest) =>
    guest.name.toLowerCase().includes(search.toLowerCase()) ||
    guest.bookingId.includes(search) ||
    guest.roomType.toLowerCase().includes(search.toLowerCase()) ||
    guest.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div>
        <p className="name">Reservations</p>
        <p className="labeldash">_______________</p>
      </div>
      {/* Search Layout */}
      <div className="flex justify-end text-black mb-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search by guest or booking ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 pl-4 pr-4 py-2 rounded-full text-sm bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-blue-200 rounded-lg text-black">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Guest</th>
              <th className="px-4 py-2 text-left">Booking ID</th>
              <th className="px-4 py-2 text-left">Check in</th>
              <th className="px-4 py-2 text-left">Check out</th>
              <th className="px-4 py-2 text-left">Room type</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-2"></th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.length > 0 ? (
              filteredGuests.map((guest, idx) => (
                <tr key={idx} className="bg-white border-b last:border-b-0">
                  <td className="flex items-center px-4 py-2">
                    <span className="w-8 h-8 rounded-full bg-gray-200 mr-3 inline-block"></span>
                    <span>
                      <div className="font-medium">
                        {guest.name.split(" ")[0]}
                      </div>
                      <div className="text-xs text-gray-500">
                        {guest.name.split(" ").slice(1).join(" ")}
                      </div>
                    </span>
                  </td>
                  <td className="px-4 py-2">{guest.bookingId}</td>
                  <td className="px-4 py-2">{guest.checkIn}</td>
                  <td className="px-4 py-2">{guest.checkOut}</td>
                  <td className="px-4 py-2">{guest.roomType}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={guest.status} />
                  </td>
                  <td className="px-2 py-2 text-gray-400">&gt;</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 bg-white text-gray-500">
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Reservations;