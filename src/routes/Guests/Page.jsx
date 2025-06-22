<<<<<<< Updated upstream

import React, { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import "./Guests.css";

export default function Guests() {
  const getFakeGuests = () => [
    {
    index: 1,
    name: "Nguyen Van A",
    id: "1001",
    address: "Hanoi, Vietnam",
    type: "domestic",
    status: "Upcoming",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    index: 2,
    name: "Tran Thi B",
    id: "1002",
    address: "Ho Chi Minh City, Vietnam",
    type: "domestic",
    status: "Staying",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    index: 3,
    name: "John Smith",
    id: "1003",
    address: "New York, USA",
    type: "international",
    status: "Left",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    index: 4,
    name: "Nguyen Van C",
    id: "1004",
    address: "Da Nang, Vietnam",
    type: "domestic",
    status: "Staying",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    index: 5,
    name: "Maria Garcia",
    id: "1005",
    address: "Madrid, Spain",
    type: "international",
    status: "Upcoming",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    index: 6,
    name: "Pham Thi D",
    id: "1006",
    address: "Can Tho, Vietnam",
    type: "domestic",
    status: "Left",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    index: 7,
    name: "Liu Wei",
    id: "1007",
    address: "Beijing, China",
    type: "international",
    status: "Staying",
    avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    index: 8,
    name: "Le Van E",
    id: "1008",
    address: "Hai Phong, Vietnam",
    type: "domestic",
    status: "Upcoming",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    index: 9,
    name: "Kim Yuna",
    id: "1009",
    address: "Seoul, South Korea",
    type: "international",
    status: "Staying",
    avatar: "https://i.pravatar.cc/150?img=9",
  },
  {
    index: 10,
    name: "Nguyen Thi F",
    id: "1010",
    address: "Hue, Vietnam",
    type: "domestic",
    status: "Left",
    avatar: "https://i.pravatar.cc/150?img=10",
  },
  {
    index: 11,
    name: "David Brown",
    id: "1011",
    address: "London, UK",
    type: "international",
    status: "Upcoming",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    index: 12,
    name: "Nguyen Van G",
    id: "1012",
    address: "Nha Trang, Vietnam",
    type: "domestic",
    status: "Staying",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    index: 13,
    name: "Satoshi Nakamura",
    id: "1013",
    address: "Tokyo, Japan",
    type: "international",
    status: "Left",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    index: 14,
    name: "Hoang Thi H",
    id: "1014",
    address: "Quang Ninh, Vietnam",
    type: "domestic",
    status: "Upcoming",
    avatar: "https://i.pravatar.cc/150?img=14",
  },
  {
    index: 15,
    name: "Jane Doe",
    id: "1015",
    address: "Toronto, Canada",
    type: "international",
    status: "Staying",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    index: 16,
    name: "Nguyen Van I",
    id: "1016",
    address: "Vung Tau, Vietnam",
    type: "domestic",
    status: "Left",
    avatar: "https://i.pravatar.cc/150?img=16",
  },
  {
    index: 17,
    name: "Alex Johnson",
    id: "1017",
    address: "Sydney, Australia",
    type: "international",
    status: "Staying",
    avatar: "https://i.pravatar.cc/150?img=17",
  },
  {
    index: 18,
    name: "Truong Thi J",
    id: "1018",
    address: "Phu Quoc, Vietnam",
    type: "domestic",
    status: "Upcoming",
    avatar: "https://i.pravatar.cc/150?img=18",
  },
  {
    index: 19,
    name: "Chen Li",
    id: "1019",
    address: "Shanghai, China",
    type: "international",
    status: "Left",
    avatar: "https://i.pravatar.cc/150?img=19",
  },
  {
    index: 20,
    name: "Vo Van K",
    id: "1020",
    address: "Bien Hoa, Vietnam",
    type: "domestic",
    status: "Staying",
    avatar: "https://i.pravatar.cc/150?img=20",
  }
  ];
=======
import React, { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { fetchGuests } from "../../API/GuestAPI";
import "./Guests.css";

export default function Guests() {
  const [search, setSearch] = useState("");
  const [guest, setGuest] = useState([]);
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    const loadGuests = async () => {
      try {
        const data = await fetchGuests();
        setGuest(data);
      } catch (error) {
        console.error("Failed to fetch guests:", error);
        alert("Could not load guest list.");
      }
    };
    loadGuests();
  }, []);
>>>>>>> Stashed changes

  const StatusBadge = ({ status }) => {
    const className = `status-badge ${
      status === "Upcoming"
        ? "status-upcoming"
        : status === "Left"
        ? "status-left"
        : "status-staying"
    }`;
<<<<<<< Updated upstream
    return <span className={className}>{status}</span>;
  };

  const [search, setSearch] = useState("");
  const [guest, setGuest] = useState([]);
  // const [selectedType, setSelectedType] = useState<"all" | "domestic" | "international">("all");
  const [selectedType, setSelectedType] = useState("all");


  useEffect(() => {
    setGuest(getFakeGuests());
  }, []);

  const filteredGuests = Array.isArray(guest)
  ? guest.filter((guest) => {
      const query = search.toLowerCase();
      const matchSearch = guest.name.toLowerCase().includes(query) || guest.id.toLowerCase().includes(query);
      const matchType = selectedType === "all" || guest.type === selectedType;
      return matchSearch && matchType;
    })
  : [];
=======
    const label = status.toLowerCase().charAt(0).toUpperCase() + status.toLowerCase().slice(1);
    return <span className={className}>{label}</span>;
  };

  const filteredGuests = Array.isArray(guest)
    ? guest.filter((guest) => {
        const query = search.toLowerCase();
        const matchSearch =
          guest.name?.toLowerCase().includes(query) ||
          guest.guest_id?.toString().includes(query);
        const matchType = selectedType === (1 || 2) || guest.guest_type_id === selectedType;
        return matchSearch && matchType;
      })
    : [];
>>>>>>> Stashed changes

  return (
    <div className="rooms-container">
      <p className="name">Guests</p>
      <p className="labeldash">__________</p>

      <div className="labelsearch">
        <div>
<<<<<<< Updated upstream
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
        
=======
          <button
            className={`fbutton ${selectedType === (1 & 2) ? "selected" : "outline"}`}
            onClick={() => setSelectedType((1 & 2))}
          >
            All
          </button>

          <button
            className={`fbutton ${selectedType === 1 ? "selected" : "outline"}`}
            onClick={() => setSelectedType(1)}
          >
            Domestic
          </button>

          <button
            className={`fbutton ${selectedType === 2 ? "selected" : "outline"}`}
            onClick={() => setSelectedType(2)}
          >
            International
          </button>
        </div>
>>>>>>> Stashed changes

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
        <table className="table">
          <thead>
            <tr>
<<<<<<< Updated upstream
              <th>Guest</th>
              <th>ID</th>
              <th>Address</th>
=======
              <th>Name</th>
              <th>ID</th>
              {/* <th>Address</th> */}
>>>>>>> Stashed changes
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.length > 0 ? (
              filteredGuests.map((guest, index) => (
<<<<<<< Updated upstream
                <tr key={guest.index}>
                  <td className="guest">
                    {/* <img
                    src={guest.avatar}
                    alt={guest.name}
                    className="w-8 h-8 rounded-full"
                    /> */}
                    {guest.name}
                  </td>
                  <td>{guest.id}</td>
                  <td>{guest.address}</td>
=======
                <tr key={guest.guest_id || index}>
                  <td style={{fontWeight: 'bold'}}>{guest.fullname}</td>
                  <td>{guest.id_card}</td>
                  {/* <td>{guest.address}</td> */}
>>>>>>> Stashed changes
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
      </div>
    </div>
  );
}
