import { Search } from "lucide-react"

const guests = [
  {
    name: "Ms Zzzzzzzz",
    id: "1111",
    phone: "11111",
    email: "1111@gmail.com",
    status: "Upcoming",
  },
  {
    name: "Ms Zzzzzzzz",
    id: "1111",
    phone: "11111",
    email: "1111@gmail.com",
    status: "Left",
  },
  {
    name: "Ms Zzzzzzzz",
    id: "1111",
    phone: "11111",
    email: "1111@gmail.com",
    status: "Left",
  },
  {
    name: "Ms Zzzzzzzz",
    id: "1111",
    phone: "11111",
    email: "1111@gmail.com",
    status: "Staying",
  },
  {
    name: "Ms Zzzzzzzz",
    id: "1111",
    phone: "11111",
    email: "1111@gmail.com",
    status: "Staying",
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
  return (
    <>
      <div className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 transition-colors dark:bg-slate-50">
        <div>
          <button className="textbtn-ghost size-20">
            Domestic
          </button>
        </div>
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
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Status</th>
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
                <td className="px-4 py-2">{guest.id}</td>
                <td className="px-4 py-2">{guest.phone}</td>
                <td className="px-4 py-2">{guest.email}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={guest.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Guests