import React, { useEffect, useState } from "react";
import "./Table.css";
import { Pencil, X } from "lucide-react";

export default function ServiceTable({ search, onEdit, onDelete, services }) {

  const filteredData = search
    ? services.filter((services) =>
        services.service_id.toLowerCase().includes(search.toLowerCase())
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.slice().map((services) => (
              <tr key={services.service_id}>
                <td>{services.service_id}</td>
                <td>{services.service_name}</td>
                <td>{services.price_service}</td>
                <td className="actions">
                  <button className="edit-btn" onClick={() => onEdit(services)}>
                    <Pencil size={16} />
                  </button>
                  <button className="delete-btn" onClick={() => onDelete(services)}>
                    <X size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="no-data">No matching services found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
