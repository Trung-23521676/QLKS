import React, { useEffect, useState } from "react";
import "./Table.css";
import { Pencil, X } from "lucide-react";

export default function ServiceTable({ search, onEdit, onDelete }) {
  const [services, setService] = useState([]);

  // Dữ liệu giả
  const getFakeService = () => [
    {
      id: "1",
      serviceId: "A1",
      name: "A",
      price: 1000,
    },
    {
      id: "2",
      serviceId: "A2",
      name: "B",
      price: 2000,
    },
    {
      id: "3",
      serviceId: "A3",
      name: "C",
      price: 3000,
    },
    {
      id: "4",
      serviceId: "A4",
      name: "D",
      price: 4000,
    },
    {
      id: "5",
      serviceId: "A5",
      name: "E",
      price: 5000,
    },
    {
      id: "6",
      serviceId: "A6",
      name: "F",
      price: 6000,
    },
    {
      id: "7",
      serviceId: "A7",
      name: "G",
      price: 7000,
    },
  ];

  useEffect(() => {
    setService(getFakeService());
  }, []);

  const filteredData = search
    ? services.filter((service) =>
        service.serviceId.toLowerCase().includes(search.toLowerCase())
      )
    : services;

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Service ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Adjustment</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.slice().map((service) => (
              <tr key={service.id}>
                <td>{service.serviceId}</td>
                <td>{service.name}</td>
                <td>{service.price}</td>
                <td className="actions">
                  <button className="edit-btn" onClick={() => onEdit(service)}>
                    <Pencil size={16} />
                  </button>
                  <button className="delete-btn" onClick={() => onDelete(service)}>
                    <X size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="no-data">No matching rooms found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
