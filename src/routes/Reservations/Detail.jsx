import React from 'react';

const ReservationDetailPopup = ({ reservation, onClose }) => {
  if (!reservation) return null; // Don't render if no reservation data

  // Function to determine badge color based on status
  const getStatusBadgeColor = (status) => {
    if (status === 'Confirmed') return 'bg-blue-100 text-blue-600';
    else if (status === 'Declined') return 'bg-red-100 text-red-500';
    else if (status === 'Awaiting') return 'bg-green-100 text-green-600';
    return '';
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4"> {/* Added p-4 for mobile responsiveness */}
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-4xl max-h-[95vh] overflow-y-auto"> {/* Increased max-w and max-h for bigger size */}
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-2 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Reservation #{reservation.id}</h2>
          <span className="text-sm text-gray-500">
            {reservation.time} UTC+7
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> {/* Increased gap and changed to lg:grid-cols-2 for more distinct columns */}

          {/* Guest Information Block */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gray-300 mr-4 flex-shrink-0"></div>
              <h3 className="text-xl font-semibold text-gray-800">{reservation.guestName}</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-medium text-gray-800 w-16 inline-block">ID</span>: {reservation.guestId}</p>
              <p><span className="font-medium text-gray-800 w-16 inline-block">Phone</span>: {reservation.guestPhone}</p>
              <p><span className="font-medium text-gray-800 w-16 inline-block">Email</span>: {reservation.guestEmail}</p>
              <p><span className="font-medium text-gray-800 w-16 inline-block">Address</span>: {reservation.guestAddress}</p>
              <p><span className="font-medium text-gray-800 w-16 inline-block">Type</span>: {reservation.guestType}</p>
            </div>
          </div>

          {/* Check-in/Check-out and Room Details Block */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-800 font-medium text-base">Check In</p>
                <p className="text-xl font-semibold text-gray-800">{reservation.checkIn}</p>
              </div>
              <div>
                <p className="text-gray-800 font-medium text-base">Check out</p>
                <p className="text-xl font-semibold text-gray-800">{reservation.checkOut}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-800 font-medium text-base">Room type</p>
                <p className="text-xl font-semibold text-gray-800">{reservation.roomType}</p>
              </div>
              <div>
                <p className="text-gray-800 font-medium text-base">Number of rooms</p>
                <p className="text-xl font-semibold text-gray-800">{reservation.numberOfRooms}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-800 font-medium text-base">Adults</p>
                <p className="text-xl font-semibold text-gray-800">{reservation.adults}</p>
              </div>
              <div>
                <p className="text-gray-800 font-medium text-base">Children</p>
                <p className="text-xl font-semibold text-gray-800">{reservation.children}</p>
              </div>
            </div>

            <div>
              <label className="block text-gray-800 font-medium text-sm mb-2">
                Reservations note
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-200"
                readOnly
                value={reservation.reservationNote}
              ></textarea>
            </div>
          </div>

          {/* Payment and Additional Info Block */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-800 font-medium">Paid method</p>
                <p className="text-gray-700">{reservation.paidMethod}</p>
              </div>
              <div>
                <p className="text-gray-800 font-medium">Additional fee</p>
                <p className="text-gray-700">{reservation.additionalFee}</p>
              </div>
            </div>
          </div>

          {/* Status and Assigned Room/Recommendation Block */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="space-y-4 text-sm mb-6">
              <div>
                <p className="text-gray-800 font-medium">Current status</p>
                <span className={`inline-block px-3 py-1 rounded-full font-semibold text-xs ${getStatusBadgeColor(reservation.currentStatus)}`}>
                  {reservation.currentStatus}
                </span>
              </div>
              {/* Conditional rendering for Declined reason */}
              {reservation.currentStatus === 'Declined' && (
                <div>
                  <p className="text-gray-800 font-medium mt-2">Declined reason</p>
                  <span className="inline-block bg-blue-100 text-blue-600 rounded-full px-3 py-1 font-semibold text-xs border border-blue-200">
                    {reservation.declinedReason}
                  </span>
                </div>
              )}
              <div>
                <p className="text-gray-800 font-medium mt-2">Last changed</p>
                <p className="text-gray-700">{reservation.lastChanged}</p>
              </div>
            </div>

            {/* Conditional rendering for Assigned to / Recommended (Awaiting status) or Assigned room / Assign note (Confirmed status) */}
            {reservation.currentStatus === 'Awaiting' ? (
              <>
                <div className="mb-4">
                  <label className="block text-gray-800 font-medium text-sm mb-2">
                    Assigned to
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    readOnly // or make it editable if needed
                    value={reservation.assignedTo || ''}
                  />
                </div>
                <div>
                  <label className="block text-gray-800 font-medium text-sm mb-2">
                    Recommended
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {reservation.recommendedRooms && reservation.recommendedRooms.map((room, index) => (
                      <span key={index} className="px-3 py-1 border border-blue-500 text-blue-600 rounded-full text-sm">
                        {room}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-gray-800 font-medium text-sm">Assigned room</label>
                  <span className="inline-block bg-blue-100 text-blue-600 rounded-full px-3 py-1 font-semibold text-xs border border-blue-200 mt-1">{reservation.assignedRoom}</span>
                </div>
                <div>
                  <label className="block text-gray-800 font-medium text-sm">Assign note</label>
                  <button className="inline-block bg-blue-100 text-blue-600 rounded-full px-3 py-1 font-semibold text-xs border border-blue-200 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200">Add extra bed</button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
          >
            Return
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailPopup;