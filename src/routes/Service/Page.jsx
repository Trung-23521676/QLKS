import { useState, useEffect, useMemo } from 'react';
import {X} from "lucide-react";
import CreateService from './CreateService'; // Adjust the import path as needed

export default function ServicePage() {
  const [showCreateServiceModal, setShowCreateServiceModal] = useState(false);
  const [services, setServices] = useState([
    // Initial service data, similar to your image
    { requestId: "1111", roomNumber: "A045", service: "hi hi", amount: 2, note: "Birthday", status: "Confirmed" },
    { requestId: "1111", roomNumber: "A020", service: "hi hi", amount: 1, note: "", status: "Awaiting" },
    // ... more services
  ]);

  // State for the search input
  const [search, setSearch] = useState("");
  // State for the debounced search input
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleCreateServiceClick = () => {
    setShowCreateServiceModal(true);
  };

  const handleCloseCreateServiceModal = () => {
    setShowCreateServiceModal(false);
  };

  const handleSaveService = (newService) => {
    setServices((prevServices) => [...prevServices, newService]);
  };

  const handleStatusChange = (index) => {
    setServices((prevServices) =>
      prevServices.map((service, i) =>
        i === index
          ? { ...service, status: service.status === 'Awaiting' ? 'Confirmed' : 'Awaiting' }
          : service
      )
    );
  };

  // Debounce effect for search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Filtered services based on debounced search
  const filteredServices = useMemo(() => {
    if (!debouncedSearch) {
      return services;
    }
    const lowerCaseSearch = debouncedSearch.toLowerCase();
    return services.filter(service =>
      service.requestId.toLowerCase().includes(lowerCaseSearch) ||
      service.roomNumber.toLowerCase().includes(lowerCaseSearch) ||
      service.service.toLowerCase().includes(lowerCaseSearch) ||
      service.note.toLowerCase().includes(lowerCaseSearch)
    );
  }, [services, debouncedSearch]);


  return (
    <div>
      <div className="flex justify-between">
        <div>
          <p className="name">Service</p>
          <p className="labeldash">_________</p>
        </div>
      <div className="flex justify-end items-center pt-4 pr-4 gap-x-4"> {/* Adjusted to allow space for search */}
        {/* Search Input */}
        <input
            type="text"
            placeholder="Search by Service ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 pl-4 pr-4 py-2 rounded-full text-sm bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
          onClick={handleCreateServiceClick}
        >
          Create service
        </button>
      </div>
    </div>
      {/* Service Table */}
      <div className="p-4">
        <table className="min-w-full bg-blue-200 rounded-lg text-black">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Request ID</th>
              <th className="px-4 py-2 text-left">Room number</th>
              <th className="px-4 py-2 text-left">Service</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Note</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th> {/* Column for the X button */}
            </tr>
          </thead>
          <tbody>
            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
                <tr key={index} className="bg-white border-b last:border-b-0">
                  <td className="px-4 py-2">{service.requestId}</td>
                  <td className="px-4 py-2">{service.roomNumber}</td>
                  <td className="px-4 py-2">{service.service}</td>
                  <td className="px-4 py-2">{service.amount}</td>
                  <td className="px-4 py-2">{service.note || "-"}</td> {/* Display "-" if note is empty */}
                  <td className="px-4 py-2">
                    {/* Using the button logic for status change */}
                    <button
                      onClick={() => handleStatusChange(index)}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                        service.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {service.status}
                    </button>
                    {/* If you prefer to use the StatusBadge component for display only, and a separate button for action: */}
                    {/* <StatusBadge status={service.status} /> */}
                  </td>
                  <td className="px-4 py-2">
                    <button className="text-red-600 hover:text-red-900">
                      <X size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-3 text-center bg-white text-gray-500">
                  No matching services found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CreateService Modal */}
      <CreateService
        open={showCreateServiceModal}
        onClose={handleCloseCreateServiceModal}
        onSave={handleSaveService}
      />
    </div>
  );
}