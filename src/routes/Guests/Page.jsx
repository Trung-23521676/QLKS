import { useState } from "react";
import "./Button.css";

const guests = [
  {
    name: "Ms Zzzzzzzz",
    id: "1111",
    phone: "11111",
    email: "1111@gmail.com",
    status: "Upcoming",
    type: "National",
  },
  {
    name: "Mr Yyyyyyyyy",
    id: "2222",
    phone: "22222",
    email: "2222@gmail.com",
    status: "Left",
    type: "International",
  },
  {
    name: "Mrs Xxxxxxxx",
    id: "3333",
    phone: "33333",
    email: "3333@gmail.com",
    status: "Staying",
    type: "National",
  },
  {
    name: "Ms Mmmmmmmm",
    id: "4444",
    phone: "44444",
    email: "4444@gmail.com",
    status: "Staying",
    type: "International",
  },
];

function StatusBadge({ status }) {
  let color = "";
  if (status === "Upcoming") color = "bg-blue-100 text-blue-600";
  else if (status === "Left") color = "bg-red-100 text-red-500";
  else color = "bg-green-100 text-green-600";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
}

const Guests = () => {
  const [showNational, setShowNational] = useState(true);
  const [showInternational, setShowInternational] = useState(true);
  const [search, setSearch] = useState("");

  const filteredGuests = guests.filter((guest) => {
    const matchesType =
      (guest.type === "National" && showNational) ||
      (guest.type === "International" && showInternational);

    const matchesSearch = [guest.name, guest.id, guest.phone, guest.email]
      .some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      );

    return matchesType && matchesSearch;
  });

  return (
    <>
      <div>
        <p className="name">Guests</p>
        <p className="labeldash">________</p>
      </div>
      <div className="flex items-center justify-between mb-4 mt-2">
        <div className="flex space-x-2">
          <button
            className={`px-6 py-2 rounded-full transition font-semibold ${
              showNational
                ? "bg-blue-600 text-white"
                : "border border-blue-600 text-blue-600 bg-transparent"
            }`}
            onClick={() => setShowNational((prev) => !prev)}
          >
            National
          </button>
          <button
            className={`px-6 py-2 rounded-full transition font-semibold ${
              showInternational
                ? "bg-blue-600 text-white"
                : "border border-blue-600 text-blue-600 bg-transparent"
            }`}
            onClick={() => setShowInternational((prev) => !prev)}
          >
            International
          </button>
        </div>

        <div className="flex justify-end text-black w-full max-w-xs">
          <div className="relative w-full">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by name, ID, phone, email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-80 pl-4 pr-4 py-2 rounded-full text-sm bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-blue-200 rounded-lg text-black">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Guest</th>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.length > 0 ? (
              filteredGuests.map((guest, idx) => (
                <tr key={idx} className="bg-white border-b last:border-b-0">
                  <td className="flex items-center px-4 py-2">
                    <span className="w-8 h-8 rounded-full bg-gray-200 mr-3 inline-block" />
                    <span>
                      <div className="font-medium">{guest.name.split(" ")[0]}</div>
                      <div className="text-xs text-gray-500">
                        {guest.name.split(" ").slice(1).join(" ")}
                      </div>
                    </span>
                  </td>
                  <td className="px-4 py-2">{guest.id}</td>
                  <td className="px-4 py-2">{guest.phone}</td>
                  <td className="px-4 py-2">{guest.email}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={guest.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 bg-white text-gray-500">
                  No guests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Guests;
