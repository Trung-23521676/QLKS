import { Bookmark, Ban } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "service",
    title: "Service request",
    code: "1111",
    time: "new",
  },
  {
    id: 2,
    type: "reservation",
    title: "New reservation",
    code: "1111",
    time: "new",
  },
  {
    id: 3,
    type: "service",
    title: "Service request",
    code: "1111",
    time: "before",
  },
  {
    id: 4,
    type: "service",
    title: "Service request",
    code: "1111",
    time: "before",
  },
  {
    id: 5,
    type: "service",
    title: "Service request",
    code: "1111",
    time: "before",
  },
];

export default function NotiBox({ onClose }) {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-100 z-50 max-h-[90vh] overflow-y-auto">
      <div className="p-4 pb-2">
        <div className="text-xs text-gray-400 mb-2">New</div>
        {notifications
          .filter((n) => n.time === "new")
          .map((n) => (
            <div key={n.id} className="flex items-center gap-3 mb-2">
              {n.type === "service" ? (
                <Bookmark size={24} className="text-gray-400" />
              ) : (
                <Ban size={24} className="text-gray-400" />
              )}
              <div>
                <div className="font-medium text-gray-700 text-sm">{n.title}</div>
                <div className="text-xs text-gray-400">{n.code}</div>
              </div>
            </div>
          ))}
        <hr className="my-2" />
        <div className="text-xs text-gray-400 mb-2">Before</div>
        {notifications
          .filter((n) => n.time === "before")
          .map((n) => (
            <div key={n.id} className="flex items-center gap-3 mb-2">
              <Bookmark size={24} className="text-gray-400" />
              <div>
                <div className="font-medium text-gray-700 text-sm">{n.title}</div>
                <div className="text-xs text-gray-400">{n.code}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}