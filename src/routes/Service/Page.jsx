import { useState } from 'react';
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

  return (
    <div>
      {/* ... existing layout from your image, including the header and sidebar */}

      <div className="flex justify-end pt-4 pr-4"> {/* Adjust styling as needed */}
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
          onClick={handleCreateServiceClick}
        >
          Create service
        </button>
      </div>

      {/* Service Table (render your services state here) */}
      <div className="p-4">
        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Request ID</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room number</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Note</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100"></th> {/* For the X button */}
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{service.requestId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{service.roomNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{service.service}</td>
                <td className="px-6 py-4 whitespace-nowrap">{service.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{service.note}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleStatusChange(index)}
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                      service.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {service.status}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-red-600 hover:text-red-900">
                    <X size={20} />
                  </button>
                </td>
              </tr>
            ))}
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