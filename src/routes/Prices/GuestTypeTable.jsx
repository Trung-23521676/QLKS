import React from "react";
import "./Table.css";
import { Pencil, X } from "lucide-react";

export default function GuestTypeTable({ guestTypes, search, onEdit, onDelete }) {
  const filteredData = search
    ? guestTypes.filter((gt) =>
        String(gt.guest_type_name).toLowerCase().includes(search.toLowerCase())
      )
    : guestTypes;

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Guest type ID</th>
            <th>Guest type</th>
            <th>Surcharge</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
  {filteredData.length > 0 ? (
    filteredData.map((gt) => {
      console.log("Guest type item:", gt); // 👈 log ra từng phần tử
      return (
        <tr key={gt.guest_type_id}>
          <td>{gt.guest_type_id}</td>
          <td>{gt.guest_type_name}</td>
          <td>{gt.surcharge_rate}</td>
          <td className="actions">
            <button className="edit-btn" onClick={() => onEdit(gt)}>
              <Pencil size={16} />
            </button>
            <button className="delete-btn" onClick={() => onDelete(gt)}>
              <X size={16} />
            </button>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={4} className="no-data">No matching guest types found.</td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  );
}
