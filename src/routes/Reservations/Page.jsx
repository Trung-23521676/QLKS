import { useState } from "react";
import ReservationDetailPopup from "./Detail.jsx"; // Import the detail popup component

// Expanded mock data with more details for the popup
const reservationsData = [
  {
    id: "1111",
    time: "14:20 18/06/2025",
    guestName: "Ms Zzzzzzzz",
    guestId: "G-12345",
    guestPhone: "098-765-4321",
    guestEmail: "zzzzzzzz@example.com",
    guestAddress: "123 Dreamland Ave, Sleepy Hollow",
    guestType: "VIP",
    checkIn: "11/11/2025",
    checkOut: "11/11/2025",
    roomType: "A",
    numberOfRooms: 1,
    adults: 2,
    children: 0,
    reservationNote: "Prefers a quiet room away from the elevator.",
    paidMethod: "Credit Card",
    additionalFee: "None",
    currentStatus: "Confirmed",
    lastChanged: "10:00 18/06/2025",
    assignedRoom: 'A-101',
    assignNote: 'Extra pillows provided.'
  },
  {
    id: "2222",
    time: "15:30 18/06/2025",
    guestName: "Mr John Smith",
    guestId: "G-67890",
    guestPhone: "091-234-5678",
    guestEmail: "john.smith@example.com",
    guestAddress: "456 Oak St, Anytown",
    guestType: "Regular",
    checkIn: "12/12/2025",
    checkOut: "13/12/2025",
    roomType: "B",
    numberOfRooms: 1,
    adults: 1,
    children: 0,
    reservationNote: "",
    paidMethod: "Cash",
    additionalFee: "$20 Late Checkout Fee",
    currentStatus: "Declined",
    declinedReason: "No rooms available",
    lastChanged: "11:00 18/06/2025",
  },
  {
    id: "3333",
    time: "16:45 18/06/2025",
    guestName: "Mrs Anna Lee",
    guestId: "G-11223",
    guestPhone: "095-555-1234",
    guestEmail: "anna.lee@example.com",
    guestAddress: "789 Pine Ln, Somewhere",
    guestType: "Corporate",
    checkIn: "14/12/2025",
    checkOut: "15/12/2025",
    roomType: "C",
    numberOfRooms: 2,
    adults: 4,
    children: 1,
    reservationNote: "Requires two cribs.",
    paidMethod: "Bank Transfer",
    additionalFee: "None",
    currentStatus: "Awaiting",
    lastChanged: "12:30 18/06/2025",
    assignedTo: 'Front Desk Team',
    recommendedRooms: ['C-301', 'C-302', 'C-304']
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
  const [selectedReservation, setSelectedReservation] = useState(null);

  const filteredGuests = reservationsData.filter((guest) =>
    guest.guestName.toLowerCase().includes(search.toLowerCase()) ||
    guest.id.includes(search) ||
    guest.roomType.toLowerCase().includes(search.toLowerCase()) ||
    guest.currentStatus.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div>
        <p className="name">Reservations</p>
        <div className="labeldash">_____________</div>
      </div>
      {/* Search Layout */}
      <div className="flex justify-end text-black mb-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search by guest, booking ID, etc."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2 rounded-full text-sm bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="min-w-full bg-blue-200 rounded-lg text-black">
            <tr>
              <th className="px-6 py-3">Guest</th>
              <th className="px-6 py-3">Booking ID</th>
              <th className="px-6 py-3">Check in</th>
              <th className="px-6 py-3">Check out</th>
              <th className="px-6 py-3">Room type</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.length > 0 ? (
              filteredGuests.map((guest, idx) => (
                <tr 
                  key={idx} 
                  className="bg-white border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedReservation(guest)}
                >
                  <td className="flex items-center px-6 py-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex-shrink-0"></div>
                    <span className="font-medium text-gray-900">{guest.guestName}</span>
                  </td>
                  <td className="px-6 py-4">{guest.id}</td>
                  <td className="px-6 py-4">{guest.checkIn}</td>
                  <td className="px-6 py-4">{guest.checkOut}</td>
                  <td className="px-6 py-4">{guest.roomType}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={guest.currentStatus} />
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-lg">&gt;</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-8 bg-white text-gray-500">
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Render the detail popup when a reservation is selected */}
      <ReservationDetailPopup
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
      />
    </>
  );
};

export default Reservations;
