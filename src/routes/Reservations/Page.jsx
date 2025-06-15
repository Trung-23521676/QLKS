import { Search } from "lucide-react"

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
    name: "Ms Zzzzzzzz",
    bookingId: "1111",
    checkIn: "11/11/2025",
    checkOut: "11/11/2025",
    roomType: "A",
    status: "Declined",
  },
  {
    name: "Ms Zzzzzzzz",
    bookingId: "1111",
    checkIn: "11/11/2025",
    checkOut: "11/11/2025",
    roomType: "A",
    status: "Declined",
  },
  {
    name: "Ms Zzzzzzzz",
    bookingId: "1111",
    checkIn: "11/11/2025",
    checkOut: "11/11/2025",
    roomType: "A",
    status: "Awaiting",
  },
  {
    name: "Ms Zzzzzzzz",
    bookingId: "1111",
    checkIn: "11/11/2025",
    checkOut: "11/11/2025",
    roomType: "A",
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

const Reservations =() => {
    return (
        <>
        <div className="relative z-10 flex h-[60px] items-end justify-end bg-white px-4 transition-colors dark:bg-slate-50">
                    <div className="input">
                            <Search
                                size={20}
                                className="text-slate-300"
                                
                            />
                            <input
                                type="text"
                                name="search"
                                id="search"
                                placeholder="Search..."
                                className="w-full bg-transparent text-slate-400 outline-0 placeholder:text-slate-300 dark:text-slate-900"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                <table className="min-w-full bg-blue-50 rounded-lg">
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
                    {guests.map((guest, idx) => (
                      <tr key={idx} className="bg-white border-b last:border-b-0">
                        <td className="flex items-center px-4 py-2">
                          <span className="w-8 h-8 rounded-full bg-gray-200 mr-3 inline-block"></span>
                          <span>
                            <div className="font-medium">Ms</div>
                            <div className="text-xs text-gray-500">{guest.name}</div>
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
                    ))}
                  </tbody>
                </table>
              </div>
        </>
    )}

export default Reservations