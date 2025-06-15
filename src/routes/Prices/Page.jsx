
import React, { useState } from "react";

import "./prices.css";
import RoomTable from "./RoomTable";
import ServiceTable from "./ServiceTable";

export default function Prices() {
  const [search, setSearch] = useState("");

  return (
    <div className="prices-container">

      <p className="label">Prices</p>
      <p className="labeldash">__________</p>

      <div className="labelsearch">
        <div>
          <p className="label">Rooms</p>
          <p className="labeldash">__________</p>
        </div>

        <div className="prices-header">
        <input
          type="text"
          placeholder="Search by room ID"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}/>

        <button className="create-button">Create room type</button>
        </div>
      </div>

      <div>
          <RoomTable search={search} />
      </div>

      <div className="labelsearch">
        <div>
          <p className="label">Service</p>
          <p className="labeldash">__________</p>
        </div>

        <div className="prices-header">
        <input
          type="text"
          placeholder="Search by service ID"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}/>

        <button className="create-button">Create service</button>
        </div>
      </div>
      <div>
          <ServiceTable search={search} />
        </div>
    </div>
  );
}
